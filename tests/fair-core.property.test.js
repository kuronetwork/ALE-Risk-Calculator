/**
 * Property-Based Tests for FAIR Core Module
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * defined in the design document.
 * 
 * @module fair-core.property.test
 */

import fc from 'fast-check';
import {
    autoCorrectPERTOrder,
    createPERTInput,
    calculateTEF,
    calculateTEFFromPERT,
    calculateSusceptibility,
    calculateVulnerability,
    calculateSusceptibilityFromPERT,
    calculateVulnerabilityFromPERT,
    calculateVulnerabilityFromTCRS,
    calculateSecondaryLoss,
    calculateSecondaryLossFromPERT,
    aggregateSecondaryLossCategories
} from '../fair-core.js';

/**
 * Feature: fair-risk-analysis-enhancement
 * Property 6: PERT 順序自動修正 (PERT Order Auto-Correction)
 * 
 * For any PERT input where values are not in ascending order (min ≤ mostLikely ≤ max),
 * the validation engine should auto-correct by sorting the values while preserving
 * all three values.
 * 
 * Validates: Requirements 8.1, 8.2
 */
describe('Property 6: PERT Order Auto-Correction', () => {
    
    // Arbitrary for generating PERT inputs with any order of values
    const pertInputArbitrary = fc.record({
        min: fc.double({ min: -1e9, max: 1e9, noNaN: true }),
        mostLikely: fc.double({ min: -1e9, max: 1e9, noNaN: true }),
        max: fc.double({ min: -1e9, max: 1e9, noNaN: true })
    });

    test('should preserve all three values after correction', () => {
        fc.assert(
            fc.property(pertInputArbitrary, (input) => {
                const corrected = autoCorrectPERTOrder(input);
                
                // All three original values should be present in the corrected output
                const originalValues = [input.min, input.mostLikely, input.max].sort((a, b) => a - b);
                const correctedValues = [corrected.min, corrected.mostLikely, corrected.max].sort((a, b) => a - b);
                
                return originalValues[0] === correctedValues[0] &&
                       originalValues[1] === correctedValues[1] &&
                       originalValues[2] === correctedValues[2];
            }),
            { numRuns: 100 }
        );
    });

    test('should ensure min ≤ mostLikely ≤ max after correction', () => {
        fc.assert(
            fc.property(pertInputArbitrary, (input) => {
                const corrected = autoCorrectPERTOrder(input);
                
                // After correction, values should be in ascending order
                return corrected.min <= corrected.mostLikely && 
                       corrected.mostLikely <= corrected.max;
            }),
            { numRuns: 100 }
        );
    });

    test('should be idempotent - correcting twice yields same result', () => {
        fc.assert(
            fc.property(pertInputArbitrary, (input) => {
                const correctedOnce = autoCorrectPERTOrder(input);
                const correctedTwice = autoCorrectPERTOrder(correctedOnce);
                
                // Applying correction twice should yield the same result
                return correctedOnce.min === correctedTwice.min &&
                       correctedOnce.mostLikely === correctedTwice.mostLikely &&
                       correctedOnce.max === correctedTwice.max;
            }),
            { numRuns: 100 }
        );
    });

    test('should not modify already valid PERT inputs', () => {
        // Generate only valid PERT inputs where min ≤ mostLikely ≤ max
        const validPertArbitrary = fc.tuple(
            fc.double({ min: 0, max: 1e6, noNaN: true }),
            fc.double({ min: 0, max: 1e6, noNaN: true }),
            fc.double({ min: 0, max: 1e6, noNaN: true })
        ).map(([a, b, c]) => {
            const sorted = [a, b, c].sort((x, y) => x - y);
            return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
        });

        fc.assert(
            fc.property(validPertArbitrary, (input) => {
                const corrected = autoCorrectPERTOrder(input);
                
                // Valid inputs should remain unchanged
                return corrected.min === input.min &&
                       corrected.mostLikely === input.mostLikely &&
                       corrected.max === input.max;
            }),
            { numRuns: 100 }
        );
    });

    test('should handle equal values correctly', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 1e6, noNaN: true }),
                (value) => {
                    const input = { min: value, mostLikely: value, max: value };
                    const corrected = autoCorrectPERTOrder(input);
                    
                    // All equal values should remain equal
                    return corrected.min === value &&
                           corrected.mostLikely === value &&
                           corrected.max === value;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should handle reversed order (max < min)', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 1e6, noNaN: true }),
                fc.double({ min: 0, max: 1e6, noNaN: true }),
                fc.double({ min: 0, max: 1e6, noNaN: true }),
                (a, b, c) => {
                    // Create input with potentially reversed order
                    const input = { min: c, mostLikely: b, max: a };
                    const corrected = autoCorrectPERTOrder(input);
                    
                    // After correction, order should be valid
                    return corrected.min <= corrected.mostLikely && 
                           corrected.mostLikely <= corrected.max;
                }
            ),
            { numRuns: 100 }
        );
    });
});


