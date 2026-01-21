/**
 * Property-Based Tests for FAIR Core Comparison Table
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * for the scenario comparison table functionality.
 * 
 * Property 12: Comparison Table Completeness
 * 
 * @module fair-core.comparison.property.test
 */

import fc from 'fast-check';
import {
    createDefaultScenario,
    createPERTInput,
    saveScenario,
    listScenarios,
    clearAllScenarios,
    calculateRiskPriority,
    prepareComparisonTableData,
    sortComparisonTableData,
    filterComparisonTableData,
    getComparisonTableData,
    validateComparisonTableRow,
    validateComparisonTableData,
    getComparisonTableSummary
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
 * Property 12: 比較表完整性 (Comparison Table Completeness)
 * 
 * For any set of saved scenarios with risk results, the comparison table
 * should display all required fields (id, name, AAL, VaR 90%, ROSI, priority)
 * for each scenario.
 * 
 * Validates: Requirements 4.2
 */
describe('Property 12: Comparison Table Completeness', () => {

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

    // Arbitrary for risk output values
    const riskOutputArbitrary = fc.record({
        aal: fc.double({ min: 0, max: 1e8, noNaN: true, noDefaultInfinity: true }),
        var90: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        var95: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        minLoss: fc.double({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        maxLoss: fc.double({ min: 0, max: 1e9, noNaN: true, noDefaultInfinity: true }),
        rosi: fc.option(fc.double({ min: -100, max: 1000, noNaN: true, noDefaultInfinity: true }), { nil: null })
    });

    // Arbitrary for a valid FAIR scenario with risk results
    const scenarioWithRiskArbitrary = fc.record({
        name: scenarioNameArbitrary,
        tef: pertArbitrary,
        vulnerability: percentagePertArbitrary,
        primaryLoss: pertArbitrary,
        secondaryProbability: fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        secondaryMagnitude: pertArbitrary,
        simulationRuns: fc.integer({ min: 100, max: 100000 }),
        risk: riskOutputArbitrary
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
        scenario.risk = data.risk;
        return scenario;
    });

    test('should produce valid table rows for all saved scenarios', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 1, maxLength: 10 }),
                (scenarios) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Get comparison table data
                    const tableData = getComparisonTableData();
                    
                    // Validate all rows
                    const validation = validateComparisonTableData(tableData);
                    
                    return validation.isValid;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should include all required fields in each table row', () => {
        fc.assert(
            fc.property(scenarioWithRiskArbitrary, (scenario) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Save the scenario
                saveScenario(scenario);
                
                // Get comparison table data
                const tableData = getComparisonTableData();
                
                if (tableData.length !== 1) {
                    return false;
                }
                
                const row = tableData[0];
                
                // Check all required fields exist
                const hasId = typeof row.id === 'string' && row.id.length > 0;
                const hasName = typeof row.name === 'string' && row.name.length > 0;
                const hasAAL = typeof row.aal === 'number' && !isNaN(row.aal);
                const hasVaR90 = typeof row.var90 === 'number' && !isNaN(row.var90);
                const hasRosi = row.rosi === null || (typeof row.rosi === 'number' && !isNaN(row.rosi));
                const hasPriority = ['critical', 'high', 'medium', 'low'].includes(row.priority);
                const hasUpdatedAt = row.updatedAt instanceof Date;
                
                return hasId && hasName && hasAAL && hasVaR90 && hasRosi && hasPriority && hasUpdatedAt;
            }),
            { numRuns: 100 }
        );
    });

    test('should correctly calculate risk priority based on AAL and VaR90', () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: 2e6, noNaN: true, noDefaultInfinity: true }),
                fc.double({ min: 0, max: 1e7, noNaN: true, noDefaultInfinity: true }),
                (aal, var90) => {
                    const priority = calculateRiskPriority(aal, var90);
                    
                    // Verify priority is one of the valid values
                    if (!['critical', 'high', 'medium', 'low'].includes(priority)) {
                        return false;
                    }
                    
                    // Verify priority logic
                    if (aal > 1000000 || var90 > 5000000) {
                        return priority === 'critical';
                    }
                    if (aal > 500000 || var90 > 2000000) {
                        return priority === 'high';
                    }
                    if (aal > 100000 || var90 > 500000) {
                        return priority === 'medium';
                    }
                    return priority === 'low';
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should preserve scenario count in table data', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 0, maxLength: 10 }),
                (scenarios) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Get comparison table data
                    const tableData = getComparisonTableData();
                    const savedScenarios = listScenarios();
                    
                    // Table data count should match saved scenarios count
                    return tableData.length === savedScenarios.length;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should correctly sort table data by AAL', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 2, maxLength: 10 }),
                fc.constantFrom('asc', 'desc'),
                (scenarios, direction) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Get sorted table data
                    const tableData = getComparisonTableData({ field: 'aal', direction });
                    
                    if (tableData.length < 2) {
                        return true;
                    }
                    
                    // Verify sorting
                    for (let i = 0; i < tableData.length - 1; i++) {
                        if (direction === 'asc') {
                            if (tableData[i].aal > tableData[i + 1].aal) {
                                return false;
                            }
                        } else {
                            if (tableData[i].aal < tableData[i + 1].aal) {
                                return false;
                            }
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should correctly filter table data by priority', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 1, maxLength: 10 }),
                fc.constantFrom('critical', 'high', 'medium', 'low'),
                (scenarios, priorityFilter) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Get filtered table data
                    const tableData = getComparisonTableData(null, { priorities: [priorityFilter] });
                    
                    // All rows should have the filtered priority
                    for (const row of tableData) {
                        if (row.priority !== priorityFilter) {
                            return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should correctly filter table data by search term', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 1, maxLength: 10 }),
                (scenarios) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Use first scenario's name as search term
                    const searchTerm = scenarios[0].name.substring(0, 3).toLowerCase();
                    
                    // Get filtered table data
                    const tableData = getComparisonTableData(null, { searchTerm });
                    
                    // All rows should contain the search term in their name
                    for (const row of tableData) {
                        if (!row.name.toLowerCase().includes(searchTerm)) {
                            return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should calculate correct summary statistics', () => {
        fc.assert(
            fc.property(
                fc.array(scenarioWithRiskArbitrary, { minLength: 1, maxLength: 10 }),
                (scenarios) => {
                    // Clear storage before each iteration
                    global.localStorage.clear();
                    
                    // Save all scenarios
                    for (const scenario of scenarios) {
                        saveScenario(scenario);
                    }
                    
                    // Get table data and summary
                    const tableData = getComparisonTableData();
                    const summary = getComparisonTableSummary(tableData);
                    
                    // Verify total scenarios
                    if (summary.totalScenarios !== tableData.length) {
                        return false;
                    }
                    
                    // Verify total AAL
                    const expectedTotalAAL = tableData.reduce((sum, row) => sum + row.aal, 0);
                    if (Math.abs(summary.totalAAL - expectedTotalAAL) > 0.01) {
                        return false;
                    }
                    
                    // Verify average AAL
                    const expectedAvgAAL = tableData.length > 0 ? expectedTotalAAL / tableData.length : 0;
                    if (Math.abs(summary.avgAAL - expectedAvgAAL) > 0.01) {
                        return false;
                    }
                    
                    // Verify priority counts sum to total
                    const prioritySum = 
                        summary.priorityCounts.critical + 
                        summary.priorityCounts.high + 
                        summary.priorityCounts.medium + 
                        summary.priorityCounts.low;
                    if (prioritySum !== tableData.length) {
                        return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('should return empty array for empty storage', () => {
        // Clear storage
        global.localStorage.clear();
        
        // Get comparison table data
        const tableData = getComparisonTableData();
        
        expect(tableData).toEqual([]);
    });

    test('should handle scenarios without risk data gracefully', () => {
        fc.assert(
            fc.property(scenarioNameArbitrary, (name) => {
                // Clear storage before each iteration
                global.localStorage.clear();
                
                // Create scenario without risk data
                const scenario = createDefaultScenario(name);
                saveScenario(scenario);
                
                // Get comparison table data
                const tableData = getComparisonTableData();
                
                if (tableData.length !== 1) {
                    return false;
                }
                
                const row = tableData[0];
                
                // Should have default values for missing risk data
                return row.aal === 0 && row.var90 === 0 && row.rosi === null;
            }),
            { numRuns: 100 }
        );
    });
});
