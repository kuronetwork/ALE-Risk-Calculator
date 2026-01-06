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
    createPERTInput
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
