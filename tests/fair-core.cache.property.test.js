/**
 * Property-Based Tests for FAIR Core Cache Module
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * defined in the design document.
 * 
 * Feature: fair-risk-analysis-enhancement
 * Property 14: 結果快取一致性 (Result Cache Consistency)
 * 
 * @module fair-core.cache.property.test
 */

import fc from 'fast-check';
import {
    hashScenarioInputs,
    setCachedResult,
    getCachedResult,
    hasCachedResult,
    getCachedResultForScenario,
    cacheResultForScenario,
    clearAllCache,
    createScenario
} from '../fair-core.js';

/**
 * Feature: fair-risk-analysis-enhancement
 * Property 14: 結果快取一致性 (Result Cache Consistency)
 * 
 * For any two simulation requests with the same input parameters,
 * the second request should return cached results, and the results
 * should be equivalent.
 * 
 * Validates: Requirements 9.4
 */
describe('Property 14: Result Cache Consistency', () => {

    // Mock localStorage for Node.js environment
    let mockStorage = {};
    
    beforeAll(() => {
        // Setup localStorage mock
        global.localStorage = {
            getItem: (key) => mockStorage[key] || null,
            setItem: (key, value) => { mockStorage[key] = value; },
            removeItem: (key) => { delete mockStorage[key]; },
            clear: () => { mockStorage = {}; },
            get length() { return Object.keys(mockStorage).length; },
            key: (index) => Object.keys(mockStorage)[index] || null
        };
    });

    beforeEach(() => {
        // Clear mock storage before each test
        mockStorage = {};
    });

    afterAll(() => {
        // Cleanup
        delete global.localStorage;
    });

    // Arbitrary for valid PERT inputs (non-negative)
    const pertArbitrary = fc.tuple(
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    // Arbitrary for valid percentage PERT inputs (0-100)
    const pertPercentageArbitrary = fc.tuple(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    // Arbitrary for simulation runs (100-100000)
    const runsArbitrary = fc.integer({ min: 100, max: 100000 });

    // Arbitrary for scenario name
    const nameArbitrary = fc.string({ minLength: 1, maxLength: 50 });

    // Arbitrary for a valid FAIRScenario
    const scenarioArbitrary = fc.record({
        name: nameArbitrary,
        tef: pertArbitrary,
        vulnerability: pertPercentageArbitrary,
        primaryLoss: pertArbitrary,
        secondaryProbability: fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        secondaryMagnitude: pertArbitrary,
        runs: runsArbitrary
    }).map(data => createScenario({
        name: data.name,
        lef: {
            tef: data.tef,
            vulnerability: data.vulnerability
        },
        lm: {
            primaryLoss: data.primaryLoss,
            secondaryLoss: {
                probability: data.secondaryProbability,
                magnitude: data.secondaryMagnitude
            }
        },
        simulationConfig: {
            runs: data.runs
        }
    }));

    // Arbitrary for simulation result
    const resultArbitrary = fc.record({
        aal: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        var90: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        var95: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        minLoss: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        maxLoss: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        median: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        stdDev: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true })
    });

    test('should produce same hash for identical scenario inputs', () => {
        fc.assert(
            fc.property(scenarioArbitrary, (scenario) => {
                // Create a deep copy of the scenario with same inputs
                const scenarioCopy = JSON.parse(JSON.stringify(scenario));
                // Assign different metadata (id, timestamps) but same inputs
                scenarioCopy.id = 'different_id_' + Date.now();
                scenarioCopy.name = 'Different Name';
                scenarioCopy.createdAt = new Date();
                scenarioCopy.updatedAt = new Date();
                
                const hash1 = hashScenarioInputs(scenario);
                const hash2 = hashScenarioInputs(scenarioCopy);
                
                // Hashes should be identical since input parameters are the same
                return hash1 === hash2;
            }),
            { numRuns: 100 }
        );
    });

    test('should return cached result for same scenario inputs (round-trip)', () => {
        fc.assert(
            fc.property(scenarioArbitrary, resultArbitrary, (scenario, result) => {
                // Clear cache first
                mockStorage = {};
                
                // Cache the result
                const cached = cacheResultForScenario(scenario, result);
                if (!cached) return true; // Skip if caching failed
                
                // Retrieve the cached result
                const retrievedResult = getCachedResultForScenario(scenario);
                
                // Result should be equivalent (round-trip property)
                if (!retrievedResult) return false;
                
                // Deep equality check for the result object
                return JSON.stringify(retrievedResult) === JSON.stringify(result);
            }),
            { numRuns: 100 }
        );
    });

    test('should correctly report cache existence with hasCachedResult', () => {
        fc.assert(
            fc.property(scenarioArbitrary, resultArbitrary, (scenario, result) => {
                // Clear cache first
                mockStorage = {};
                
                // Initially should not have cached result
                const beforeCache = hasCachedResult(scenario);
                if (beforeCache) return false;
                
                // Cache the result
                const cached = cacheResultForScenario(scenario, result);
                if (!cached) return true; // Skip if caching failed
                
                // Now should have cached result
                const afterCache = hasCachedResult(scenario);
                return afterCache === true;
            }),
            { numRuns: 100 }
        );
    });

    test('should return null for non-existent cache entries', () => {
        fc.assert(
            fc.property(scenarioArbitrary, (scenario) => {
                // Clear cache first
                mockStorage = {};
                
                // Should return null for non-cached scenario
                const result = getCachedResultForScenario(scenario);
                return result === null;
            }),
            { numRuns: 100 }
        );
    });

    test('cache should be idempotent - caching same result twice yields same retrieval', () => {
        fc.assert(
            fc.property(scenarioArbitrary, resultArbitrary, (scenario, result) => {
                // Clear cache first
                mockStorage = {};
                
                // Cache the result twice
                cacheResultForScenario(scenario, result);
                cacheResultForScenario(scenario, result);
                
                // Retrieve the cached result
                const retrievedResult = getCachedResultForScenario(scenario);
                
                if (!retrievedResult) return false;
                
                // Should still be equivalent
                return JSON.stringify(retrievedResult) === JSON.stringify(result);
            }),
            { numRuns: 100 }
        );
    });
});
