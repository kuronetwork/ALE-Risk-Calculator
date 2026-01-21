/**
 * Property-Based Tests for FAIR Core Persistence Manager
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * for scenario persistence (save, load, list, delete).
 * 
 * Note: These tests use a mock localStorage implementation for Node.js environment.
 * 
 * @module fair-core.persistence.property.test
 */

import fc from 'fast-check';
import {
    createDefaultScenario,
    createPERTInput,
    generateScenarioId,
    saveScenario,
    loadScenario,
    listScenarios,
    deleteScenario,
    clearAllScenarios,
    getScenarioCount,
    isScenarioLimitReached,
    exportScenariosToJSON,
    importScenariosFromJSON,
    MAX_SCENARIOS,
    SCENARIO_STORAGE_KEY
} from '../fair-core.js';

// Mock localStorage for Node.js environment
class MockLocalStorage {
    constructor() {
        this.store = {};
    }
    
    getItem(key) {
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        this.store[key] = String(value);
    }
    
    removeItem(key) {
        delete this.store[key];
    }
    
    clear() {
        this.store = {};
    }
    
    key(index) {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
    
    get length() {
        return Object.keys(this.store).length;
    }
}

// Setup mock localStorage before tests
beforeAll(() => {
    global.localStorage = new MockLocalStorage();
});

// Clear localStorage before each test
beforeEach(() => {
    global.localStorage.clear();
});

// Cleanup after all tests
afterAll(() => {
    delete global.localStorage;
});

/**
 * Feature: fair-risk-analysis-enhancement
 * Property 7: 資料持久化往返 (Data Persistence Round-Trip)
 * 
 * For any valid FAIRScenario object, saving to storage then loading should
 * return an equivalent object. Similarly, exporting to JSON and importing
 * should preserve all data.
 * 
 * Validates: Requirements 7.1, 7.3, 7.5
 */
describe('Property 7: Data Persistence Round-Trip', () => {

    // Arbitrary for valid PERT inputs
    const pertArbitrary = fc.tuple(
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    // Arbitrary for valid percentage PERT inputs (0-100)
    const percentagePertArbitrary = fc.tuple(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true })
    ).map(([a, b, c]) => {
        const sorted = [a, b, c].sort((x, y) => x - y);
        return { min: sorted[0], mostLikely: sorted[1], max: sorted[2] };
    });

    // Arbitrary for scenario name
    const scenarioNameArbitrary = fc.string({ minLength: 1, maxLength: 100 })
        .filter(s => s.trim().length > 0);

    // Arbitrary for a valid FAIR scenario
    const scenarioArbitrary = fc.record({
        name: scenarioNameArbitrary,
        tef: pertArbitrary,
        vulnerability: percentagePertArbitrary,
        primaryLoss: pertArbitrary,
        secondaryProbability: fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        secondaryMagnitude: pertArbitrary,
        simulationRuns: fc.integer({ min: 100, max: 100000 })
    }).map(data => {
        const scenario = createDefaultScenario(data.name);
        scenario.lef.tef = data.tef;
        scenario.lef.vulnerability = data.vulnerability;
        scenario.lm.primaryLoss = data.primaryLoss;
        scenario.lm.secondaryLoss = {
            probability: data.secondaryProbability,
            magnitude: data.secondaryMagnitude
        };
        scenario.simulationConfig.runs = data.simulationRuns;
        return scenario;
    });

    test('should preserve scenario data after save and load round-trip', () => {
        fc.assert(
            fc.property(scenarioArbitrary, (scenario) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Save the scenario
                const saveResult = saveScenario(scenario);
                if (!saveResult.success) {
                    return false;
                }
                
                // Load the scenario
                const loaded = loadScenario(scenario.id);
                if (!loaded) {
                    return false;
                }
                
                // Verify key properties are preserved
                const nameMatch = loaded.name === scenario.name;
                const idMatch = loaded.id === scenario.id;
                
                // Verify LEF data
                const tefMatch = 
                    loaded.lef.tef.min === scenario.lef.tef.min &&
                    loaded.lef.tef.mostLikely === scenario.lef.tef.mostLikely &&
                    loaded.lef.tef.max === scenario.lef.tef.max;
                
                const vulnMatch = 
                    loaded.lef.vulnerability.min === scenario.lef.vulnerability.min &&
                    loaded.lef.vulnerability.mostLikely === scenario.lef.vulnerability.mostLikely &&
                    loaded.lef.vulnerability.max === scenario.lef.vulnerability.max;
                
                // Verify LM data
                const plMatch = 
                    loaded.lm.primaryLoss.min === scenario.lm.primaryLoss.min &&
                    loaded.lm.primaryLoss.mostLikely === scenario.lm.primaryLoss.mostLikely &&
                    loaded.lm.primaryLoss.max === scenario.lm.primaryLoss.max;
                
                const slMatch = 
                    loaded.lm.secondaryLoss.probability === scenario.lm.secondaryLoss.probability &&
                    loaded.lm.secondaryLoss.magnitude.min === scenario.lm.secondaryLoss.magnitude.min &&
                    loaded.lm.secondaryLoss.magnitude.mostLikely === scenario.lm.secondaryLoss.magnitude.mostLikely &&
                    loaded.lm.secondaryLoss.magnitude.max === scenario.lm.secondaryLoss.magnitude.max;
                
                // Verify simulation config
                const runsMatch = loaded.simulationConfig.runs === scenario.simulationConfig.runs;
                
                return nameMatch && idMatch && tefMatch && vulnMatch && plMatch && slMatch && runsMatch;
            }),
            { numRuns: 100 }
        );
    });

