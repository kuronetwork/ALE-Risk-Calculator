/**
 * Property-Based Tests for Percentile Calculation
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * for percentile calculations defined in the design document.
 * 
 * Feature: fair-risk-analysis-enhancement
 * Property 10: 百分位數計算準確性 (Percentile Calculation Accuracy)
 * 
 * @module fair-core.percentile.property.test
 */

import fc from 'fast-check';
import {
    calculatePercentile,
    calculatePercentiles,
    calculateConfidenceInterval
} from '../fair-core.js';

/**
 * Feature: fair-risk-analysis-enhancement
 * Property 10: Percentile Calculation Accuracy
 * 
 * For any simulation result set, the Nth percentile value should be greater than
 * or equal to exactly N% of all values in the set.
 * 
 * **Validates: Requirements 6.4**
 */
describe('Property 10: Percentile Calculation Accuracy', () => {

    // Arbitrary for generating arrays of positive numbers (simulating loss values)
    // Reduced maxLength for faster tests
    const lossArrayArbitrary = fc.array(
        fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        { minLength: 10, maxLength: 200 }
    );

    // Arbitrary for valid percentile values (0-100)
    const percentileArbitrary = fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true });

    test('should return value >= N% of all values for Nth percentile', () => {
        fc.assert(
            fc.property(lossArrayArbitrary, percentileArbitrary, (values, percentile) => {
                const result = calculatePercentile(values, percentile);
                
                // Count how many values are less than or equal to the result
                const countLessOrEqual = values.filter(v => v <= result).length;
                const actualPercentile = (countLessOrEqual / values.length) * 100;
                
                // The actual percentile should be >= the requested percentile
                // Allow small tolerance for edge cases
                return actualPercentile >= percentile - 1 || 
                       // Or the result is at least as large as the minimum value at that percentile
                       countLessOrEqual >= Math.floor(values.length * percentile / 100);
            }),
            { numRuns: 20 }
        );
    });

    test('should return minimum value for 0th percentile', () => {
        fc.assert(
            fc.property(lossArrayArbitrary, (values) => {
                const result = calculatePercentile(values, 0);
                const minValue = Math.min(...values);
                
                return result === minValue;
            }),
            { numRuns: 20 }
        );
    });

    test('should return maximum value for 100th percentile', () => {
        fc.assert(
            fc.property(lossArrayArbitrary, (values) => {
                const result = calculatePercentile(values, 100);
                const maxValue = Math.max(...values);
                
                return result === maxValue;
            }),
            { numRuns: 20 }
        );
    });

    test('should return median for 50th percentile', () => {
        fc.assert(
            fc.property(lossArrayArbitrary, (values) => {
                const result = calculatePercentile(values, 50);
                const sorted = [...values].sort((a, b) => a - b);
                const n = sorted.length;
                
                // For odd length, median is middle element
                // For even length, median is average of two middle elements
                let expectedMedian;
                if (n % 2 === 1) {
                    expectedMedian = sorted[Math.floor(n / 2)];
                } else {
                    expectedMedian = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
                }
                
                // Allow small tolerance for interpolation differences
                const tolerance = Math.abs(expectedMedian) * 0.01 + 1e-10;
                return Math.abs(result - expectedMedian) <= tolerance;
            }),
            { numRuns: 20 }
        );
    });

    test('should be monotonically increasing with percentile', () => {
        fc.assert(
            fc.property(
                lossArrayArbitrary,
                percentileArbitrary,
                percentileArbitrary,
                (values, p1, p2) => {
                    const result1 = calculatePercentile(values, p1);
                    const result2 = calculatePercentile(values, p2);
                    
                    // If p1 <= p2, then percentile1 <= percentile2
                    if (p1 <= p2) {
                        return result1 <= result2;
                    } else {
                        return result1 >= result2;
                    }
                }
            ),
            { numRuns: 20 }
        );
    });

    test('should return same value for all percentiles when all values are equal', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
                fc.integer({ min: 10, max: 50 }),
                percentileArbitrary,
                (value, count, percentile) => {
                    const values = Array(count).fill(value);
                    const result = calculatePercentile(values, percentile);
                    
                    return result === value;
                }
            ),
            { numRuns: 20 }
        );
    });

    test('should handle sorted arrays correctly', () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
                    { minLength: 10, maxLength: 50 }
                ).map(arr => arr.sort((a, b) => a - b)),
                percentileArbitrary,
                (sortedValues, percentile) => {
                    const result = calculatePercentile(sortedValues, percentile);
                    
                    // Result should be within the range of values
                    return result >= sortedValues[0] && result <= sortedValues[sortedValues.length - 1];
                }
            ),
            { numRuns: 20 }
        );
    });

    test('should calculate multiple percentiles correctly', () => {
        // Arbitrary for simulation results with 'total' property
        const resultsArbitrary = fc.array(
            fc.record({
                total: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true })
            }),
            { minLength: 10, maxLength: 100 }
        );

        fc.assert(
            fc.property(resultsArbitrary, (results) => {
                const percentiles = calculatePercentiles(results, [5, 50, 95]);
                
                // Verify all expected keys exist
                if (!('p5' in percentiles) || !('p50' in percentiles) || !('p95' in percentiles)) {
                    return false;
                }
                
                // Verify monotonicity: p5 <= p50 <= p95
                return percentiles.p5 <= percentiles.p50 && percentiles.p50 <= percentiles.p95;
            }),
            { numRuns: 20 }
        );
    });

    test('should calculate confidence interval with correct bounds', () => {
        // Arbitrary for simulation results with 'total' property
        const resultsArbitrary = fc.array(
            fc.record({
                total: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true })
            }),
            { minLength: 20, maxLength: 100 }
        );

        fc.assert(
            fc.property(resultsArbitrary, (results) => {
                const ci = calculateConfidenceInterval(results, 90);
                
                // Verify structure
                if (ci.lower === undefined || ci.median === undefined || 
                    ci.upper === undefined || ci.level === undefined) {
                    return false;
                }
                
                // Verify level is correct
                if (ci.level !== 90) {
                    return false;
                }
                
                // Verify ordering: lower <= median <= upper
                return ci.lower <= ci.median && ci.median <= ci.upper;
            }),
            { numRuns: 20 }
        );
    });

    test('should have confidence interval bounds that contain approximately the specified percentage of values', () => {
        // Arbitrary for simulation results with 'total' property
        const resultsArbitrary = fc.array(
            fc.record({
                total: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true })
            }),
            { minLength: 100, maxLength: 200 }
        );

        fc.assert(
            fc.property(resultsArbitrary, (results) => {
                const ci = calculateConfidenceInterval(results, 90);
                const values = results.map(r => r.total);
                
                // Count values within the confidence interval
                const withinCI = values.filter(v => v >= ci.lower && v <= ci.upper).length;
                const percentageWithin = (withinCI / values.length) * 100;
                
                // Should contain approximately 90% of values (allow some tolerance)
                return percentageWithin >= 85 && percentageWithin <= 95;
            }),
            { numRuns: 20 }
        );
    });

    test('should return 0 for empty arrays', () => {
        const result = calculatePercentile([], 50);
        expect(result).toBe(0);
    });

    test('should return empty object for empty results in calculatePercentiles', () => {
        const result = calculatePercentiles([], [5, 50, 95]);
        expect(result).toEqual({});
    });

    test('should return zeros for empty results in calculateConfidenceInterval', () => {
        const result = calculateConfidenceInterval([], 90);
        expect(result.lower).toBe(0);
        expect(result.median).toBe(0);
        expect(result.upper).toBe(0);
        expect(result.level).toBe(90);
    });

    test('should handle single-element arrays', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
                percentileArbitrary,
                (value, percentile) => {
                    const result = calculatePercentile([value], percentile);
                    return result === value;
                }
            ),
            { numRuns: 20 }
        );
    });

    test('should handle two-element arrays with interpolation', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
                fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
                percentileArbitrary,
                (a, b, percentile) => {
                    const values = [a, b];
                    const result = calculatePercentile(values, percentile);
                    const minVal = Math.min(a, b);
                    const maxVal = Math.max(a, b);
                    
                    // Result should be within the range
                    return result >= minVal && result <= maxVal;
                }
            ),
            { numRuns: 20 }
        );
    });
});
