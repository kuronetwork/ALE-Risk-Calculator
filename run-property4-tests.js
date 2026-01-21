// Property test runner for Secondary Loss Category Aggregation
// Feature: fair-risk-analysis-enhancement
// Property 4: 次要損失類別彙總 (Secondary Loss Category Aggregation)
// Validates: Requirements 3.4

import fc from 'fast-check';
import {
    calculateSecondaryLoss,
    aggregateSecondaryLossCategories
} from './fair-core.js';

console.log('Running Property 4: Secondary Loss Category Aggregation tests...');
console.log('Validates: Requirements 3.4\n');

let passed = 0;
let failed = 0;

// Arbitrary for valid category probability (0-100 percentage)
const probabilityArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

// Arbitrary for valid magnitude (non-negative monetary value)
const magnitudeArbitrary = fc.double({ min: 0, max: 1e8, noNaN: true, noDefaultInfinity: true });

// Arbitrary for valid PERT magnitude
const pertMagnitudeArbitrary = fc.tuple(
    magnitudeArbitrary,
    magnitudeArbitrary,
    magnitudeArbitrary
).map(([a, b, c]) => {
    const sorted = [a, b, c].sort((x, y) => x - y);
    return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
});

// Arbitrary for category name
const categoryNameArbitrary = fc.constantFrom('reputation', 'legal', 'regulatory', 'competitive');

// Arbitrary for a single valid category
const categoryArbitrary = fc.record({
    name: categoryNameArbitrary,
    probability: probabilityArbitrary,
    magnitude: pertMagnitudeArbitrary
});

// Arbitrary for array of categories (1-4 categories)
const categoriesArbitrary = fc.array(categoryArbitrary, { minLength: 1, maxLength: 4 });

// Test 1: Aggregation formula
console.log('Test 1: Aggregate = sum of (probability × mostLikely magnitude) for each category');
try {
    fc.assert(
        fc.property(categoriesArbitrary, (categories) => {
            const result = aggregateSecondaryLossCategories(categories);
            
            // Calculate expected sum manually
            let expected = 0;
            for (const cat of categories) {
                expected += (cat.probability / 100) * cat.magnitude.mostLikely;
            }
            
            // Use approximate equality for floating point comparison
            const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
            return Math.abs(result - expected) <= tolerance;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 2: Empty array returns 0
console.log('\nTest 2: Empty categories array returns 0');
try {
    const result = aggregateSecondaryLossCategories([]);
    if (result === 0) {
        console.log('✓ PASSED');
        passed++;
    } else {
        console.log('✗ FAILED: Expected 0, got', result);
        failed++;
    }
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 3: Null/undefined returns 0
console.log('\nTest 3: Null/undefined categories returns 0');
try {
    const resultNull = aggregateSecondaryLossCategories(null);
    const resultUndefined = aggregateSecondaryLossCategories(undefined);
    if (resultNull === 0 && resultUndefined === 0) {
        console.log('✓ PASSED');
        passed++;
    } else {
        console.log('✗ FAILED: Expected 0 for both, got', resultNull, resultUndefined);
        failed++;
    }
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 4: Skip categories with 0 probability
console.log('\nTest 4: Skip categories with 0 probability');
try {
    fc.assert(
        fc.property(pertMagnitudeArbitrary, (magnitude) => {
            const categories = [
                { name: 'reputation', probability: 0, magnitude: magnitude },
                { name: 'legal', probability: 50, magnitude: magnitude }
            ];
            
            const result = aggregateSecondaryLossCategories(categories);
            const expected = (50 / 100) * magnitude.mostLikely;
            
            const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
            return Math.abs(result - expected) <= tolerance;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 5: Additivity - sum of individual equals total
console.log('\nTest 5: Additivity - sum of individual category losses equals total');
try {
    fc.assert(
        fc.property(categoriesArbitrary, (categories) => {
            const totalResult = aggregateSecondaryLossCategories(categories);
            
            // Calculate sum of individual category results
            let sumOfIndividual = 0;
            for (const cat of categories) {
                const singleCatResult = aggregateSecondaryLossCategories([cat]);
                sumOfIndividual += singleCatResult;
            }
            
            const tolerance = Math.abs(totalResult) * 1e-10 + 1e-15;
            return Math.abs(totalResult - sumOfIndividual) <= tolerance;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 6: Non-negative result
console.log('\nTest 6: Result is always non-negative');
try {
    fc.assert(
        fc.property(categoriesArbitrary, (categories) => {
            const result = aggregateSecondaryLossCategories(categories);
            return result >= 0;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

console.log('\n=== Property 4: Secondary Loss Category Aggregation Tests Complete ===');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('Feature: fair-risk-analysis-enhancement, Property 4: Secondary Loss Category Aggregation');
console.log('Validates: Requirements 3.4');

process.exit(failed > 0 ? 1 : 0);