    test('should preserve scenario data after JSON export and import round-trip', () => {
        fc.assert(
            fc.property(scenarioArbitrary, (scenario) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Save the scenario
                const saveResult = saveScenario(scenario);
                if (!saveResult.success) {
                    return false;
                }
                
                // Export to JSON
                const json = exportScenariosToJSON();
                
                // Clear storage
                global.localStorage.clear();
                
                // Import from JSON
                const importResult = importScenariosFromJSON(json);
                if (!importResult.success || importResult.imported !== 1) {
                    return false;
                }
                
                // Load the scenario
                const loaded = loadScenario(scenario.id);
                if (!loaded) {
                    return false;
                }
                
                // Verify key properties are preserved
                const nameMatch = loaded.name === scenario.name;
                const idMatch = loaded.id === scenario.id;
                
                // Verify LEF data
                const tefMatch = 
                    loaded.lef.tef.min === scenario.lef.tef.min &&
                    loaded.lef.tef.mostLikely === scenario.lef.tef.mostLikely &&
                    loaded.lef.tef.max === scenario.lef.tef.max;
                
                return nameMatch && idMatch && tefMatch;
            }),
            { numRuns: 100 }
        );
    });

    test('should return null when loading non-existent scenario', () => {
        fc.assert(
            fc.property(fc.string({ minLength: 10, maxLength: 50 }), (randomId) => {
                const loaded = loadScenario(randomId);
                return loaded === null;
            }),
            { numRuns: 100 }
        );
    });

    test('should update existing scenario when saving with same ID', () => {
        fc.assert(
            fc.property(scenarioArbitrary, scenarioNameArbitrary, (scenario, newName) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Save the original scenario
                const saveResult1 = saveScenario(scenario);
                if (!saveResult1.success) {
                    return false;
                }
                
                // Modify and save again with same ID
                const modifiedScenario = { ...scenario, name: newName };
                const saveResult2 = saveScenario(modifiedScenario);
                if (!saveResult2.success) {
                    return false;
                }
                
                // Load and verify
                const loaded = loadScenario(scenario.id);
                if (!loaded) {
                    return false;
                }
                
                // Should have the new name
                const nameUpdated = loaded.name === newName;
                
                // Should still have only one scenario
                const countCorrect = getScenarioCount() === 1;
                
                return nameUpdated && countCorrect;
            }),
            { numRuns: 100 }
        );
    });

    test('should delete scenario and return success', () => {
        fc.assert(
            fc.property(scenarioArbitrary, (scenario) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Save the scenario
                const saveResult = saveScenario(scenario);
                if (!saveResult.success) {
                    return false;
                }
                
                // Verify it exists
                const beforeDelete = loadScenario(scenario.id);
                if (!beforeDelete) {
                    return false;
                }
                
                // Delete the scenario
                const deleteResult = deleteScenario(scenario.id);
                if (!deleteResult.success) {
                    return false;
                }
                
                // Verify it no longer exists
                const afterDelete = loadScenario(scenario.id);
                return afterDelete === null;
            }),
            { numRuns: 100 }
        );
    });
});


/**
 * Feature: fair-risk-analysis-enhancement
 * Property 11: 情境限制執行 (Scenario Limit Enforcement)
 * 
 * For any attempt to save more than 10 scenarios, the system should reject
 * the save or replace the oldest scenario, maintaining exactly 10 or fewer scenarios.
 * 
 * Validates: Requirements 4.1
 */
