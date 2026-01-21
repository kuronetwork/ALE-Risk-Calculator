// Minimal property test runner for Vulnerability calculations
import fc from 'fast-check';
import {
    calculateSusceptibility,
    calculateVulnerability,
    calculateSusceptibilityFromPERT,
    calculateVulnerabilityFromPERT,
    calculateVulnerabilityFromTCRS
} from './fair-core.js';

console.log('Running Property 2: Vulnerability Calculation tests...');

// Test 1: Basic vulnerability formula
console.log('\nTest 1: Vulnerability = Susceptibility × (1 - Control_Effectiveness / 100)');
try {
    const susceptibilityArbitrary = fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true });
    const controlEffectivenessArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(susceptibilityArbitrary, controlEffectivenessArbitrary, (susc, ce) => {
            const result = calculateVulnerability(susc, ce);
            const expected = susc * (1 - ce / 100);
            
            const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
            return Math.abs(result - expected) <= tolerance;
        }),
        { numRuns: 100 }
    );
    console.log('✓ PASSED: Basic vulnerability formula');
} catch (error) {
    console.log('✗ FAILED: Basic vulnerability formula -', error.message);
}

// Test 2: Vulnerability bounds (0 to 1)
console.log('\nTest 2: Vulnerability should be between 0 and 1');
try {
    const susceptibilityArbitrary = fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true });
    const controlEffectivenessArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(susceptibilityArbitrary, controlEffectivenessArbitrary, (susc, ce) => {
            const result = calculateVulnerability(susc, ce);
            return result >= 0 && result <= 1;
        }),
        { numRuns: 100 }
    );
    console.log('✓ PASSED: Vulnerability bounds');
} catch (error) {
    console.log('✗ FAILED: Vulnerability bounds -', error.message);
}

// Test 3: Susceptibility calculation properties
console.log('\nTest 3: Susceptibility calculation properties');
try {
    const threatCapabilityArbitrary = fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true });
    const resistanceStrengthArbitrary = fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(threatCapabilityArbitrary, resistanceStrengthArbitrary, (tc, rs) => {
            const result = calculateSusceptibility(tc, rs);
            
            // Susceptibility should be between 0 and 1
            if (result < 0 || result > 1) return false;
            
            // When TC = RS, susceptibility should be 0.5
            if (Math.abs(tc - rs) < 1e-10) {
                return Math.abs(result - 0.5) <= 1e-10;
            }
            
            return true;
        }),
        { numRuns: 100 }
    );
    console.log('✓ PASSED: Susceptibility calculation properties');
} catch (error) {
    console.log('✗ FAILED: Susceptibility calculation properties -', error.message);
}

// Test 4: PERT calculations consistency
console.log('\nTest 4: PERT calculations consistency');
try {
    const pertTCArbitrary = fc.tuple(
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    const pertRSArbitrary = fc.tuple(
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    const controlEffectivenessArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    fc.assert(
        fc.property(pertTCArbitrary, pertRSArbitrary, controlEffectivenessArbitrary, (tcPert, rsPert, ce) => {
            const result = calculateVulnerabilityFromTCRS(tcPert, rsPert, ce);
            
            // Verify the end-to-end calculation
            const suscPert = calculateSusceptibilityFromPERT(tcPert, rsPert);
            const expected = calculateVulnerabilityFromPERT(suscPert, ce);
            
            const tolerance = 1e-10;
            const minOk = Math.abs(result.min - expected.min) <= Math.abs(expected.min) * tolerance + 1e-15;
            const mostLikelyOk = Math.abs(result.mostLikely - expected.mostLikely) <= Math.abs(expected.mostLikely) * tolerance + 1e-15;
            const maxOk = Math.abs(result.max - expected.max) <= Math.abs(expected.max) * tolerance + 1e-15;
            
            return minOk && mostLikelyOk && maxOk;
        }),
        { numRuns: 50 } // Reduced runs to avoid memory issues
    );
    console.log('✓ PASSED: PERT calculations consistency');
} catch (error) {
    console.log('✗ FAILED: PERT calculations consistency -', error.message);
}

console.log('\n=== Property 2: Vulnerability Calculation Tests Complete ===');
console.log('All property tests validate Requirements 2.3');