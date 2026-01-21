// Property test runner for Secondary Loss calculations
import fc from 'fast-check';
import {
    calculateSecondaryLoss,
    calculateSecondaryLossFromPERT
} from './fair-core.js';

console.log('Running Property 3: Secondary Loss Calculation tests...');
console.log('Validates: Requirements 3.2\n');

let passed = 0;
let failed = 0;

// Test 1: Basic secondary loss formula
console.log('Test 1: Expected Secondary Loss = (SLEF / 100) × SLM');
try {
    const slefArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });
    const slmArbitrary = fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(slefArbitrary, slmArbitrary, (slef, slm) => {
            const result = calculateSecondaryLoss(slef, slm);
            const expected = (slef / 100) * slm;
            
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

// Test 2: Boundary conditions
console.log('\nTest 2: Boundary conditions (SLEF=0 returns 0, SLEF=100 returns SLM)');
try {
    const slmArbitrary = fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(slmArbitrary, (slm) => {
            const resultZero = calculateSecondaryLoss(0, slm);
            const resultFull = calculateSecondaryLoss(100, slm);
            const tolerance = Math.abs(slm) * 1e-10 + 1e-15;
            return resultZero === 0 && Math.abs(resultFull - slm) <= tolerance;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 3: Monotonicity
console.log('\nTest 3: Monotonically increasing with SLEF');
try {
    const slefArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });
    const slmArbitrary = fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(slefArbitrary, slefArbitrary, slmArbitrary, (slef1, slef2, slm) => {
            const result1 = calculateSecondaryLoss(slef1, slm);
            const result2 = calculateSecondaryLoss(slef2, slm);
            
            if (slef1 <= slef2) {
                return result1 <= result2;
            } else {
                return result1 >= result2;
            }
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

// Test 4: PERT calculations
console.log('\nTest 4: PERT calculations correctness');
try {
    const slefArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });
    const pertSlmArbitrary = fc.tuple(
        fc.double({ min: 0, max: 1e8, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e8, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e8, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    fc.assert(
        fc.property(slefArbitrary, pertSlmArbitrary, (slef, slmPert) => {
            const result = calculateSecondaryLossFromPERT(slef, slmPert);
            
            const expectedMin = (slef / 100) * slmPert.min;
            const expectedMostLikely = (slef / 100) * slmPert.mostLikely;
            const expectedMax = (slef / 100) * slmPert.max;
            
            const tolerance = 1e-10;
            const minOk = Math.abs(result.min - expectedMin) <= Math.abs(expectedMin) * tolerance + 1e-15;
            const mostLikelyOk = Math.abs(result.mostLikely - expectedMostLikely) <= Math.abs(expectedMostLikely) * tolerance + 1e-15;
            const maxOk = Math.abs(result.max - expectedMax) <= Math.abs(expectedMax) * tolerance + 1e-15;
            const orderOk = result.min <= result.mostLikely && result.mostLikely <= result.max;
            
            return minOk && mostLikelyOk && maxOk && orderOk;
        }),
        { numRuns: 20 }
    );
    console.log('✓ PASSED');
    passed++;
} catch (error) {
    console.log('✗ FAILED:', error.message);
    failed++;
}

console.log('\n=== Property 3: Secondary Loss Calculation Tests Complete ===');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('Feature: fair-risk-analysis-enhancement, Property 3: Secondary Loss Calculation');
console.log('Validates: Requirements 3.2');

process.exit(failed > 0 ? 1 : 0);