describe('Property 11: Scenario Limit Enforcement', () => {

    // Arbitrary for scenario name
    const scenarioNameArbitrary = fc.string({ minLength: 1, maxLength: 50 })
        .filter(s => s.trim().length > 0);

    // Helper to create a simple scenario with unique ID
    const createSimpleScenario = (name) => {
        const scenario = createDefaultScenario(name);
        return scenario;
    };

    test('should never exceed MAX_SCENARIOS limit', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioNameArbitrary, { minLength: 1, maxLength: 20 }),
                (names) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const name of names) {
                        const scenario = createSimpleScenario(name);
                        saveScenario(scenario);
                    }
                    
                    // Verify count never exceeds MAX_SCENARIOS
                    const count = getScenarioCount();
                    return count <= MAX_SCENARIOS;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should maintain exactly MAX_SCENARIOS when saving more than limit', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioNameArbitrary, { minLength: MAX_SCENARIOS + 1, maxLength: MAX_SCENARIOS + 5 }),
                (names) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios (more than limit)
                    for (const name of names) {
                        const scenario = createSimpleScenario(name);
                        saveScenario(scenario);
                    }
                    
                    // Verify count is exactly MAX_SCENARIOS
                    const count = getScenarioCount();
                    return count === MAX_SCENARIOS;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should replace oldest scenario when limit is reached', () => {
        // Clear storage
        global.localStorage.clear();
        
        // Create and save MAX_SCENARIOS scenarios with known timestamps
        const scenarios = [];
        for (let i = 0; i < MAX_SCENARIOS; i++) {
            const scenario = createSimpleScenario(`Scenario ${i}`);
            // Manually set updatedAt to ensure ordering
            scenario.updatedAt = new Date(Date.now() - (MAX_SCENARIOS - i) * 1000).toISOString();
            scenarios.push(scenario);
            saveScenario(scenario);
        }
        
        // Verify we have MAX_SCENARIOS
        expect(getScenarioCount()).toBe(MAX_SCENARIOS);
        
        // Save one more scenario
        const newScenario = createSimpleScenario('New Scenario');
        const result = saveScenario(newScenario);
        
        // Should still have MAX_SCENARIOS
        expect(getScenarioCount()).toBe(MAX_SCENARIOS);
        
        // The new scenario should exist
        const loadedNew = loadScenario(newScenario.id);
        expect(loadedNew).not.toBeNull();
        expect(loadedNew.name).toBe('New Scenario');
        
        // Result should indicate a scenario was replaced
        expect(result.success).toBe(true);
        expect(result.replacedScenario).toBeDefined();
    });

    test('should correctly report when limit is reached', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: MAX_SCENARIOS + 5 }),
                (count) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save 'count' scenarios
                    for (let i = 0; i < count; i++) {
                        const scenario = createSimpleScenario(`Scenario ${i}`);
                        saveScenario(scenario);
                    }
                    
                    // Check if limit is reached
                    const limitReached = isScenarioLimitReached();
                    const actualCount = getScenarioCount();
                    
                    // Limit should be reached when count >= MAX_SCENARIOS
                    const expectedLimitReached = actualCount >= MAX_SCENARIOS;
                    
                    return limitReached === expectedLimitReached;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should allow updating existing scenario without affecting count', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioNameArbitrary, { minLength: MAX_SCENARIOS, maxLength: MAX_SCENARIOS }),
                scenarioNameArbitrary,
                (names, newName) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save MAX_SCENARIOS scenarios
                    const scenarios = [];
                    for (const name of names) {
                        const scenario = createSimpleScenario(name);
                        scenarios.push(scenario);
                        saveScenario(scenario);
                    }
                    
                    // Verify we have MAX_SCENARIOS
                    const countBefore = getScenarioCount();
                    if (countBefore !== MAX_SCENARIOS) {
                        return false;
                    }
                    
                    // Update an existing scenario
                    const scenarioToUpdate = scenarios[0];
                    scenarioToUpdate.name = newName;
                    const result = saveScenario(scenarioToUpdate);
                    
                    // Should still have MAX_SCENARIOS
                    const countAfter = getScenarioCount();
                    
                    return result.success && countAfter === MAX_SCENARIOS;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should preserve most recent scenarios when exceeding limit', () => {
        // Clear storage
        global.localStorage.clear();
        
        // Create scenarios with sequential timestamps
        const allScenarios = [];
        for (let i = 0; i < MAX_SCENARIOS + 3; i++) {
            const scenario = createSimpleScenario(`Scenario ${i}`);
            allScenarios.push(scenario);
            saveScenario(scenario);
            
            // Small delay to ensure different timestamps
            // (In real tests, we'd mock Date.now())
        }
        
        // Verify we have MAX_SCENARIOS
        expect(getScenarioCount()).toBe(MAX_SCENARIOS);
        
        // The most recent scenarios should be preserved
        const savedScenarios = listScenarios();
        expect(savedScenarios.length).toBe(MAX_SCENARIOS);
        
        // The newest scenario should be in the list
        const newestScenario = allScenarios[allScenarios.length - 1];
        const foundNewest = savedScenarios.find(s => s.id === newestScenario.id);
        expect(foundNewest).toBeDefined();
    });
});