/**
 * Feature: fair-risk-analysis-enhancement
 * Property 1: TEF 分解計算 (TEF Decomposition Calculation)
 * 
 * For any valid Contact Frequency (CF ≥ 0) and Probability of Action (PoA ∈ [0, 100]),
 * the calculated Threat Event Frequency should equal CF × (PoA / 100).
 * 
 * Validates: Requirements 1.2
 */
describe('Property 1: TEF Decomposition Calculation', () => {

    // Arbitrary for valid Contact Frequency (non-negative)
    const cfArbitrary = fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true });
    
    // Arbitrary for valid Probability of Action (0-100 percentage)
    const poaArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    test('should calculate TEF = CF × (PoA / 100) for all valid inputs', () => {
        fc.assert(
            fc.property(cfArbitrary, poaArbitrary, (cf, poa) => {
                const result = calculateTEF(cf, poa);
                const expected = cf * (poa / 100);
                
                // Use approximate equality for floating point comparison
                const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
                return Math.abs(result - expected) <= tolerance;
            }),
            { numRuns: 100 }
        );
    });

    test('should return 0 when Contact Frequency is 0', () => {
        fc.assert(
            fc.property(poaArbitrary, (poa) => {
                const result = calculateTEF(0, poa);
                return result === 0;
            }),
            { numRuns: 100 }
        );
    });

    test('should return 0 when Probability of Action is 0', () => {
        fc.assert(
            fc.property(cfArbitrary, (cf) => {
                const result = calculateTEF(cf, 0);
                return result === 0;
            }),
            { numRuns: 100 }
        );
    });

    test('should return CF when Probability of Action is 100%', () => {
        fc.assert(
            fc.property(cfArbitrary, (cf) => {
                const result = calculateTEF(cf, 100);
                const tolerance = Math.abs(cf) * 1e-10 + 1e-15;
                return Math.abs(result - cf) <= tolerance;
            }),
            { numRuns: 100 }
        );
    });

    test('should be monotonically increasing with CF (PoA fixed)', () => {
        fc.assert(
            fc.property(
                cfArbitrary,
                cfArbitrary,
                poaArbitrary,
                (cf1, cf2, poa) => {
                    const result1 = calculateTEF(cf1, poa);
                    const result2 = calculateTEF(cf2, poa);
                    
                    // If cf1 <= cf2, then TEF1 <= TEF2
                    if (cf1 <= cf2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should be monotonically increasing with PoA (CF fixed)', () => {
        fc.assert(
            fc.property(
                cfArbitrary,
                poaArbitrary,
                poaArbitrary,
                (cf, poa1, poa2) => {
                    const result1 = calculateTEF(cf, poa1);
                    const result2 = calculateTEF(cf, poa2);
                    
                    // If poa1 <= poa2, then TEF1 <= TEF2
                    if (poa1 <= poa2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should calculate TEF from PERT inputs correctly', () => {
        // Arbitrary for valid PERT inputs
        const pertCfArbitrary = fc.tuple(
            fc.double({ min: 0, max: 1e5, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 1e5, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 1e5, noNaN: true, noDefaultInfinity: true })
        ).map(([a, b, c]) => {
            const sorted = [a, b, c].sort((x, y) => x - y);
            return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
        });

        const pertPoaArbitrary = fc.tuple(
            fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true })
        ).map(([a, b, c]) => {
            const sorted = [a, b, c].sort((x, y) => x - y);
            return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
        });

        fc.assert(
            fc.property(pertCfArbitrary, pertPoaArbitrary, (cfPert, poaPert) => {
                const result = calculateTEFFromPERT(cfPert, poaPert);
                
                // Verify each PERT point is calculated correctly
                const expectedMin = cfPert.min * (poaPert.min / 100);
                const expectedMostLikely = cfPert.mostLikely * (poaPert.mostLikely / 100);
                const expectedMax = cfPert.max * (poaPert.max / 100);
                
                const tolerance = 1e-10;
                const minOk = Math.abs(result.min - expectedMin) <= Math.abs(expectedMin) * tolerance + 1e-15;
                const mostLikelyOk = Math.abs(result.mostLikely - expectedMostLikely) <= Math.abs(expectedMostLikely) * tolerance + 1e-15;
                const maxOk = Math.abs(result.max - expectedMax) <= Math.abs(expectedMax) * tolerance + 1e-15;
                
                return minOk && mostLikelyOk && maxOk;
            }),
            { numRuns: 100 }
        );
    });

    test('should produce non-negative TEF for all valid inputs', () => {
        fc.assert(
            fc.property(cfArbitrary, poaArbitrary, (cf, poa) => {
                const result = calculateTEF(cf, poa);
                return result >= 0;
            }),
            { numRuns: 100 }
        );
    });
});


/**
 * Feature: fair-risk-analysis-enhancement
 * Property 2: Vulnerability 計算 (Vulnerability Calculation)
 * 
 * For any valid Susceptibility (∈ [0, 1]) and Control Effectiveness (∈ [0, 100]),
 * the calculated Vulnerability should equal Susceptibility × (1 - Control_Effectiveness / 100).
 * 
 * Validates: Requirements 2.3
 */
describe('Property 2: Vulnerability Calculation', () => {

    // Arbitrary for valid Susceptibility (0.0 to 1.0)
    const susceptibilityArbitrary = fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true });
    
    // Arbitrary for valid Control Effectiveness (0-100 percentage)
    const controlEffectivenessArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    // Arbitrary for valid Threat Capability (1-10 scale)
    const threatCapabilityArbitrary = fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true });
    
    // Arbitrary for valid Resistance Strength (1-10 scale)
    const resistanceStrengthArbitrary = fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true });

    test('should calculate Vulnerability = Susceptibility × (1 - Control_Effectiveness / 100)', () => {
        fc.assert(
            fc.property(susceptibilityArbitrary, controlEffectivenessArbitrary, (susc, ce) => {
                const result = calculateVulnerability(susc, ce);
                const expected = susc * (1 - ce / 100);
                
                // Use approximate equality for floating point comparison
                const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
                return Math.abs(result - expected) <= tolerance;
            }),
            { numRuns: 100 }
        );
    });

    test('should return Susceptibility when Control Effectiveness is 0%', () => {
        fc.assert(
            fc.property(susceptibilityArbitrary, (susc) => {
                const result = calculateVulnerability(susc, 0);
                const tolerance = Math.abs(susc) * 1e-10 + 1e-15;
                return Math.abs(result - susc) <= tolerance;
            }),
            { numRuns: 100 }
        );
    });

    test('should return 0 when Control Effectiveness is 100%', () => {
        fc.assert(
            fc.property(susceptibilityArbitrary, (susc) => {
                const result = calculateVulnerability(susc, 100);
                return Math.abs(result) <= 1e-15; // Should be essentially 0
            }),
            { numRuns: 100 }
        );
    });

    test('should return 0 when Susceptibility is 0', () => {
        fc.assert(
            fc.property(controlEffectivenessArbitrary, (ce) => {
                const result = calculateVulnerability(0, ce);
                return result === 0;
            }),
            { numRuns: 100 }
        );
    });

    test('should be monotonically decreasing with Control Effectiveness (Susceptibility fixed)', () => {
        fc.assert(
            fc.property(
                susceptibilityArbitrary,
                controlEffectivenessArbitrary,
                controlEffectivenessArbitrary,
                (susc, ce1, ce2) => {
                    // Skip if susceptibility is 0 (vulnerability will always be 0)
                    if (susc === 0) return true;
                    
                    const result1 = calculateVulnerability(susc, ce1);
                    const result2 = calculateVulnerability(susc, ce2);
                    
                    // If ce1 <= ce2, then vulnerability1 >= vulnerability2
                    if (ce1 <= ce2) {
                        return result1 >= result2;
                    } else {
                        return result1 <= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should be monotonically increasing with Susceptibility (Control Effectiveness fixed)', () => {
        fc.assert(
            fc.property(
                susceptibilityArbitrary,
                susceptibilityArbitrary,
                controlEffectivenessArbitrary,
                (susc1, susc2, ce) => {
                    const result1 = calculateVulnerability(susc1, ce);
                    const result2 = calculateVulnerability(susc2, ce);
                    
                    // If susc1 <= susc2, then vulnerability1 <= vulnerability2
                    if (susc1 <= susc2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should produce values between 0 and 1 for all valid inputs', () => {
        fc.assert(
            fc.property(susceptibilityArbitrary, controlEffectivenessArbitrary, (susc, ce) => {
                const result = calculateVulnerability(susc, ce);
                return result >= 0 && result <= 1;
            }),
            { numRuns: 100 }
        );
    });

    test('should calculate Susceptibility correctly from Threat Capability and Resistance Strength', () => {
        fc.assert(
            fc.property(threatCapabilityArbitrary, resistanceStrengthArbitrary, (tc, rs) => {
                const result = calculateSusceptibility(tc, rs);
                
                // Susceptibility should be between 0 and 1
                if (result < 0 || result > 1) return false;
                
                // When TC = RS, susceptibility should be 0.5
                if (Math.abs(tc - rs) < 1e-10) {
                    return Math.abs(result - 0.5) <= 1e-10;
                }
                
                // When TC > RS, susceptibility should be > 0.5
                if (tc > rs) {
                    return result > 0.5;
                }
                
                // When TC < RS, susceptibility should be < 0.5
                if (tc < rs) {
                    return result < 0.5;
                }
                
                return true;
            }),
            { numRuns: 100 }
        );
    });

    test('should be monotonically increasing with Threat Capability (Resistance Strength fixed)', () => {
        fc.assert(
            fc.property(
                threatCapabilityArbitrary,
                threatCapabilityArbitrary,
                resistanceStrengthArbitrary,
                (tc1, tc2, rs) => {
                    const result1 = calculateSusceptibility(tc1, rs);
                    const result2 = calculateSusceptibility(tc2, rs);
                    
                    // If tc1 <= tc2, then susceptibility1 <= susceptibility2
                    if (tc1 <= tc2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should be monotonically decreasing with Resistance Strength (Threat Capability fixed)', () => {
        fc.assert(
            fc.property(
                threatCapabilityArbitrary,
                resistanceStrengthArbitrary,
                resistanceStrengthArbitrary,
                (tc, rs1, rs2) => {
                    const result1 = calculateSusceptibility(tc, rs1);
                    const result2 = calculateSusceptibility(tc, rs2);
                    
                    // If rs1 <= rs2, then susceptibility1 >= susceptibility2
                    if (rs1 <= rs2) {
                        return result1 >= result2;
                    } else {
                        return result1 <= result2;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should calculate Susceptibility from PERT inputs correctly', () => {
        // Arbitrary for valid PERT inputs (1-10 scale)
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

        fc.assert(
            fc.property(pertTCArbitrary, pertRSArbitrary, (tcPert, rsPert) => {
                const result = calculateSusceptibilityFromPERT(tcPert, rsPert);
                
                // Verify each PERT point is calculated correctly
                // Min susceptibility: min TC vs max RS
                const expectedMin = calculateSusceptibility(tcPert.min, rsPert.max);
                // Most likely susceptibility: most likely TC vs most likely RS
                const expectedMostLikely = calculateSusceptibility(tcPert.mostLikely, rsPert.mostLikely);
                // Max susceptibility: max TC vs min RS
                const expectedMax = calculateSusceptibility(tcPert.max, rsPert.min);
                
                const tolerance = 1e-10;
                const minOk = Math.abs(result.min - expectedMin) <= Math.abs(expectedMin) * tolerance + 1e-15;
                const mostLikelyOk = Math.abs(result.mostLikely - expectedMostLikely) <= Math.abs(expectedMostLikely) * tolerance + 1e-15;
                const maxOk = Math.abs(result.max - expectedMax) <= Math.abs(expectedMax) * tolerance + 1e-15;
                
                return minOk && mostLikelyOk && maxOk;
            }),
            { numRuns: 100 }
        );
    });

    test('should calculate Vulnerability from PERT Susceptibility correctly', () => {
        // Arbitrary for valid Susceptibility PERT inputs (0.0-1.0)
        const pertSuscArbitrary = fc.tuple(
            fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
            fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true })
        ).map(([a, b, c]) => {
            const sorted = [a, b, c].sort((x, y) => x - y);
            return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
        });

        fc.assert(
            fc.property(pertSuscArbitrary, controlEffectivenessArbitrary, (suscPert, ce) => {
                const result = calculateVulnerabilityFromPERT(suscPert, ce);
                
                // Verify each PERT point is calculated correctly
                const expectedMin = calculateVulnerability(suscPert.min, ce);
                const expectedMostLikely = calculateVulnerability(suscPert.mostLikely, ce);
                const expectedMax = calculateVulnerability(suscPert.max, ce);
                
                const tolerance = 1e-10;
                const minOk = Math.abs(result.min - expectedMin) <= Math.abs(expectedMin) * tolerance + 1e-15;
                const mostLikelyOk = Math.abs(result.mostLikely - expectedMostLikely) <= Math.abs(expectedMostLikely) * tolerance + 1e-15;
                const maxOk = Math.abs(result.max - expectedMax) <= Math.abs(expectedMax) * tolerance + 1e-15;
                
                return minOk && mostLikelyOk && maxOk;
            }),
            { numRuns: 100 }
        );
    });

    test('should calculate Vulnerability from TC/RS PERT inputs correctly (end-to-end)', () => {
        // Arbitrary for valid PERT inputs (1-10 scale)
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

        fc.assert(
            fc.property(pertTCArbitrary, pertRSArbitrary, controlEffectivenessArbitrary, (tcPert, rsPert, ce) => {
                const result = calculateVulnerabilityFromTCRS(tcPert, rsPert, ce);
                
                // Verify the end-to-end calculation
                // Step 1: Calculate susceptibility PERT
                const suscPert = calculateSusceptibilityFromPERT(tcPert, rsPert);
                // Step 2: Calculate vulnerability PERT from susceptibility
                const expected = calculateVulnerabilityFromPERT(suscPert, ce);
                
                const tolerance = 1e-10;
                const minOk = Math.abs(result.min - expected.min) <= Math.abs(expected.min) * tolerance + 1e-15;
                const mostLikelyOk = Math.abs(result.mostLikely - expected.mostLikely) <= Math.abs(expected.mostLikely) * tolerance + 1e-15;
                const maxOk = Math.abs(result.max - expected.max) <= Math.abs(expected.max) * tolerance + 1e-15;
                
                return minOk && mostLikelyOk && maxOk;
            }),
            { numRuns: 100 }
        );
    });
});


/**
 * Feature: fair-risk-analysis-enhancement
 * Property 3: 次要損失計算 (Secondary Loss Calculation)
 * 
 * For any valid Secondary Loss Event Frequency (SLEF ∈ [0, 100]) and 
 * Secondary Loss Magnitude (SLM ≥ 0), the expected secondary loss should 
 * equal (SLEF / 100) × SLM.
 * 
 * Validates: Requirements 3.2
 */
describe('Property 3: Secondary Loss Calculation', () => {

    // Arbitrary for valid SLEF (Secondary Loss Event Frequency, 0-100 percentage)
    const slefArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });
    
    // Arbitrary for valid SLM (Secondary Loss Magnitude, non-negative monetary value)
    const slmArbitrary = fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true });

    test('should calculate Expected Secondary Loss = (SLEF / 100) × SLM for all valid inputs', () => {
        fc.assert(
            fc.property(slefArbitrary, slmArbitrary, (slef, slm) => {
                const result = calculateSecondaryLoss(slef, slm);
                const expected = (slef / 100) * slm;
                
                // Use approximate equality for floating point comparison
                const tolerance = Math.abs(expected) * 1e-10 + 1e-15;
                return Math.abs(result - expected) <= tolerance;
            }),
            { numRuns: 20 }
        );
    });

    test('should return 0 when SLEF is 0% and full SLM when SLEF is 100%', () => {
        fc.assert(
            fc.property(slmArbitrary, (slm) => {
                const resultZero = calculateSecondaryLoss(0, slm);
                const resultFull = calculateSecondaryLoss(100, slm);
                const tolerance = Math.abs(slm) * 1e-10 + 1e-15;
                return resultZero === 0 && Math.abs(resultFull - slm) <= tolerance;
            }),
            { numRuns: 20 }
        );
    });

    test('should be monotonically increasing with SLEF and SLM', () => {
        fc.assert(
            fc.property(
                slefArbitrary,
                slefArbitrary,
                slmArbitrary,
                (slef1, slef2, slm) => {
                    const result1 = calculateSecondaryLoss(slef1, slm);
                    const result2 = calculateSecondaryLoss(slef2, slm);
                    
                    if (slef1 <= slef2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 20 }
        );
    });

    test('should calculate Secondary Loss from PERT inputs correctly', () => {
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
                
                // Also verify order is maintained
                const orderOk = result.min <= result.mostLikely && result.mostLikely <= result.max;
                
                return minOk && mostLikelyOk && maxOk && orderOk;
            }),
            { numRuns: 20 }
        );
    });
});


/**
 * Feature: fair-risk-analysis-enhancement
 * Property 4: 次要損失類別彙總 (Secondary Loss Category Aggregation)
 * 
 * For any set of secondary loss categories with individual probabilities and magnitudes,
 * the total secondary loss should equal the sum of (probability × magnitude) for each
 * enabled category.
 * 
 * Validates: Requirements 3.4
 */
describe('Property 4: Secondary Loss Category Aggregation', () => {

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

    test('should aggregate categories as sum of (probability × mostLikely magnitude) for each category', () => {
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
    });

    test('should return 0 for empty categories array', () => {
        const result = aggregateSecondaryLossCategories([]);
        expect(result).toBe(0);
    });

    test('should return 0 for null/undefined categories', () => {
        expect(aggregateSecondaryLossCategories(null)).toBe(0);
        expect(aggregateSecondaryLossCategories(undefined)).toBe(0);
    });

    test('should skip categories with 0 probability', () => {
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
    });

    test('should be additive - sum of individual category losses equals total', () => {
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
    });

    test('should produce non-negative result for all valid inputs', () => {
        fc.assert(
            fc.property(categoriesArbitrary, (categories) => {
                const result = aggregateSecondaryLossCategories(categories);
                return result >= 0;
            }),
            { numRuns: 20 }
        );
    });
});
