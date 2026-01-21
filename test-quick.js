// Quick test to verify fair-core.js functions work correctly
import {
    autoCorrectPERTOrder,
    calculateTEF,
    calculateSusceptibility,
    calculateVulnerability,
    calculateSecondaryLoss,
    aggregateSecondaryLossCategories
} from './fair-core.js';

console.log('Testing fair-core.js functions...\n');

// Test 1: autoCorrectPERTOrder
console.log('1. autoCorrectPERTOrder:');
const pert1 = { min: 100, mostLikely: 50, max: 10 };
const corrected1 = autoCorrectPERTOrder(pert1);
console.log(`   Input: ${JSON.stringify(pert1)}`);
console.log(`   Output: ${JSON.stringify(corrected1)}`);
console.log(`   Valid: ${corrected1.min <= corrected1.mostLikely && corrected1.mostLikely <= corrected1.max}`);

// Test 2: calculateTEF
console.log('\n2. calculateTEF:');
const tef = calculateTEF(50, 30);
console.log(`   CF=50, PoA=30% => TEF=${tef} (expected: 15)`);
console.log(`   Valid: ${Math.abs(tef - 15) < 0.001}`);

// Test 3: calculateSusceptibility
console.log('\n3. calculateSusceptibility:');
const susc1 = calculateSusceptibility(5, 5);
console.log(`   TC=5, RS=5 => Susc=${susc1} (expected: 0.5)`);
console.log(`   Valid: ${Math.abs(susc1 - 0.5) < 0.001}`);

// Test 4: calculateVulnerability
console.log('\n4. calculateVulnerability:');
const vuln = calculateVulnerability(0.5, 50);
console.log(`   Susc=0.5, CE=50% => Vuln=${vuln} (expected: 0.25)`);
console.log(`   Valid: ${Math.abs(vuln - 0.25) < 0.001}`);

// Test 5: calculateSecondaryLoss
console.log('\n5. calculateSecondaryLoss:');
const sl = calculateSecondaryLoss(50, 100000);
console.log(`   SLEF=50%, SLM=100000 => SL=${sl} (expected: 50000)`);
console.log(`   Valid: ${Math.abs(sl - 50000) < 0.001}`);

// Test 6: aggregateSecondaryLossCategories
console.log('\n6. aggregateSecondaryLossCategories:');
const categories = [
    { name: 'reputation', probability: 50, magnitude: { min: 10000, mostLikely: 50000, max: 100000 } },
    { name: 'legal', probability: 30, magnitude: { min: 20000, mostLikely: 80000, max: 150000 } }
];
const agg = aggregateSecondaryLossCategories(categories);
const expected = (50/100 * 50000) + (30/100 * 80000);
console.log(`   Categories: ${JSON.stringify(categories)}`);
console.log(`   Aggregated: ${agg} (expected: ${expected})`);
console.log(`   Valid: ${Math.abs(agg - expected) < 0.001}`);

console.log('\n✅ All basic function tests completed!');
