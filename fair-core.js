/**
 * FAIR Risk Analysis - Core Module
 * 
 * This module provides data structures and utility functions for FAIR
 * (Factor Analysis of Information Risk) risk analysis.
 * 
 * Based on OpenFAIR™ methodology (O-RA v2.0.1, O-RT v3.0.1)
 * OpenFAIR™ is a trademark of The Open Group.
 * 
 * @module fair-core
 */

// ============================================================================
// Data Structure Definitions (JSDoc Type Definitions)
// ============================================================================

/**
 * PERT distribution input with min, most likely, and max values
 * @typedef {Object} PERTInput
 * @property {number} min - Minimum value
 * @property {number} mostLikely - Most likely value
 * @property {number} max - Maximum value
 */

/**
 * Loss Event Frequency input parameters
 * @typedef {Object} LEFInput
 * @property {PERTInput} [tef] - Direct TEF input (simple mode)
 * @property {PERTInput} [contactFrequency] - Contact Frequency for TEF decomposition (advanced mode)
 * @property {PERTInput} [probabilityOfAction] - Probability of Action for TEF decomposition (advanced mode)
 * @property {PERTInput} [vulnerability] - Direct Vulnerability input (simple mode)
 * @property {PERTInput} [threatCapability] - Threat Capability for Vulnerability decomposition (advanced mode)
 * @property {PERTInput} [resistanceStrength] - Resistance Strength for Vulnerability decomposition (advanced mode)
 */

/**
 * Secondary loss category
 * @typedef {Object} SecondaryLossCategory
 * @property {'reputation'|'legal'|'regulatory'|'competitive'} name - Category name
 * @property {number} probability - Probability percentage (0-100)
 * @property {PERTInput} magnitude - Loss magnitude
 */

/**
 * Loss Magnitude input parameters
 * @typedef {Object} LMInput
 * @property {PERTInput} primaryLoss - Primary loss magnitude
 * @property {Object} [secondaryLoss] - Secondary loss configuration
 * @property {number} secondaryLoss.probability - SLEF percentage (0-100)
 * @property {PERTInput} secondaryLoss.magnitude - SLM values
 * @property {SecondaryLossCategory[]} [secondaryLoss.categories] - Optional category breakdown
 */

/**
 * Control input parameters for ROSI calculation
 * @typedef {Object} ControlInput
 * @property {number} annualCost - Annual cost of the control
 * @property {number} effectiveness - Control effectiveness percentage (0-100)
 */

/**
 * Simulation configuration
 * @typedef {Object} SimulationConfig
 * @property {number} runs - Number of simulation runs (100-100000)
 * @property {number} [seed] - Optional random seed for reproducibility
 */

/**
 * Risk output from simulation
 * @typedef {Object} RiskOutput
 * @property {number} aal - Average Annual Loss
 * @property {number} var90 - Value at Risk 90th percentile
 * @property {number} var95 - Value at Risk 95th percentile
 * @property {number} minLoss - Minimum loss observed
 * @property {number} maxLoss - Maximum loss observed
 * @property {number} median - Median loss
 * @property {number} stdDev - Standard deviation
 * @property {number} [aalAfterControl] - AAL after applying control
 * @property {number} [riskReduction] - Risk reduction amount
 * @property {number} [rosi] - Return on Security Investment
 * @property {Array<{x: number, y: number}>} lossExceedanceCurve - Loss exceedance curve data
 * @property {Array<{bucket: number, count: number}>} histogram - Histogram data
 */

/**
 * Complete FAIR Scenario
 * @typedef {Object} FAIRScenario
 * @property {string} id - Unique identifier
 * @property {string} name - Scenario name
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {RiskOutput} [risk] - Calculated risk output (Level 1)
 * @property {LEFInput} lef - Loss Event Frequency inputs (Level 2)
 * @property {LMInput} lm - Loss Magnitude inputs (Level 2)
 * @property {ControlInput} [control] - Optional control configuration
 * @property {SimulationConfig} simulationConfig - Simulation settings
 */

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a default PERT input with specified values
 * @param {number} min - Minimum value
 * @param {number} mostLikely - Most likely value
 * @param {number} max - Maximum value
 * @returns {PERTInput} PERT input object
 */
function createPERTInput(min, mostLikely, max) {
    return {
        min: min,
        mostLikely: mostLikely,
        max: max
    };
}

/**
 * Creates a default LEF input configuration
 * @returns {LEFInput} Default LEF input
 */
function createDefaultLEFInput() {
    return {
        tef: createPERTInput(1, 5, 12),
        vulnerability: createPERTInput(10, 50, 90)
    };
}

/**
 * Creates a default LM input configuration
 * @returns {LMInput} Default LM input
 */
function createDefaultLMInput() {
    return {
        primaryLoss: createPERTInput(10000, 50000, 200000),
        secondaryLoss: {
            probability: 20,
            magnitude: createPERTInput(100000, 500000, 2000000)
        }
    };
}

/**
 * Creates a default control input configuration
 * @returns {ControlInput} Default control input
 */
function createDefaultControlInput() {
    return {
        annualCost: 0,
        effectiveness: 0
    };
}

/**
 * Creates a default simulation configuration
 * @param {number} [runs=10000] - Number of simulation runs
 * @returns {SimulationConfig} Default simulation config
 */
function createDefaultSimulationConfig(runs = 10000) {
    return {
        runs: runs
    };
}

/**
 * Generates a unique identifier for scenarios
 * @returns {string} Unique ID
 */
function generateScenarioId() {
    return 'fair_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Creates a new FAIR scenario with default values
 * @param {string} [name='New Scenario'] - Scenario name
 * @returns {FAIRScenario} New FAIR scenario
 */
function createDefaultScenario(name = 'New Scenario') {
    const now = new Date();
    return {
        id: generateScenarioId(),
        name: name,
        createdAt: now,
        updatedAt: now,
        lef: createDefaultLEFInput(),
        lm: createDefaultLMInput(),
        simulationConfig: createDefaultSimulationConfig()
    };
}

/**
 * Creates a FAIR scenario from existing input values
 * @param {Object} params - Scenario parameters
 * @param {string} [params.name] - Scenario name
 * @param {LEFInput} [params.lef] - LEF input
 * @param {LMInput} [params.lm] - LM input
 * @param {ControlInput} [params.control] - Control input
 * @param {SimulationConfig} [params.simulationConfig] - Simulation config
 * @returns {FAIRScenario} New FAIR scenario
 */
function createScenario(params = {}) {
    const now = new Date();
    return {
        id: generateScenarioId(),
        name: params.name || 'New Scenario',
        createdAt: now,
        updatedAt: now,
        lef: params.lef || createDefaultLEFInput(),
        lm: params.lm || createDefaultLMInput(),
        control: params.control,
        simulationConfig: params.simulationConfig || createDefaultSimulationConfig()
    };
}

/**
 * Creates a secondary loss category
 * @param {'reputation'|'legal'|'regulatory'|'competitive'} name - Category name
 * @param {number} probability - Probability percentage (0-100)
 * @param {PERTInput} magnitude - Loss magnitude
 * @returns {SecondaryLossCategory} Secondary loss category
 */
function createSecondaryLossCategory(name, probability, magnitude) {
    return {
        name: name,
        probability: probability,
        magnitude: magnitude
    };
}

/**
 * Creates an advanced LEF input with TEF decomposition (CF × PoA)
 * @param {PERTInput} contactFrequency - Contact Frequency
 * @param {PERTInput} probabilityOfAction - Probability of Action (0-100)
 * @param {PERTInput} vulnerability - Vulnerability (0-100)
 * @returns {LEFInput} LEF input with TEF decomposition
 */
function createAdvancedLEFInput(contactFrequency, probabilityOfAction, vulnerability) {
    return {
        contactFrequency: contactFrequency,
        probabilityOfAction: probabilityOfAction,
        vulnerability: vulnerability
    };
}

/**
 * Creates an advanced LEF input with full decomposition (TEF and Vulnerability)
 * @param {PERTInput} contactFrequency - Contact Frequency
 * @param {PERTInput} probabilityOfAction - Probability of Action (0-100)
 * @param {PERTInput} threatCapability - Threat Capability (1-10 scale)
 * @param {PERTInput} resistanceStrength - Resistance Strength (1-10 scale)
 * @returns {LEFInput} LEF input with full decomposition
 */
function createFullyDecomposedLEFInput(contactFrequency, probabilityOfAction, threatCapability, resistanceStrength) {
    return {
        contactFrequency: contactFrequency,
        probabilityOfAction: probabilityOfAction,
        threatCapability: threatCapability,
        resistanceStrength: resistanceStrength
    };
}

/**
 * Creates an LM input with category breakdown for secondary losses
 * @param {PERTInput} primaryLoss - Primary loss magnitude
 * @param {SecondaryLossCategory[]} categories - Secondary loss categories
 * @returns {LMInput} LM input with category breakdown
 */
function createLMInputWithCategories(primaryLoss, categories) {
    return {
        primaryLoss: primaryLoss,
        secondaryLoss: {
            probability: 0,
            magnitude: createPERTInput(0, 0, 0),
            categories: categories
        }
    };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clones a FAIR scenario (deep copy)
 * @param {FAIRScenario} scenario - Scenario to clone
 * @returns {FAIRScenario} Cloned scenario with new ID
 */
function cloneScenario(scenario) {
    const cloned = JSON.parse(JSON.stringify(scenario));
    cloned.id = generateScenarioId();
    cloned.createdAt = new Date();
    cloned.updatedAt = new Date();
    cloned.name = scenario.name + ' (Copy)';
    return cloned;
}

/**
 * Updates a scenario's timestamp
 * @param {FAIRScenario} scenario - Scenario to update
 * @returns {FAIRScenario} Updated scenario
 */
function touchScenario(scenario) {
    scenario.updatedAt = new Date();
    return scenario;
}

/**
 * Checks if a scenario uses advanced TEF decomposition (CF × PoA)
 * @param {FAIRScenario} scenario - Scenario to check
 * @returns {boolean} True if using advanced TEF mode
 */
function isAdvancedTEFMode(scenario) {
    return !!(scenario.lef.contactFrequency && scenario.lef.probabilityOfAction);
}

/**
 * Checks if a scenario uses advanced Vulnerability decomposition (TC vs RS)
 * @param {FAIRScenario} scenario - Scenario to check
 * @returns {boolean} True if using advanced Vulnerability mode
 */
function isAdvancedVulnerabilityMode(scenario) {
    return !!(scenario.lef.threatCapability && scenario.lef.resistanceStrength);
}

/**
 * Checks if a scenario has secondary loss categories configured
 * @param {FAIRScenario} scenario - Scenario to check
 * @returns {boolean} True if using category breakdown
 */
function hasSecondaryLossCategories(scenario) {
    return !!(scenario.lm.secondaryLoss && 
              scenario.lm.secondaryLoss.categories && 
              scenario.lm.secondaryLoss.categories.length > 0);
}

/**
 * Checks if a scenario has control configuration
 * @param {FAIRScenario} scenario - Scenario to check
 * @returns {boolean} True if control is configured
 */
function hasControlConfiguration(scenario) {
    return !!(scenario.control && 
              scenario.control.annualCost > 0 && 
              scenario.control.effectiveness > 0);
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validation error object
 * @typedef {Object} ValidationError
 * @property {string} field - Field name that has the error
 * @property {string} message - Error message
 * @property {'REQUIRED'|'INVALID_RANGE'|'INVALID_TYPE'} code - Error code
 */

/**
 * Validation warning object
 * @typedef {Object} ValidationWarning
 * @property {string} field - Field name that has the warning
 * @property {string} message - Warning message
 * @property {'ORDER_CORRECTED'|'EXTREME_VALUE'|'BENCHMARK_DEVIATION'} code - Warning code
 */

/**
 * Validation result object
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the input is valid
 * @property {ValidationError[]} errors - List of validation errors
 * @property {ValidationWarning[]} warnings - List of validation warnings
 * @property {Object} [correctedValues] - Corrected values if auto-correction was applied
 */

/**
 * Auto-corrects PERT input values to ensure min ≤ mostLikely ≤ max
 * Sorts the three values while preserving all of them.
 * 
 * @param {PERTInput} input - PERT input to correct
 * @returns {PERTInput} Corrected PERT input with values in ascending order
 */
function autoCorrectPERTOrder(input) {
    if (!input || typeof input.min !== 'number' || 
        typeof input.mostLikely !== 'number' || 
        typeof input.max !== 'number') {
        return input;
    }
    
    const values = [input.min, input.mostLikely, input.max];
    values.sort((a, b) => a - b);
    
    return {
        min: values[0],
        mostLikely: values[1],
        max: values[2]
    };
}

/**
 * Checks if PERT values need order correction
 * @param {PERTInput} input - PERT input to check
 * @returns {boolean} True if values are not in ascending order
 */
function needsPERTOrderCorrection(input) {
    if (!input || typeof input.min !== 'number' || 
        typeof input.mostLikely !== 'number' || 
        typeof input.max !== 'number') {
        return false;
    }
    return input.min > input.mostLikely || input.mostLikely > input.max;
}

/**
 * Validates a PERT input with range checking
 * 
 * @param {PERTInput} input - PERT input to validate
 * @param {string} fieldName - Name of the field for error messages
 * @param {Object} [options] - Validation options
 * @param {number} [options.minValue] - Minimum allowed value (default: -Infinity)
 * @param {number} [options.maxValue] - Maximum allowed value (default: Infinity)
 * @param {boolean} [options.isPercentage] - If true, validates as percentage (0-100)
 * @param {boolean} [options.isNonNegative] - If true, values must be >= 0
 * @param {boolean} [options.autoCorrect] - If true, auto-correct order issues (default: true)
 * @returns {ValidationResult} Validation result
 */
function validatePERTInput(input, fieldName, options = {}) {
    const errors = [];
    const warnings = [];
    let correctedValues = null;
    
    const {
        minValue = -Infinity,
        maxValue = Infinity,
        isPercentage = false,
        isNonNegative = false,
        autoCorrect = true
    } = options;
    
    // Determine effective min/max based on options
    const effectiveMin = isPercentage ? 0 : (isNonNegative ? 0 : minValue);
    const effectiveMax = isPercentage ? 100 : maxValue;
    
    // Check if input exists
    if (!input) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: 'REQUIRED'
        });
        return { isValid: false, errors, warnings };
    }
    
    // Check if all required properties exist and are numbers
    const requiredProps = ['min', 'mostLikely', 'max'];
    for (const prop of requiredProps) {
        if (input[prop] === undefined || input[prop] === null) {
            errors.push({
                field: `${fieldName}.${prop}`,
                message: `${fieldName}.${prop} is required`,
                code: 'REQUIRED'
            });
        } else if (typeof input[prop] !== 'number' || isNaN(input[prop])) {
            errors.push({
                field: `${fieldName}.${prop}`,
                message: `${fieldName}.${prop} must be a valid number`,
                code: 'INVALID_TYPE'
            });
        }
    }
    
    // If there are type/required errors, return early
    if (errors.length > 0) {
        return { isValid: false, errors, warnings };
    }
    
    // Check range for each value
    for (const prop of requiredProps) {
        const value = input[prop];
        
        if (value < effectiveMin) {
            const rangeDesc = isPercentage ? '0-100%' : 
                              isNonNegative ? 'non-negative' : 
                              `>= ${effectiveMin}`;
            errors.push({
                field: `${fieldName}.${prop}`,
                message: `${fieldName}.${prop} must be ${rangeDesc} (got ${value})`,
                code: 'INVALID_RANGE'
            });
        }
        
        if (value > effectiveMax) {
            const rangeDesc = isPercentage ? '0-100%' : `<= ${effectiveMax}`;
            errors.push({
                field: `${fieldName}.${prop}`,
                message: `${fieldName}.${prop} must be ${rangeDesc} (got ${value})`,
                code: 'INVALID_RANGE'
            });
        }
    }
    
    // Check order and auto-correct if needed
    if (needsPERTOrderCorrection(input)) {
        if (autoCorrect) {
            correctedValues = autoCorrectPERTOrder(input);
            warnings.push({
                field: fieldName,
                message: `${fieldName} values were auto-corrected to ensure min ≤ mostLikely ≤ max`,
                code: 'ORDER_CORRECTED'
            });
        } else {
            errors.push({
                field: fieldName,
                message: `${fieldName} values must be in order: min ≤ mostLikely ≤ max`,
                code: 'INVALID_RANGE'
            });
        }
    }
    
    const result = {
        isValid: errors.length === 0,
        errors,
        warnings
    };
    
    if (correctedValues) {
        result.correctedValues = correctedValues;
    }
    
    return result;
}

// ============================================================================
// Simulation Run Count Validation
// ============================================================================

/**
 * Minimum allowed simulation runs
 * @constant {number}
 */
const MIN_SIMULATION_RUNS = 100;

/**
 * Maximum allowed simulation runs
 * @constant {number}
 */
const MAX_SIMULATION_RUNS = 100000;

/**
 * Validates simulation run count
 * 
 * Ensures the number of simulation runs is within the valid range [100, 100000].
 * This validation should be performed before starting a Monte Carlo simulation.
 * 
 * @param {number} runs - Number of simulation runs to validate
 * @returns {ValidationResult} Validation result with isValid, errors, and warnings
 * 
 * @example
 * // Valid run count
 * validateSimulationRuns(10000);
 * // Returns { isValid: true, errors: [], warnings: [] }
 * 
 * // Invalid run count (too low)
 * validateSimulationRuns(50);
 * // Returns { isValid: false, errors: [{field: 'simulationRuns', message: '...', code: 'INVALID_RANGE'}], warnings: [] }
 * 
 * // Invalid run count (too high)
 * validateSimulationRuns(200000);
 * // Returns { isValid: false, errors: [{field: 'simulationRuns', message: '...', code: 'INVALID_RANGE'}], warnings: [] }
 */
function validateSimulationRuns(runs) {
    const errors = [];
    const warnings = [];
    
    // Check if runs is provided
    if (runs === undefined || runs === null) {
        errors.push({
            field: 'simulationRuns',
            message: 'Simulation runs is required',
            code: 'REQUIRED'
        });
        return { isValid: false, errors, warnings };
    }
    
    // Check if runs is a valid number
    if (typeof runs !== 'number' || isNaN(runs)) {
        errors.push({
            field: 'simulationRuns',
            message: 'Simulation runs must be a valid number',
            code: 'INVALID_TYPE'
        });
        return { isValid: false, errors, warnings };
    }
    
    // Check if runs is an integer
    if (!Number.isInteger(runs)) {
        errors.push({
            field: 'simulationRuns',
            message: 'Simulation runs must be an integer',
            code: 'INVALID_TYPE'
        });
        return { isValid: false, errors, warnings };
    }
    
    // Check if runs is within valid range
    if (runs < MIN_SIMULATION_RUNS || runs > MAX_SIMULATION_RUNS) {
        errors.push({
            field: 'simulationRuns',
            message: `Simulation runs must be between ${MIN_SIMULATION_RUNS.toLocaleString()} and ${MAX_SIMULATION_RUNS.toLocaleString()} (got ${runs.toLocaleString()})`,
            code: 'INVALID_RANGE'
        });
        return { isValid: false, errors, warnings };
    }
    
    return { isValid: true, errors, warnings };
}

/**
 * Validates a complete FAIR scenario
 * 
 * @param {FAIRScenario} scenario - Scenario to validate
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.autoCorrect] - If true, auto-correct order issues (default: true)
 * @returns {ValidationResult} Validation result with all errors and warnings
 */
function validateScenario(scenario, options = {}) {
    const errors = [];
    const warnings = [];
    const correctedValues = {};
    const { autoCorrect = true } = options;

    
    // Check if scenario exists
    if (!scenario) {
        errors.push({
            field: 'scenario',
            message: 'Scenario is required',
            code: 'REQUIRED'
        });
        return { isValid: false, errors, warnings };
    }
    
    // Validate scenario name
    if (!scenario.name || typeof scenario.name !== 'string' || scenario.name.trim() === '') {
        errors.push({
            field: 'name',
            message: 'Scenario name is required',
            code: 'REQUIRED'
        });
    }
    
    // Validate LEF (Loss Event Frequency)
    if (!scenario.lef) {
        errors.push({
            field: 'lef',
            message: 'Loss Event Frequency (LEF) configuration is required',
            code: 'REQUIRED'
        });
    } else {
        // Check TEF - either direct or decomposed
        const hasDirectTEF = scenario.lef.tef;
        const hasDecomposedTEF = scenario.lef.contactFrequency && scenario.lef.probabilityOfAction;
        
        if (!hasDirectTEF && !hasDecomposedTEF) {
            errors.push({
                field: 'lef.tef',
                message: 'Either direct TEF or Contact Frequency + Probability of Action is required',
                code: 'REQUIRED'
            });
        }
        
        // Validate direct TEF (frequency, non-negative)
        if (hasDirectTEF) {
            const tefResult = validatePERTInput(scenario.lef.tef, 'TEF', { 
                isNonNegative: true, 
                autoCorrect 
            });
            errors.push(...tefResult.errors);
            warnings.push(...tefResult.warnings);
            if (tefResult.correctedValues) {
                correctedValues['lef.tef'] = tefResult.correctedValues;
            }
        }
        
        // Validate decomposed TEF (CF × PoA)
        if (hasDecomposedTEF) {
            // Contact Frequency (non-negative)
            const cfResult = validatePERTInput(scenario.lef.contactFrequency, 'Contact Frequency', { 
                isNonNegative: true, 
                autoCorrect 
            });
            errors.push(...cfResult.errors);
            warnings.push(...cfResult.warnings);
            if (cfResult.correctedValues) {
                correctedValues['lef.contactFrequency'] = cfResult.correctedValues;
            }
            
            // Probability of Action (percentage 0-100)
            const poaResult = validatePERTInput(scenario.lef.probabilityOfAction, 'Probability of Action', { 
                isPercentage: true, 
                autoCorrect 
            });
            errors.push(...poaResult.errors);
            warnings.push(...poaResult.warnings);
            if (poaResult.correctedValues) {
                correctedValues['lef.probabilityOfAction'] = poaResult.correctedValues;
            }
        }
        
        // Check Vulnerability - either direct or decomposed
        const hasDirectVuln = scenario.lef.vulnerability;
        const hasDecomposedVuln = scenario.lef.threatCapability && scenario.lef.resistanceStrength;
        
        if (!hasDirectVuln && !hasDecomposedVuln) {
            errors.push({
                field: 'lef.vulnerability',
                message: 'Either direct Vulnerability or Threat Capability + Resistance Strength is required',
                code: 'REQUIRED'
            });
        }
        
        // Validate direct Vulnerability (percentage 0-100)
        if (hasDirectVuln) {
            const vulnResult = validatePERTInput(scenario.lef.vulnerability, 'Vulnerability', { 
                isPercentage: true, 
                autoCorrect 
            });
            errors.push(...vulnResult.errors);
            warnings.push(...vulnResult.warnings);
            if (vulnResult.correctedValues) {
                correctedValues['lef.vulnerability'] = vulnResult.correctedValues;
            }
        }
        
        // Validate decomposed Vulnerability (TC vs RS)
        if (hasDecomposedVuln) {
            // Threat Capability (1-10 scale)
            const tcResult = validatePERTInput(scenario.lef.threatCapability, 'Threat Capability', { 
                minValue: 1, 
                maxValue: 10, 
                autoCorrect 
            });
            errors.push(...tcResult.errors);
            warnings.push(...tcResult.warnings);
            if (tcResult.correctedValues) {
                correctedValues['lef.threatCapability'] = tcResult.correctedValues;
            }
            
            // Resistance Strength (1-10 scale)
            const rsResult = validatePERTInput(scenario.lef.resistanceStrength, 'Resistance Strength', { 
                minValue: 1, 
                maxValue: 10, 
                autoCorrect 
            });
            errors.push(...rsResult.errors);
            warnings.push(...rsResult.warnings);
            if (rsResult.correctedValues) {
                correctedValues['lef.resistanceStrength'] = rsResult.correctedValues;
            }
        }
    }
    
    // Validate LM (Loss Magnitude)
    if (!scenario.lm) {
        errors.push({
            field: 'lm',
            message: 'Loss Magnitude (LM) configuration is required',
            code: 'REQUIRED'
        });
    } else {
        // Validate Primary Loss (non-negative monetary value)
        if (!scenario.lm.primaryLoss) {
            errors.push({
                field: 'lm.primaryLoss',
                message: 'Primary Loss is required',
                code: 'REQUIRED'
            });
        } else {
            const plResult = validatePERTInput(scenario.lm.primaryLoss, 'Primary Loss', { 
                isNonNegative: true, 
                autoCorrect 
            });
            errors.push(...plResult.errors);
            warnings.push(...plResult.warnings);
            if (plResult.correctedValues) {
                correctedValues['lm.primaryLoss'] = plResult.correctedValues;
            }
        }
        
        // Validate Secondary Loss (optional)
        if (scenario.lm.secondaryLoss) {
            const sl = scenario.lm.secondaryLoss;
            
            // Validate SLEF (probability percentage 0-100)
            if (sl.probability !== undefined && sl.probability !== null) {
                if (typeof sl.probability !== 'number' || isNaN(sl.probability)) {
                    errors.push({
                        field: 'lm.secondaryLoss.probability',
                        message: 'Secondary Loss probability must be a valid number',
                        code: 'INVALID_TYPE'
                    });
                } else if (sl.probability < 0 || sl.probability > 100) {
                    errors.push({
                        field: 'lm.secondaryLoss.probability',
                        message: 'Secondary Loss probability must be between 0 and 100',
                        code: 'INVALID_RANGE'
                    });
                }
            }
            
            // Validate SLM (non-negative monetary value)
            if (sl.magnitude) {
                const slmResult = validatePERTInput(sl.magnitude, 'Secondary Loss Magnitude', { 
                    isNonNegative: true, 
                    autoCorrect 
                });
                errors.push(...slmResult.errors);
                warnings.push(...slmResult.warnings);
                if (slmResult.correctedValues) {
                    correctedValues['lm.secondaryLoss.magnitude'] = slmResult.correctedValues;
                }
            }
            
            // Validate Secondary Loss Categories (optional)
            if (sl.categories && Array.isArray(sl.categories)) {
                sl.categories.forEach((category, index) => {
                    const catName = category.name || `Category ${index + 1}`;
                    
                    // Validate category probability
                    if (category.probability !== undefined && category.probability !== null) {
                        if (typeof category.probability !== 'number' || isNaN(category.probability)) {
                            errors.push({
                                field: `lm.secondaryLoss.categories[${index}].probability`,
                                message: `${catName} probability must be a valid number`,
                                code: 'INVALID_TYPE'
                            });
                        } else if (category.probability < 0 || category.probability > 100) {
                            errors.push({
                                field: `lm.secondaryLoss.categories[${index}].probability`,
                                message: `${catName} probability must be between 0 and 100`,
                                code: 'INVALID_RANGE'
                            });
                        }
                    }
                    
                    // Validate category magnitude
                    if (category.magnitude) {
                        const catMagResult = validatePERTInput(
                            category.magnitude, 
                            `${catName} Magnitude`, 
                            { isNonNegative: true, autoCorrect }
                        );
                        errors.push(...catMagResult.errors);
                        warnings.push(...catMagResult.warnings);
                        if (catMagResult.correctedValues) {
                            correctedValues[`lm.secondaryLoss.categories[${index}].magnitude`] = catMagResult.correctedValues;
                        }
                    }
                });
            }
        }
    }
    
    // Validate Control (optional)
    if (scenario.control) {
        // Validate annual cost (non-negative)
        if (scenario.control.annualCost !== undefined && scenario.control.annualCost !== null) {
            if (typeof scenario.control.annualCost !== 'number' || isNaN(scenario.control.annualCost)) {
                errors.push({
                    field: 'control.annualCost',
                    message: 'Control annual cost must be a valid number',
                    code: 'INVALID_TYPE'
                });
            } else if (scenario.control.annualCost < 0) {
                errors.push({
                    field: 'control.annualCost',
                    message: 'Control annual cost must be non-negative',
                    code: 'INVALID_RANGE'
                });
            }
        }
        
        // Validate effectiveness (percentage 0-100)
        if (scenario.control.effectiveness !== undefined && scenario.control.effectiveness !== null) {
            if (typeof scenario.control.effectiveness !== 'number' || isNaN(scenario.control.effectiveness)) {
                errors.push({
                    field: 'control.effectiveness',
                    message: 'Control effectiveness must be a valid number',
                    code: 'INVALID_TYPE'
                });
            } else if (scenario.control.effectiveness < 0 || scenario.control.effectiveness > 100) {
                errors.push({
                    field: 'control.effectiveness',
                    message: 'Control effectiveness must be between 0 and 100',
                    code: 'INVALID_RANGE'
                });
            }
        }
    }
    
    // Validate Simulation Config
    if (scenario.simulationConfig) {
        const runs = scenario.simulationConfig.runs;
        if (runs !== undefined && runs !== null) {
            if (typeof runs !== 'number' || isNaN(runs) || !Number.isInteger(runs)) {
                errors.push({
                    field: 'simulationConfig.runs',
                    message: 'Simulation runs must be a valid integer',
                    code: 'INVALID_TYPE'
                });
            } else if (runs < 100 || runs > 100000) {
                errors.push({
                    field: 'simulationConfig.runs',
                    message: 'Simulation runs must be between 100 and 100,000',
                    code: 'INVALID_RANGE'
                });
            }
        }
    }
    
    const result = {
        isValid: errors.length === 0,
        errors,
        warnings
    };
    
    if (Object.keys(correctedValues).length > 0) {
        result.correctedValues = correctedValues;
    }
    
    return result;
}

// ============================================================================
// FAIR Model Calculation Functions
// ============================================================================

/**
 * Calculates Threat Event Frequency (TEF) from Contact Frequency and Probability of Action
 * 
 * TEF = CF × (PoA / 100)
 * 
 * This is the advanced mode calculation where TEF is decomposed into:
 * - Contact Frequency (CF): How often a threat agent contacts the asset (events per year)
 * - Probability of Action (PoA): Likelihood the threat agent will act when contact occurs (0-100%)
 * 
 * @param {number} cf - Contact Frequency (events per year, must be >= 0)
 * @param {number} poa - Probability of Action (percentage 0-100)
 * @returns {number} Calculated TEF value (events per year)
 * @throws {Error} If cf is negative or poa is outside 0-100 range
 * 
 * @example
 * // 50 contacts per year, 30% chance of action each time
 * calculateTEF(50, 30); // Returns 15 (threat events per year)
 */
function calculateTEF(cf, poa) {
    // Validate Contact Frequency
    if (typeof cf !== 'number' || isNaN(cf)) {
        throw new Error('Contact Frequency (cf) must be a valid number');
    }
    if (cf < 0) {
        throw new Error('Contact Frequency (cf) must be non-negative');
    }
    
    // Validate Probability of Action
    if (typeof poa !== 'number' || isNaN(poa)) {
        throw new Error('Probability of Action (poa) must be a valid number');
    }
    if (poa < 0 || poa > 100) {
        throw new Error('Probability of Action (poa) must be between 0 and 100');
    }
    
    // Calculate TEF = CF × (PoA / 100)
    return cf * (poa / 100);
}

/**
 * Calculates TEF from PERT inputs for Contact Frequency and Probability of Action
 * Returns PERT output with min, mostLikely, and max TEF values
 * 
 * @param {PERTInput} cfPert - Contact Frequency PERT input
 * @param {PERTInput} poaPert - Probability of Action PERT input (0-100 scale)
 * @returns {PERTInput} PERT output with calculated TEF values
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * const cf = { min: 10, mostLikely: 50, max: 100 };
 * const poa = { min: 20, mostLikely: 30, max: 50 };
 * calculateTEFFromPERT(cf, poa);
 * // Returns { min: 2, mostLikely: 15, max: 50 }
 */
function calculateTEFFromPERT(cfPert, poaPert) {
    if (!cfPert || !poaPert) {
        throw new Error('Both Contact Frequency and Probability of Action PERT inputs are required');
    }
    
    // Calculate TEF for each PERT point
    // For min TEF: use min CF with min PoA
    // For mostLikely TEF: use mostLikely CF with mostLikely PoA
    // For max TEF: use max CF with max PoA
    return {
        min: calculateTEF(cfPert.min, poaPert.min),
        mostLikely: calculateTEF(cfPert.mostLikely, poaPert.mostLikely),
        max: calculateTEF(cfPert.max, poaPert.max)
    };
}

/**
 * Gets the effective TEF value(s) from a scenario, handling both simple and advanced modes
 * 
 * Simple mode: Returns the direct TEF PERT input
 * Advanced mode: Calculates TEF from CF × PoA decomposition
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @returns {PERTInput} Effective TEF PERT values
 * @throws {Error} If neither simple nor advanced TEF inputs are available
 * 
 * @example
 * // Simple mode scenario
 * const simpleScenario = { lef: { tef: { min: 1, mostLikely: 5, max: 12 } } };
 * getEffectiveTEF(simpleScenario); // Returns { min: 1, mostLikely: 5, max: 12 }
 * 
 * // Advanced mode scenario
 * const advancedScenario = {
 *   lef: {
 *     contactFrequency: { min: 10, mostLikely: 50, max: 100 },
 *     probabilityOfAction: { min: 10, mostLikely: 20, max: 30 }
 *   }
 * };
 * getEffectiveTEF(advancedScenario); // Returns calculated TEF from CF × PoA
 */
function getEffectiveTEF(scenario) {
    if (!scenario || !scenario.lef) {
        throw new Error('Scenario with LEF configuration is required');
    }
    
    const lef = scenario.lef;
    
    // Check for advanced mode (CF × PoA decomposition)
    if (lef.contactFrequency && lef.probabilityOfAction) {
        return calculateTEFFromPERT(lef.contactFrequency, lef.probabilityOfAction);
    }
    
    // Check for simple mode (direct TEF)
    if (lef.tef) {
        return lef.tef;
    }
    
    throw new Error('Either direct TEF or Contact Frequency + Probability of Action is required');
}

/**
 * Calculates Susceptibility from Threat Capability and Resistance Strength
 * 
 * Susceptibility represents the probability that a threat capability exceeds
 * the resistance strength. This is modeled as P(TC > RS) where both TC and RS
 * are on a 1-10 scale.
 * 
 * For simplicity, this implementation uses a linear model:
 * - If TC <= RS: Susceptibility = (TC / RS) * 0.5 (capped at 50%)
 * - If TC > RS: Susceptibility = 0.5 + ((TC - RS) / (10 - RS)) * 0.5
 * 
 * This ensures:
 * - Susceptibility is always between 0 and 1 (0-100%)
 * - Equal TC and RS gives 50% susceptibility
 * - Higher TC relative to RS increases susceptibility
 * - Lower TC relative to RS decreases susceptibility
 * 
 * @param {number} threatCapability - Threat Capability (1-10 scale)
 * @param {number} resistanceStrength - Resistance Strength (1-10 scale)
 * @returns {number} Susceptibility as a probability (0.0 to 1.0)
 * @throws {Error} If inputs are outside valid range
 * 
 * @example
 * calculateSusceptibility(8, 5); // Returns ~0.75 (75% susceptibility)
 * calculateSusceptibility(3, 7); // Returns ~0.21 (21% susceptibility)
 * calculateSusceptibility(5, 5); // Returns 0.5 (50% susceptibility)
 */
function calculateSusceptibility(threatCapability, resistanceStrength) {
    // Validate Threat Capability
    if (typeof threatCapability !== 'number' || isNaN(threatCapability)) {
        throw new Error('Threat Capability must be a valid number');
    }
    if (threatCapability < 1 || threatCapability > 10) {
        throw new Error('Threat Capability must be between 1 and 10');
    }
    
    // Validate Resistance Strength
    if (typeof resistanceStrength !== 'number' || isNaN(resistanceStrength)) {
        throw new Error('Resistance Strength must be a valid number');
    }
    if (resistanceStrength < 1 || resistanceStrength > 10) {
        throw new Error('Resistance Strength must be between 1 and 10');
    }
    
    // Calculate susceptibility using linear model
    if (threatCapability <= resistanceStrength) {
        // TC <= RS: Lower susceptibility, max 50%
        return (threatCapability / resistanceStrength) * 0.5;
    } else {
        // TC > RS: Higher susceptibility, 50% to 100%
        const excess = threatCapability - resistanceStrength;
        const maxExcess = 10 - resistanceStrength;
        return 0.5 + (excess / maxExcess) * 0.5;
    }
}

/**
 * Calculates Vulnerability from Susceptibility and Control Effectiveness
 * 
 * Vulnerability = Susceptibility × (1 - Control_Effectiveness / 100)
 * 
 * This represents the probability that a threat event becomes a loss event,
 * accounting for the effectiveness of security controls in reducing vulnerability.
 * 
 * @param {number} susceptibility - Susceptibility as probability (0.0 to 1.0)
 * @param {number} controlEffectiveness - Control effectiveness percentage (0-100)
 * @returns {number} Vulnerability as probability (0.0 to 1.0)
 * @throws {Error} If inputs are outside valid range
 * 
 * @example
 * calculateVulnerability(0.8, 25); // Returns 0.6 (60% vulnerability)
 * calculateVulnerability(0.5, 0);  // Returns 0.5 (50% vulnerability, no controls)
 * calculateVulnerability(0.9, 90); // Returns 0.09 (9% vulnerability, strong controls)
 */
function calculateVulnerability(susceptibility, controlEffectiveness) {
    // Validate Susceptibility
    if (typeof susceptibility !== 'number' || isNaN(susceptibility)) {
        throw new Error('Susceptibility must be a valid number');
    }
    if (susceptibility < 0 || susceptibility > 1) {
        throw new Error('Susceptibility must be between 0.0 and 1.0');
    }
    
    // Validate Control Effectiveness
    if (typeof controlEffectiveness !== 'number' || isNaN(controlEffectiveness)) {
        throw new Error('Control Effectiveness must be a valid number');
    }
    if (controlEffectiveness < 0 || controlEffectiveness > 100) {
        throw new Error('Control Effectiveness must be between 0 and 100');
    }
    
    // Calculate Vulnerability = Susceptibility × (1 - Control_Effectiveness / 100)
    return susceptibility * (1 - controlEffectiveness / 100);
}

/**
 * Calculates Susceptibility from PERT inputs for Threat Capability and Resistance Strength
 * Returns PERT output with min, mostLikely, and max Susceptibility values
 * 
 * @param {PERTInput} tcPert - Threat Capability PERT input (1-10 scale)
 * @param {PERTInput} rsPert - Resistance Strength PERT input (1-10 scale)
 * @returns {PERTInput} PERT output with calculated Susceptibility values (0.0-1.0)
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * const tc = { min: 6, mostLikely: 8, max: 9 };
 * const rs = { min: 3, mostLikely: 5, max: 7 };
 * calculateSusceptibilityFromPERT(tc, rs);
 * // Returns PERT with susceptibility values
 */
function calculateSusceptibilityFromPERT(tcPert, rsPert) {
    if (!tcPert || !rsPert) {
        throw new Error('Both Threat Capability and Resistance Strength PERT inputs are required');
    }
    
    // Calculate Susceptibility for each PERT point
    return {
        min: calculateSusceptibility(tcPert.min, rsPert.max),      // Min TC vs Max RS = lowest susceptibility
        mostLikely: calculateSusceptibility(tcPert.mostLikely, rsPert.mostLikely),
        max: calculateSusceptibility(tcPert.max, rsPert.min)       // Max TC vs Min RS = highest susceptibility
    };
}

/**
 * Calculates Vulnerability from PERT Susceptibility and Control Effectiveness
 * Returns PERT output with min, mostLikely, and max Vulnerability values
 * 
 * @param {PERTInput} susceptibilityPert - Susceptibility PERT input (0.0-1.0)
 * @param {number} controlEffectiveness - Control effectiveness percentage (0-100)
 * @returns {PERTInput} PERT output with calculated Vulnerability values (0.0-1.0)
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * const susc = { min: 0.3, mostLikely: 0.6, max: 0.9 };
 * calculateVulnerabilityFromPERT(susc, 30);
 * // Returns { min: 0.21, mostLikely: 0.42, max: 0.63 }
 */
function calculateVulnerabilityFromPERT(susceptibilityPert, controlEffectiveness) {
    if (!susceptibilityPert) {
        throw new Error('Susceptibility PERT input is required');
    }
    
    // Calculate Vulnerability for each PERT point
    return {
        min: calculateVulnerability(susceptibilityPert.min, controlEffectiveness),
        mostLikely: calculateVulnerability(susceptibilityPert.mostLikely, controlEffectiveness),
        max: calculateVulnerability(susceptibilityPert.max, controlEffectiveness)
    };
}

/**
 * Calculates Vulnerability from Threat Capability and Resistance Strength PERT inputs
 * This is a convenience function that combines susceptibility and vulnerability calculations
 * 
 * @param {PERTInput} tcPert - Threat Capability PERT input (1-10 scale)
 * @param {PERTInput} rsPert - Resistance Strength PERT input (1-10 scale)
 * @param {number} controlEffectiveness - Control effectiveness percentage (0-100)
 * @returns {PERTInput} PERT output with calculated Vulnerability values (0.0-1.0)
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * const tc = { min: 6, mostLikely: 8, max: 9 };
 * const rs = { min: 3, mostLikely: 5, max: 7 };
 * calculateVulnerabilityFromTCRS(tc, rs, 25);
 * // Returns PERT with vulnerability values accounting for 25% control effectiveness
 */
function calculateVulnerabilityFromTCRS(tcPert, rsPert, controlEffectiveness) {
    const susceptibilityPert = calculateSusceptibilityFromPERT(tcPert, rsPert);
    return calculateVulnerabilityFromPERT(susceptibilityPert, controlEffectiveness);
}

/**
 * Gets the effective Vulnerability value(s) from a scenario, handling both simple and advanced modes
 * 
 * Simple mode: Returns the direct Vulnerability PERT input
 * Advanced mode: Calculates Vulnerability from TC vs RS decomposition with control effectiveness
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @returns {PERTInput} Effective Vulnerability PERT values (as percentages 0-100)
 * @throws {Error} If neither simple nor advanced Vulnerability inputs are available
 * 
 * @example
 * // Simple mode scenario
 * const simpleScenario = { lef: { vulnerability: { min: 10, mostLikely: 50, max: 90 } } };
 * getEffectiveVulnerability(simpleScenario); // Returns { min: 10, mostLikely: 50, max: 90 }
 * 
 * // Advanced mode scenario
 * const advancedScenario = {
 *   lef: {
 *     threatCapability: { min: 6, mostLikely: 8, max: 9 },
 *     resistanceStrength: { min: 3, mostLikely: 5, max: 7 }
 *   },
 *   control: { effectiveness: 25 }
 * };
 * getEffectiveVulnerability(advancedScenario); // Returns calculated Vulnerability from TC vs RS
 */
function getEffectiveVulnerability(scenario) {
    if (!scenario || !scenario.lef) {
        throw new Error('Scenario with LEF configuration is required');
    }
    
    const lef = scenario.lef;
    
    // Check for advanced mode (TC vs RS decomposition)
    if (lef.threatCapability && lef.resistanceStrength) {
        const controlEffectiveness = (scenario.control && scenario.control.effectiveness) || 0;
        const vulnerabilityPert = calculateVulnerabilityFromTCRS(
            lef.threatCapability, 
            lef.resistanceStrength, 
            controlEffectiveness
        );
        
        // Convert from probability (0.0-1.0) to percentage (0-100)
        return {
            min: vulnerabilityPert.min * 100,
            mostLikely: vulnerabilityPert.mostLikely * 100,
            max: vulnerabilityPert.max * 100
        };
    }
    
    // Check for simple mode (direct Vulnerability)
    if (lef.vulnerability) {
        return lef.vulnerability;
    }
    
    throw new Error('Either direct Vulnerability or Threat Capability + Resistance Strength is required');
}

// ============================================================================
// Secondary Loss Calculation Functions
// ============================================================================

/**
 * Calculates expected Secondary Loss from SLEF and SLM
 * 
 * Expected Secondary Loss = (SLEF / 100) × SLM
 * 
 * Where:
 * - SLEF (Secondary Loss Event Frequency): Probability that secondary loss occurs (0-100%)
 * - SLM (Secondary Loss Magnitude): The monetary value of secondary loss
 * 
 * @param {number} slef - Secondary Loss Event Frequency (percentage 0-100)
 * @param {number} slm - Secondary Loss Magnitude (monetary value, must be >= 0)
 * @returns {number} Expected secondary loss value
 * @throws {Error} If slef is outside 0-100 range or slm is negative
 * 
 * @example
 * // 30% probability of $500,000 secondary loss
 * calculateSecondaryLoss(30, 500000); // Returns 150000
 * 
 * // 100% probability means full secondary loss
 * calculateSecondaryLoss(100, 200000); // Returns 200000
 * 
 * // 0% probability means no secondary loss
 * calculateSecondaryLoss(0, 1000000); // Returns 0
 */
function calculateSecondaryLoss(slef, slm) {
    // Validate SLEF (Secondary Loss Event Frequency)
    if (typeof slef !== 'number' || isNaN(slef)) {
        throw new Error('Secondary Loss Event Frequency (slef) must be a valid number');
    }
    if (slef < 0 || slef > 100) {
        throw new Error('Secondary Loss Event Frequency (slef) must be between 0 and 100');
    }
    
    // Validate SLM (Secondary Loss Magnitude)
    if (typeof slm !== 'number' || isNaN(slm)) {
        throw new Error('Secondary Loss Magnitude (slm) must be a valid number');
    }
    if (slm < 0) {
        throw new Error('Secondary Loss Magnitude (slm) must be non-negative');
    }
    
    // Calculate Expected Secondary Loss = (SLEF / 100) × SLM
    return (slef / 100) * slm;
}

/**
 * Calculates expected Secondary Loss from PERT inputs
 * Returns PERT output with min, mostLikely, and max expected secondary loss values
 * 
 * @param {number} slef - Secondary Loss Event Frequency (percentage 0-100)
 * @param {PERTInput} slmPert - Secondary Loss Magnitude PERT input
 * @returns {PERTInput} PERT output with calculated expected secondary loss values
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * const slm = { min: 100000, mostLikely: 500000, max: 2000000 };
 * calculateSecondaryLossFromPERT(30, slm);
 * // Returns { min: 30000, mostLikely: 150000, max: 600000 }
 */
function calculateSecondaryLossFromPERT(slef, slmPert) {
    if (!slmPert) {
        throw new Error('Secondary Loss Magnitude PERT input is required');
    }
    
    // Calculate expected secondary loss for each PERT point
    return {
        min: calculateSecondaryLoss(slef, slmPert.min),
        mostLikely: calculateSecondaryLoss(slef, slmPert.mostLikely),
        max: calculateSecondaryLoss(slef, slmPert.max)
    };
}

/**
 * Aggregates multiple secondary loss categories into total expected secondary loss
 * 
 * Total Secondary Loss = Σ (category.probability / 100) × category.magnitude
 * 
 * Each category has its own probability (SLEF) and magnitude (SLM).
 * Only enabled categories (with probability > 0) contribute to the total.
 * 
 * @param {SecondaryLossCategory[]} categories - Array of secondary loss categories
 * @returns {number} Total expected secondary loss from all categories
 * @throws {Error} If categories is not an array or contains invalid entries
 * 
 * @example
 * const categories = [
 *   { name: 'reputation', probability: 40, magnitude: { min: 100000, mostLikely: 300000, max: 500000 } },
 *   { name: 'legal', probability: 20, magnitude: { min: 50000, mostLikely: 150000, max: 400000 } },
 *   { name: 'regulatory', probability: 30, magnitude: { min: 200000, mostLikely: 500000, max: 1000000 } }
 * ];
 * aggregateSecondaryLossCategories(categories);
 * // Returns sum of (probability × mostLikely magnitude) for each category
 */
function aggregateSecondaryLossCategories(categories) {
    // Validate categories array
    if (!categories) {
        return 0;
    }
    
    if (!Array.isArray(categories)) {
        throw new Error('Categories must be an array');
    }
    
    if (categories.length === 0) {
        return 0;
    }
    
    let totalSecondaryLoss = 0;
    
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        // Skip null/undefined categories
        if (!category) {
            continue;
        }
        
        // Validate category probability
        const probability = category.probability;
        if (probability === undefined || probability === null) {
            continue; // Skip categories without probability
        }
        
        if (typeof probability !== 'number' || isNaN(probability)) {
            throw new Error(`Category ${category.name || i} probability must be a valid number`);
        }
        
        if (probability < 0 || probability > 100) {
            throw new Error(`Category ${category.name || i} probability must be between 0 and 100`);
        }
        
        // Skip categories with 0 probability
        if (probability === 0) {
            continue;
        }
        
        // Validate category magnitude
        const magnitude = category.magnitude;
        if (!magnitude) {
            continue; // Skip categories without magnitude
        }
        
        // Use mostLikely value for aggregation (standard PERT practice)
        const slm = magnitude.mostLikely;
        if (typeof slm !== 'number' || isNaN(slm)) {
            throw new Error(`Category ${category.name || i} magnitude.mostLikely must be a valid number`);
        }
        
        if (slm < 0) {
            throw new Error(`Category ${category.name || i} magnitude must be non-negative`);
        }
        
        // Add this category's expected loss to total
        totalSecondaryLoss += calculateSecondaryLoss(probability, slm);
    }
    
    return totalSecondaryLoss;
}

/**
 * Aggregates secondary loss categories and returns PERT output
 * Uses min, mostLikely, and max values from each category's magnitude
 * 
 * @param {SecondaryLossCategory[]} categories - Array of secondary loss categories
 * @returns {PERTInput} PERT output with aggregated secondary loss values
 * @throws {Error} If categories is not an array or contains invalid entries
 * 
 * @example
 * const categories = [
 *   { name: 'reputation', probability: 40, magnitude: { min: 100000, mostLikely: 300000, max: 500000 } },
 *   { name: 'legal', probability: 20, magnitude: { min: 50000, mostLikely: 150000, max: 400000 } }
 * ];
 * aggregateSecondaryLossCategoriesPERT(categories);
 * // Returns { min: sum of min losses, mostLikely: sum of mostLikely losses, max: sum of max losses }
 */
function aggregateSecondaryLossCategoriesPERT(categories) {
    // Validate categories array
    if (!categories) {
        return { min: 0, mostLikely: 0, max: 0 };
    }
    
    if (!Array.isArray(categories)) {
        throw new Error('Categories must be an array');
    }
    
    if (categories.length === 0) {
        return { min: 0, mostLikely: 0, max: 0 };
    }
    
    let totalMin = 0;
    let totalMostLikely = 0;
    let totalMax = 0;
    
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        // Skip null/undefined categories
        if (!category) {
            continue;
        }
        
        // Validate category probability
        const probability = category.probability;
        if (probability === undefined || probability === null) {
            continue;
        }
        
        if (typeof probability !== 'number' || isNaN(probability)) {
            throw new Error(`Category ${category.name || i} probability must be a valid number`);
        }
        
        if (probability < 0 || probability > 100) {
            throw new Error(`Category ${category.name || i} probability must be between 0 and 100`);
        }
        
        // Skip categories with 0 probability
        if (probability === 0) {
            continue;
        }
        
        // Validate category magnitude
        const magnitude = category.magnitude;
        if (!magnitude) {
            continue;
        }
        
        // Validate all PERT values
        if (typeof magnitude.min !== 'number' || isNaN(magnitude.min) || magnitude.min < 0) {
            throw new Error(`Category ${category.name || i} magnitude.min must be a non-negative number`);
        }
        if (typeof magnitude.mostLikely !== 'number' || isNaN(magnitude.mostLikely) || magnitude.mostLikely < 0) {
            throw new Error(`Category ${category.name || i} magnitude.mostLikely must be a non-negative number`);
        }
        if (typeof magnitude.max !== 'number' || isNaN(magnitude.max) || magnitude.max < 0) {
            throw new Error(`Category ${category.name || i} magnitude.max must be a non-negative number`);
        }
        
        // Add this category's expected loss to totals
        totalMin += calculateSecondaryLoss(probability, magnitude.min);
        totalMostLikely += calculateSecondaryLoss(probability, magnitude.mostLikely);
        totalMax += calculateSecondaryLoss(probability, magnitude.max);
    }
    
    return {
        min: totalMin,
        mostLikely: totalMostLikely,
        max: totalMax
    };
}

/**
 * Gets the effective Secondary Loss value(s) from a scenario
 * 
 * Handles two modes:
 * 1. Simple mode: Uses direct SLEF and SLM values
 * 2. Category mode: Aggregates multiple secondary loss categories
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @returns {PERTInput} Effective Secondary Loss PERT values
 * 
 * @example
 * // Simple mode scenario
 * const simpleScenario = {
 *   lm: {
 *     secondaryLoss: {
 *       probability: 30,
 *       magnitude: { min: 100000, mostLikely: 500000, max: 2000000 }
 *     }
 *   }
 * };
 * getEffectiveSecondaryLoss(simpleScenario);
 * // Returns { min: 30000, mostLikely: 150000, max: 600000 }
 * 
 * // Category mode scenario
 * const categoryScenario = {
 *   lm: {
 *     secondaryLoss: {
 *       categories: [
 *         { name: 'reputation', probability: 40, magnitude: { min: 100000, mostLikely: 300000, max: 500000 } },
 *         { name: 'legal', probability: 20, magnitude: { min: 50000, mostLikely: 150000, max: 400000 } }
 *       ]
 *     }
 *   }
 * };
 * getEffectiveSecondaryLoss(categoryScenario);
 * // Returns aggregated PERT values from all categories
 */
function getEffectiveSecondaryLoss(scenario) {
    if (!scenario || !scenario.lm) {
        return { min: 0, mostLikely: 0, max: 0 };
    }
    
    const secondaryLoss = scenario.lm.secondaryLoss;
    if (!secondaryLoss) {
        return { min: 0, mostLikely: 0, max: 0 };
    }
    
    // Check for category mode (multiple categories)
    if (secondaryLoss.categories && Array.isArray(secondaryLoss.categories) && secondaryLoss.categories.length > 0) {
        return aggregateSecondaryLossCategoriesPERT(secondaryLoss.categories);
    }
    
    // Simple mode: use direct SLEF and SLM
    const slef = secondaryLoss.probability;
    const slmPert = secondaryLoss.magnitude;
    
    if (slef === undefined || slef === null || !slmPert) {
        return { min: 0, mostLikely: 0, max: 0 };
    }
    
    return calculateSecondaryLossFromPERT(slef, slmPert);
}

// ============================================================================
// Convergence Metrics Calculation
// ============================================================================

/**
 * Convergence threshold for standard error as percentage of mean
 * Results are considered converged when SE/mean < threshold
 * @constant {number}
 */
const CONVERGENCE_THRESHOLD = 0.05; // 5% relative standard error

/**
 * Minimum runs required before convergence can be assessed
 * @constant {number}
 */
const MIN_RUNS_FOR_CONVERGENCE = 100;

/**
 * Convergence metrics for Monte Carlo simulation
 * @typedef {Object} ConvergenceMetrics
 * @property {number} aalStdError - Standard error of AAL estimate
 * @property {number} var90StdError - Standard error of VaR 90% estimate
 * @property {boolean} isConverged - Whether results have converged
 * @property {number} recommendedRuns - Recommended number of runs for convergence
 * @property {number} aalRelativeError - Relative standard error of AAL (SE/AAL)
 * @property {number} var90RelativeError - Relative standard error of VaR 90%
 * @property {number} stdDev - Standard deviation of loss distribution
 */

/**
 * Calculates convergence metrics for Monte Carlo simulation results
 * 
 * Standard Error of Mean (SEM) = Standard Deviation / sqrt(n)
 * For VaR, we use asymptotic formula based on order statistics
 * 
 * @param {Array<{total: number}>} results - Array of simulation results with 'total' property
 * @param {number} aal - Calculated Average Annual Loss
 * @param {number} var90 - Calculated Value at Risk at 90th percentile
 * @returns {ConvergenceMetrics} Convergence metrics object
 * 
 * @example
 * const results = [{total: 1000}, {total: 2000}, {total: 1500}, ...];
 * const aal = 1500;
 * const var90 = 2500;
 * const metrics = calculateConvergenceMetrics(results, aal, var90);
 * // Returns { aalStdError: 50, var90StdError: 100, isConverged: true, recommendedRuns: 1000, ... }
 */
function calculateConvergenceMetrics(results, aal, var90) {
    const n = results.length;
    
    // Default metrics for insufficient data
    if (n < MIN_RUNS_FOR_CONVERGENCE) {
        return {
            aalStdError: 0,
            var90StdError: 0,
            isConverged: false,
            recommendedRuns: MIN_RUNS_FOR_CONVERGENCE,
            aalRelativeError: 0,
            var90RelativeError: 0,
            stdDev: 0
        };
    }
    
    // Calculate standard deviation for AAL
    const losses = results.map(r => r.total);
    const sumSquaredDiff = losses.reduce((sum, loss) => {
        const diff = loss - aal;
        return sum + diff * diff;
    }, 0);
    const variance = sumSquaredDiff / (n - 1); // Sample variance
    const stdDev = Math.sqrt(variance);
    
    // Standard Error of Mean (SEM) for AAL
    const aalStdError = stdDev / Math.sqrt(n);
    
    // Calculate relative standard error for AAL
    const aalRelativeError = aal > 0 ? aalStdError / aal : 0;
    
    // Standard Error for VaR (90th percentile)
    const var90StdError = calculateQuantileStdError(losses, 0.90, n);
    
    // Calculate relative standard error for VaR90
    const var90RelativeError = var90 > 0 ? var90StdError / var90 : 0;
    
    // Determine convergence
    // Both AAL and VaR90 relative errors should be below threshold
    const isConverged = aalRelativeError < CONVERGENCE_THRESHOLD && 
                        var90RelativeError < CONVERGENCE_THRESHOLD;
    
    // Calculate recommended additional runs if not converged
    // Based on: SE ∝ 1/sqrt(n), so to halve SE, need 4x runs
    // Target: reduce relative error to threshold
    let recommendedRuns = n;
    if (!isConverged) {
        const maxRelativeError = Math.max(aalRelativeError, var90RelativeError);
        if (maxRelativeError > 0) {
            // n_new = n * (current_error / target_error)^2
            const multiplier = Math.pow(maxRelativeError / CONVERGENCE_THRESHOLD, 2);
            recommendedRuns = Math.min(
                Math.ceil(n * multiplier),
                MAX_SIMULATION_RUNS
            );
            // Ensure at least 50% more runs
            recommendedRuns = Math.max(recommendedRuns, Math.ceil(n * 1.5));
        }
    }
    
    return {
        aalStdError,
        var90StdError,
        isConverged,
        recommendedRuns,
        aalRelativeError,
        var90RelativeError,
        stdDev
    };
}

/**
 * Calculates standard error for a quantile using kernel density estimation
 * 
 * Uses the asymptotic formula for quantile standard error:
 * SE(quantile_p) ≈ sqrt(p * (1-p) / n) / f(quantile_p)
 * where f is the probability density function estimated locally
 * 
 * @param {number[]} losses - Array of loss values
 * @param {number} p - Percentile as decimal (e.g., 0.90 for 90th percentile)
 * @param {number} n - Number of samples
 * @returns {number} Standard error of the quantile estimate
 */
function calculateQuantileStdError(losses, p, n) {
    // Sort losses for percentile calculation
    const sorted = [...losses].sort((a, b) => a - b);
    
    // Get the quantile index
    const idx = Math.floor(n * p);
    
    // Estimate local density using kernel density estimation
    // Use a window around the quantile
    const windowSize = Math.max(10, Math.floor(n * 0.05)); // 5% of data or at least 10
    const lowerIdx = Math.max(0, idx - windowSize);
    const upperIdx = Math.min(n - 1, idx + windowSize);
    
    // Local range for density estimation
    const localRange = sorted[upperIdx] - sorted[lowerIdx];
    const localCount = upperIdx - lowerIdx + 1;
    
    // Estimate density: f ≈ localCount / (n * localRange)
    // Avoid division by zero
    if (localRange === 0 || localCount === 0) {
        return 0;
    }
    
    const density = localCount / (n * localRange);
    
    // Standard error of quantile: SE = sqrt(p * (1-p) / n) / f
    if (density === 0) {
        return 0;
    }
    
    const se = Math.sqrt(p * (1 - p) / n) / density;
    
    return se;
}

// ============================================================================
// Sensitivity Analysis Functions
// ============================================================================

/**
 * Sensitivity analysis result for a single parameter
 * @typedef {Object} SensitivityResult
 * @property {string} parameter - Parameter name
 * @property {number} baselineAAL - Baseline Average Annual Loss
 * @property {number} lowAAL - AAL with -20% parameter variation
 * @property {number} highAAL - AAL with +20% parameter variation
 * @property {number} sensitivity - Sensitivity value: (highAAL - lowAAL) / baselineAAL
 * @property {number} [absoluteImpact] - Absolute impact: |highAAL - lowAAL|
 */

/**
 * Ranked influential parameter result
 * @typedef {Object} RankedParameter
 * @property {number} rank - Rank position (1 = most influential)
 * @property {string} parameter - Parameter name
 * @property {number} sensitivity - Sensitivity value
 * @property {number} absoluteImpact - Absolute impact value
 * @property {number} impactPercentage - Impact as percentage (|sensitivity| * 100)
 */

/**
 * Ranks sensitivity analysis results by absolute sensitivity value
 * and returns the top N most influential parameters.
 * 
 * The ranking is based on the absolute sensitivity value, which is calculated as:
 * |sensitivity| = |highAAL - lowAAL| / baselineAAL
 * 
 * This identifies which parameters have the greatest impact on the risk outcome
 * when varied by ±20%.
 * 
 * @param {SensitivityResult[]} sensitivityResults - Array of sensitivity analysis results
 * @param {number} [topN=3] - Number of top parameters to return (default: 3)
 * @returns {RankedParameter[]} Array of top N most influential parameters, sorted by impact
 * 
 * @example
 * const results = [
 *   { parameter: 'TEF', sensitivity: 0.35, baselineAAL: 1000000, lowAAL: 825000, highAAL: 1175000 },
 *   { parameter: 'Vulnerability', sensitivity: 0.25, baselineAAL: 1000000, lowAAL: 875000, highAAL: 1125000 },
 *   { parameter: 'Primary Loss', sensitivity: 0.15, baselineAAL: 1000000, lowAAL: 925000, highAAL: 1075000 }
 * ];
 * const topParams = rankInfluentialParameters(results, 3);
 * // Returns:
 * // [
 * //   { rank: 1, parameter: 'TEF', sensitivity: 0.35, absoluteImpact: 350000, impactPercentage: 35 },
 * //   { rank: 2, parameter: 'Vulnerability', sensitivity: 0.25, absoluteImpact: 250000, impactPercentage: 25 },
 * //   { rank: 3, parameter: 'Primary Loss', sensitivity: 0.15, absoluteImpact: 150000, impactPercentage: 15 }
 * // ]
 * 
 * **Validates: Requirements 5.3**
 */
function rankInfluentialParameters(sensitivityResults, topN = 3) {
    // Handle edge cases
    if (!sensitivityResults || !Array.isArray(sensitivityResults)) {
        return [];
    }
    
    if (sensitivityResults.length === 0) {
        return [];
    }
    
    // Ensure topN is a positive integer
    const n = Math.max(1, Math.min(Math.floor(topN), sensitivityResults.length));
    
    // Create a copy and sort by absolute sensitivity (descending)
    const sorted = [...sensitivityResults].sort((a, b) => {
        const absA = Math.abs(a.sensitivity || 0);
        const absB = Math.abs(b.sensitivity || 0);
        return absB - absA;
    });
    
    // Take top N and format the results
    return sorted.slice(0, n).map((result, index) => {
        // Calculate absolute impact if not already provided
        const absoluteImpact = result.absoluteImpact !== undefined 
            ? result.absoluteImpact 
            : Math.abs((result.highAAL || 0) - (result.lowAAL || 0));
        
        return {
            rank: index + 1,
            parameter: result.parameter || 'Unknown',
            sensitivity: result.sensitivity || 0,
            absoluteImpact: absoluteImpact,
            impactPercentage: Math.abs(result.sensitivity || 0) * 100
        };
    });
}

/**
 * Alias for rankInfluentialParameters for compatibility with fair.worker.js
 * @see rankInfluentialParameters
 */
const getTopInfluentialParameters = rankInfluentialParameters;

// ============================================================================
// Cache Manager for Simulation Results
// ============================================================================

/**
 * Default Time-To-Live for cached results in milliseconds (1 hour)
 * @constant {number}
 */
const CACHE_DEFAULT_TTL = 60 * 60 * 1000;

/**
 * localStorage key prefix for cache entries
 * @constant {string}
 */
const CACHE_KEY_PREFIX = 'fair_cache_';

/**
 * Maximum number of cache entries to store
 * @constant {number}
 */
const CACHE_MAX_ENTRIES = 50;

/**
 * Cached result entry
 * @typedef {Object} CacheEntry
 * @property {string} hash - Hash of the input parameters
 * @property {Object} result - Cached simulation result
 * @property {number} timestamp - When the entry was created (ms since epoch)
 * @property {number} ttl - Time-to-live in milliseconds
 */

/**
 * Generates a deterministic hash string from scenario input parameters
 * 
 * This function creates a consistent hash from the relevant input parameters
 * that affect simulation results. The hash is used as a cache key.
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario to hash
 * @returns {string} A hash string representing the scenario inputs
 * 
 * @example
 * const scenario = createDefaultScenario('Test');
 * const hash = hashScenarioInputs(scenario);
 * // Returns something like "fair_abc123def456"
 */
function hashScenarioInputs(scenario) {
    if (!scenario) {
        return '';
    }
    
    // Extract only the input parameters that affect simulation results
    // Exclude: id, name, createdAt, updatedAt, risk (output)
    const inputData = {
        lef: scenario.lef,
        lm: scenario.lm,
        control: scenario.control,
        simulationConfig: scenario.simulationConfig
    };
    
    // Convert to JSON string for consistent serialization
    const jsonStr = JSON.stringify(inputData, (key, value) => {
        // Handle special cases for consistent serialization
        if (typeof value === 'number') {
            // Round to 6 decimal places to avoid floating point issues
            return Math.round(value * 1000000) / 1000000;
        }
        return value;
    });
    
    // Simple hash function (djb2 algorithm)
    let hash = 5381;
    for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; // hash * 33 + char
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex string and ensure positive
    const hashHex = (hash >>> 0).toString(16);
    
    return CACHE_KEY_PREFIX + hashHex;
}

/**
 * Stores a simulation result in the cache
 * 
 * @param {string} hash - Cache key (from hashScenarioInputs)
 * @param {Object} result - Simulation result to cache
 * @param {number} [ttl=CACHE_DEFAULT_TTL] - Time-to-live in milliseconds
 * @returns {boolean} True if successfully cached, false otherwise
 * 
 * @example
 * const hash = hashScenarioInputs(scenario);
 * const result = { aal: 50000, var90: 150000, ... };
 * setCachedResult(hash, result);
 */
function setCachedResult(hash, result, ttl = CACHE_DEFAULT_TTL) {
    if (!hash || !result) {
        return false;
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return false;
    }
    
    try {
        // Create cache entry
        const entry = {
            hash: hash,
            result: result,
            timestamp: Date.now(),
            ttl: ttl
        };
        
        // Clean up old entries before adding new one
        cleanupExpiredCache();
        
        // Enforce max entries limit
        enforceMaxCacheEntries();
        
        // Store in localStorage
        localStorage.setItem(hash, JSON.stringify(entry));
        
        return true;
    } catch (e) {
        // localStorage might be full or disabled
        return false;
    }
}

/**
 * Retrieves a cached simulation result
 * 
 * Returns null if:
 * - No cache entry exists for the hash
 * - The cache entry has expired (TTL exceeded)
 * - localStorage is not available
 * 
 * @param {string} hash - Cache key (from hashScenarioInputs)
 * @returns {Object|null} Cached result or null if not found/expired
 * 
 * @example
 * const hash = hashScenarioInputs(scenario);
 * const cachedResult = getCachedResult(hash);
 * if (cachedResult) {
 *   // Use cached result
 * } else {
 *   // Run simulation
 * }
 */
function getCachedResult(hash) {
    if (!hash) {
        return null;
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return null;
    }
    
    try {
        const entryStr = localStorage.getItem(hash);
        if (!entryStr) {
            return null;
        }
        
        const entry = JSON.parse(entryStr);
        
        // Check if entry has expired
        const now = Date.now();
        const age = now - entry.timestamp;
        
        if (age > entry.ttl) {
            // Entry has expired, remove it
            localStorage.removeItem(hash);
            return null;
        }
        
        return entry.result;
    } catch (e) {
        // JSON parse error or other issue
        return null;
    }
}

/**
 * Checks if a valid cache entry exists for the given scenario
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario to check
 * @returns {boolean} True if a valid (non-expired) cache entry exists
 * 
 * @example
 * if (hasCachedResult(scenario)) {
 *   const result = getCachedResultForScenario(scenario);
 * }
 */
function hasCachedResult(scenario) {
    const hash = hashScenarioInputs(scenario);
    return getCachedResult(hash) !== null;
}

/**
 * Gets cached result for a scenario (convenience function)
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @returns {Object|null} Cached result or null if not found/expired
 * 
 * @example
 * const cachedResult = getCachedResultForScenario(scenario);
 */
function getCachedResultForScenario(scenario) {
    const hash = hashScenarioInputs(scenario);
    return getCachedResult(hash);
}

/**
 * Caches a result for a scenario (convenience function)
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {Object} result - Simulation result to cache
 * @param {number} [ttl=CACHE_DEFAULT_TTL] - Time-to-live in milliseconds
 * @returns {boolean} True if successfully cached
 * 
 * @example
 * cacheResultForScenario(scenario, simulationResult);
 */
function cacheResultForScenario(scenario, result, ttl = CACHE_DEFAULT_TTL) {
    const hash = hashScenarioInputs(scenario);
    return setCachedResult(hash, result, ttl);
}

/**
 * Removes expired cache entries from localStorage
 * 
 * @returns {number} Number of entries removed
 */
function cleanupExpiredCache() {
    if (typeof localStorage === 'undefined') {
        return 0;
    }
    
    let removedCount = 0;
    const now = Date.now();
    
    try {
        // Get all keys that match our cache prefix
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                try {
                    const entryStr = localStorage.getItem(key);
                    if (entryStr) {
                        const entry = JSON.parse(entryStr);
                        const age = now - entry.timestamp;
                        
                        if (age > entry.ttl) {
                            keysToRemove.push(key);
                        }
                    }
                } catch (e) {
                    // Invalid entry, mark for removal
                    keysToRemove.push(key);
                }
            }
        }
        
        // Remove expired entries
        for (const key of keysToRemove) {
            localStorage.removeItem(key);
            removedCount++;
        }
    } catch (e) {
        // Ignore errors during cleanup
    }
    
    return removedCount;
}

/**
 * Enforces the maximum number of cache entries by removing oldest entries
 * 
 * @returns {number} Number of entries removed
 */
function enforceMaxCacheEntries() {
    if (typeof localStorage === 'undefined') {
        return 0;
    }
    
    let removedCount = 0;
    
    try {
        // Collect all cache entries with their timestamps
        const entries = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                try {
                    const entryStr = localStorage.getItem(key);
                    if (entryStr) {
                        const entry = JSON.parse(entryStr);
                        entries.push({
                            key: key,
                            timestamp: entry.timestamp
                        });
                    }
                } catch (e) {
                    // Invalid entry, will be cleaned up later
                }
            }
        }
        
        // If we're over the limit, remove oldest entries
        if (entries.length >= CACHE_MAX_ENTRIES) {
            // Sort by timestamp (oldest first)
            entries.sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove oldest entries to get below limit
            const toRemove = entries.length - CACHE_MAX_ENTRIES + 1;
            for (let i = 0; i < toRemove; i++) {
                localStorage.removeItem(entries[i].key);
                removedCount++;
            }
        }
    } catch (e) {
        // Ignore errors during enforcement
    }
    
    return removedCount;
}

/**
 * Clears all cache entries from localStorage
 * 
 * @returns {number} Number of entries cleared
 * 
 * @example
 * const cleared = clearAllCache();
 * console.log(`Cleared ${cleared} cache entries`);
 */
function clearAllCache() {
    if (typeof localStorage === 'undefined') {
        return 0;
    }
    
    let clearedCount = 0;
    
    try {
        // Collect all cache keys first (to avoid modifying during iteration)
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all cache entries
        for (const key of keysToRemove) {
            localStorage.removeItem(key);
            clearedCount++;
        }
    } catch (e) {
        // Ignore errors during clear
    }
    
    return clearedCount;
}

/**
 * Gets cache statistics
 * 
 * @returns {Object} Cache statistics including entry count and total size
 * 
 * @example
 * const stats = getCacheStats();
 * console.log(`Cache has ${stats.entryCount} entries using ${stats.totalSize} bytes`);
 */
function getCacheStats() {
    const stats = {
        entryCount: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null
    };
    
    if (typeof localStorage === 'undefined') {
        return stats;
    }
    
    try {
        let oldestTimestamp = Infinity;
        let newestTimestamp = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                const entryStr = localStorage.getItem(key);
                if (entryStr) {
                    stats.entryCount++;
                    stats.totalSize += entryStr.length * 2; // Approximate bytes (UTF-16)
                    
                    try {
                        const entry = JSON.parse(entryStr);
                        if (entry.timestamp < oldestTimestamp) {
                            oldestTimestamp = entry.timestamp;
                            stats.oldestEntry = new Date(entry.timestamp);
                        }
                        if (entry.timestamp > newestTimestamp) {
                            newestTimestamp = entry.timestamp;
                            stats.newestEntry = new Date(entry.timestamp);
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }
        }
    } catch (e) {
        // Ignore errors
    }
    
    return stats;
}

// ============================================================================
// Scenario Persistence Manager
// ============================================================================

/**
 * localStorage key for storing scenarios
 * @constant {string}
 */
const SCENARIO_STORAGE_KEY = 'fair_scenarios';

/**
 * Maximum number of scenarios that can be stored
 * @constant {number}
 */
const MAX_SCENARIOS = 10;

/**
 * Saves a scenario to localStorage
 * 
 * If the scenario already exists (same ID), it will be updated.
 * If the maximum number of scenarios (10) is reached and this is a new scenario,
 * the oldest scenario will be replaced.
 * 
 * @param {FAIRScenario} scenario - The scenario to save
 * @returns {{success: boolean, message: string, replacedScenario?: FAIRScenario}} Result object
 * 
 * @example
 * const scenario = createDefaultScenario('My Scenario');
 * const result = saveScenario(scenario);
 * if (result.success) {
 *   console.log('Scenario saved successfully');
 * }
 * 
 * **Validates: Requirements 7.1, 4.1**
 */
function saveScenario(scenario) {
    // Validate input
    if (!scenario) {
        return { success: false, message: 'Scenario is required' };
    }
    
    if (!scenario.id) {
        return { success: false, message: 'Scenario must have an ID' };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available' };
    }
    
    try {
        // Get existing scenarios
        const scenarios = listScenarios();
        
        // Check if scenario already exists (update case)
        const existingIndex = scenarios.findIndex(s => s.id === scenario.id);
        
        // Update the scenario's updatedAt timestamp
        const scenarioToSave = {
            ...scenario,
            updatedAt: new Date().toISOString()
        };
        
        // Convert createdAt to ISO string if it's a Date object
        if (scenarioToSave.createdAt instanceof Date) {
            scenarioToSave.createdAt = scenarioToSave.createdAt.toISOString();
        }
        
        let replacedScenario = null;
        
        if (existingIndex !== -1) {
            // Update existing scenario
            scenarios[existingIndex] = scenarioToSave;
        } else {
            // New scenario - check limit
            if (scenarios.length >= MAX_SCENARIOS) {
                // Find and remove the oldest scenario
                const oldestIndex = findOldestScenarioIndex(scenarios);
                replacedScenario = scenarios[oldestIndex];
                scenarios.splice(oldestIndex, 1);
            }
            
            // Add new scenario
            scenarios.push(scenarioToSave);
        }
        
        // Save to localStorage
        localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(scenarios));
        
        const result = { 
            success: true, 
            message: existingIndex !== -1 ? 'Scenario updated successfully' : 'Scenario saved successfully'
        };
        
        if (replacedScenario) {
            result.replacedScenario = replacedScenario;
            result.message = `Scenario saved successfully. Replaced oldest scenario: "${replacedScenario.name}"`;
        }
        
        return result;
    } catch (e) {
        return { success: false, message: `Failed to save scenario: ${e.message}` };
    }
}

/**
 * Finds the index of the oldest scenario based on updatedAt timestamp
 * 
 * @param {FAIRScenario[]} scenarios - Array of scenarios
 * @returns {number} Index of the oldest scenario
 */
function findOldestScenarioIndex(scenarios) {
    if (!scenarios || scenarios.length === 0) {
        return -1;
    }
    
    let oldestIndex = 0;
    let oldestTime = Infinity;
    
    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        const updatedAt = scenario.updatedAt ? new Date(scenario.updatedAt).getTime() : 0;
        
        if (updatedAt < oldestTime) {
            oldestTime = updatedAt;
            oldestIndex = i;
        }
    }
    
    return oldestIndex;
}

/**
 * Loads a scenario from localStorage by ID
 * 
 * @param {string} id - The scenario ID to load
 * @returns {FAIRScenario|null} The loaded scenario or null if not found
 * 
 * @example
 * const scenario = loadScenario('fair_1234567890_abc123');
 * if (scenario) {
 *   console.log(`Loaded scenario: ${scenario.name}`);
 * }
 * 
 * **Validates: Requirements 7.1, 7.3**
 */
function loadScenario(id) {
    if (!id) {
        return null;
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return null;
    }
    
    try {
        const scenarios = listScenarios();
        const scenario = scenarios.find(s => s.id === id);
        
        if (!scenario) {
            return null;
        }
        
        // Convert date strings back to Date objects
        return {
            ...scenario,
            createdAt: scenario.createdAt ? new Date(scenario.createdAt) : new Date(),
            updatedAt: scenario.updatedAt ? new Date(scenario.updatedAt) : new Date()
        };
    } catch (e) {
        return null;
    }
}

/**
 * Lists all saved scenarios from localStorage
 * 
 * Returns scenarios sorted by updatedAt (most recent first).
 * 
 * @returns {FAIRScenario[]} Array of saved scenarios
 * 
 * @example
 * const scenarios = listScenarios();
 * console.log(`Found ${scenarios.length} saved scenarios`);
 * scenarios.forEach(s => console.log(`- ${s.name}`));
 * 
 * **Validates: Requirements 7.1**
 */
function listScenarios() {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return [];
    }
    
    try {
        const data = localStorage.getItem(SCENARIO_STORAGE_KEY);
        if (!data) {
            return [];
        }
        
        const scenarios = JSON.parse(data);
        
        if (!Array.isArray(scenarios)) {
            return [];
        }
        
        // Sort by updatedAt (most recent first)
        return scenarios.sort((a, b) => {
            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return timeB - timeA;
        });
    } catch (e) {
        return [];
    }
}

/**
 * Deletes a scenario from localStorage by ID
 * 
 * @param {string} id - The scenario ID to delete
 * @returns {{success: boolean, message: string}} Result object
 * 
 * @example
 * const result = deleteScenario('fair_1234567890_abc123');
 * if (result.success) {
 *   console.log('Scenario deleted successfully');
 * }
 * 
 * **Validates: Requirements 7.4**
 */
function deleteScenario(id) {
    if (!id) {
        return { success: false, message: 'Scenario ID is required' };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available' };
    }
    
    try {
        const scenarios = listScenarios();
        const initialLength = scenarios.length;
        
        // Filter out the scenario to delete
        const filteredScenarios = scenarios.filter(s => s.id !== id);
        
        if (filteredScenarios.length === initialLength) {
            return { success: false, message: 'Scenario not found' };
        }
        
        // Save the filtered list
        localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(filteredScenarios));
        
        return { success: true, message: 'Scenario deleted successfully' };
    } catch (e) {
        return { success: false, message: `Failed to delete scenario: ${e.message}` };
    }
}

/**
 * Clears all saved scenarios from localStorage
 * 
 * @returns {{success: boolean, message: string, count: number}} Result object with count of deleted scenarios
 * 
 * @example
 * const result = clearAllScenarios();
 * console.log(`Cleared ${result.count} scenarios`);
 */
function clearAllScenarios() {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available', count: 0 };
    }
    
    try {
        const scenarios = listScenarios();
        const count = scenarios.length;
        
        localStorage.removeItem(SCENARIO_STORAGE_KEY);
        
        return { success: true, message: `Cleared ${count} scenarios`, count: count };
    } catch (e) {
        return { success: false, message: `Failed to clear scenarios: ${e.message}`, count: 0 };
    }
}

/**
 * Gets the count of saved scenarios
 * 
 * @returns {number} Number of saved scenarios
 * 
 * @example
 * const count = getScenarioCount();
 * console.log(`${count} scenarios saved (max: ${MAX_SCENARIOS})`);
 */
function getScenarioCount() {
    return listScenarios().length;
}

/**
 * Checks if the maximum number of scenarios has been reached
 * 
 * @returns {boolean} True if at maximum capacity
 * 
 * @example
 * if (isScenarioLimitReached()) {
 *   console.log('Warning: Saving a new scenario will replace the oldest one');
 * }
 */
function isScenarioLimitReached() {
    return getScenarioCount() >= MAX_SCENARIOS;
}

/**
 * Exports all scenarios as a JSON string
 * 
 * @returns {string} JSON string of all scenarios
 * 
 * @example
 * const json = exportScenariosToJSON();
 * // Save to file or clipboard
 * 
 * **Validates: Requirements 7.5**
 */
function exportScenariosToJSON() {
    const scenarios = listScenarios();
    return JSON.stringify(scenarios, null, 2);
}

/**
 * Imports scenarios from a JSON string
 * 
 * Merges imported scenarios with existing ones. If a scenario with the same ID
 * already exists, it will be updated. Respects the maximum scenario limit.
 * 
 * @param {string} json - JSON string containing scenarios to import
 * @returns {{success: boolean, message: string, imported: number, skipped: number}} Result object
 * 
 * @example
 * const result = importScenariosFromJSON(jsonString);
 * console.log(`Imported ${result.imported} scenarios, skipped ${result.skipped}`);
 * 
 * **Validates: Requirements 7.5**
 */
function importScenariosFromJSON(json) {
    if (!json || typeof json !== 'string') {
        return { success: false, message: 'Invalid JSON input', imported: 0, skipped: 0 };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available', imported: 0, skipped: 0 };
    }
    
    try {
        const importedScenarios = JSON.parse(json);
        
        if (!Array.isArray(importedScenarios)) {
            return { success: false, message: 'JSON must contain an array of scenarios', imported: 0, skipped: 0 };
        }
        
        let imported = 0;
        let skipped = 0;
        
        for (const scenario of importedScenarios) {
            // Validate scenario has required fields
            if (!scenario || !scenario.id) {
                skipped++;
                continue;
            }
            
            // Ensure scenario has a name
            if (!scenario.name) {
                scenario.name = 'Imported Scenario';
            }
            
            const result = saveScenario(scenario);
            if (result.success) {
                imported++;
            } else {
                skipped++;
            }
        }
        
        return { 
            success: true, 
            message: `Imported ${imported} scenarios, skipped ${skipped}`,
            imported: imported,
            skipped: skipped
        };
    } catch (e) {
        return { success: false, message: `Failed to parse JSON: ${e.message}`, imported: 0, skipped: 0 };
    }
}

// ============================================================================
// Analysis History Management
// ============================================================================

/**
 * localStorage key for storing analysis history
 * @constant {string}
 */
const HISTORY_STORAGE_KEY = 'fair_history';

/**
 * Maximum number of history entries to store
 * @constant {number}
 */
const MAX_HISTORY_ENTRIES = 50;

/**
 * History entry object
 * @typedef {Object} HistoryEntry
 * @property {string} id - Unique identifier for the history entry
 * @property {FAIRScenario} scenario - The scenario that was analyzed
 * @property {RiskOutput} results - The simulation results
 * @property {Date} timestamp - When the analysis was performed
 * @property {string[]} [tags] - Optional tags for categorization
 */

/**
 * Generates a unique identifier for history entries
 * @returns {string} Unique ID
 */
function generateHistoryId() {
    return 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Saves an analysis result to history
 * 
 * @param {FAIRScenario} scenario - The scenario that was analyzed
 * @param {RiskOutput} results - The simulation results
 * @param {string[]} [tags] - Optional tags for categorization
 * @returns {{success: boolean, message: string, id?: string}} Result object
 * 
 * @example
 * const result = saveToHistory(scenario, simulationResults, ['ransomware', 'high-risk']);
 * if (result.success) {
 *   console.log(`Saved to history with ID: ${result.id}`);
 * }
 * 
 * **Validates: Requirements 7.2**
 */
function saveToHistory(scenario, results, tags = []) {
    // Validate inputs
    if (!scenario) {
        return { success: false, message: 'Scenario is required' };
    }
    
    if (!results) {
        return { success: false, message: 'Results are required' };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available' };
    }
    
    try {
        // Get existing history
        const history = loadHistory();
        
        // Create history entry
        const entry = {
            id: generateHistoryId(),
            scenario: JSON.parse(JSON.stringify(scenario)), // Deep clone
            results: JSON.parse(JSON.stringify(results)), // Deep clone
            timestamp: new Date().toISOString(),
            tags: tags || []
        };
        
        // Add to beginning of history (most recent first)
        history.unshift(entry);
        
        // Enforce max entries limit
        while (history.length > MAX_HISTORY_ENTRIES) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        
        return { success: true, message: 'Saved to history', id: entry.id };
    } catch (e) {
        return { success: false, message: `Failed to save to history: ${e.message}` };
    }
}

/**
 * Loads all history entries from localStorage
 * 
 * Returns entries sorted by timestamp (most recent first).
 * 
 * @returns {HistoryEntry[]} Array of history entries
 * 
 * @example
 * const history = loadHistory();
 * console.log(`Found ${history.length} history entries`);
 * 
 * **Validates: Requirements 7.2**
 */
function loadHistory() {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return [];
    }
    
    try {
        const data = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!data) {
            return [];
        }
        
        const history = JSON.parse(data);
        
        if (!Array.isArray(history)) {
            return [];
        }
        
        // Sort by timestamp (most recent first)
        return history.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        });
    } catch (e) {
        return [];
    }
}

/**
 * Gets a specific history entry by ID
 * 
 * @param {string} id - The history entry ID
 * @returns {HistoryEntry|null} The history entry or null if not found
 * 
 * @example
 * const entry = getHistoryEntry('hist_1234567890_abc123');
 * if (entry) {
 *   console.log(`Found entry for scenario: ${entry.scenario.name}`);
 * }
 * 
 * **Validates: Requirements 7.3**
 */
function getHistoryEntry(id) {
    if (!id) {
        return null;
    }
    
    const history = loadHistory();
    return history.find(entry => entry.id === id) || null;
}

/**
 * Deletes a history entry by ID
 * 
 * @param {string} id - The history entry ID to delete
 * @returns {{success: boolean, message: string}} Result object
 * 
 * @example
 * const result = deleteHistoryEntry('hist_1234567890_abc123');
 * if (result.success) {
 *   console.log('History entry deleted');
 * }
 * 
 * **Validates: Requirements 7.4**
 */
function deleteHistoryEntry(id) {
    if (!id) {
        return { success: false, message: 'History entry ID is required' };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available' };
    }
    
    try {
        const history = loadHistory();
        const initialLength = history.length;
        
        // Filter out the entry to delete
        const filteredHistory = history.filter(entry => entry.id !== id);
        
        if (filteredHistory.length === initialLength) {
            return { success: false, message: 'History entry not found' };
        }
        
        // Save the filtered list
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredHistory));
        
        return { success: true, message: 'History entry deleted' };
    } catch (e) {
        return { success: false, message: `Failed to delete history entry: ${e.message}` };
    }
}

/**
 * Clears all history entries from localStorage
 * 
 * @returns {{success: boolean, message: string, count: number}} Result object
 * 
 * @example
 * const result = clearHistory();
 * console.log(`Cleared ${result.count} history entries`);
 */
function clearHistory() {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available', count: 0 };
    }
    
    try {
        const history = loadHistory();
        const count = history.length;
        
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        
        return { success: true, message: `Cleared ${count} history entries`, count: count };
    } catch (e) {
        return { success: false, message: `Failed to clear history: ${e.message}`, count: 0 };
    }
}

/**
 * Gets the count of history entries
 * 
 * @returns {number} Number of history entries
 */
function getHistoryCount() {
    return loadHistory().length;
}

/**
 * Restores a scenario from a history entry
 * 
 * Creates a new scenario based on the historical scenario data.
 * The new scenario will have a new ID and updated timestamps.
 * 
 * @param {string} historyId - The history entry ID to restore from
 * @returns {{success: boolean, message: string, scenario?: FAIRScenario}} Result object
 * 
 * @example
 * const result = restoreFromHistory('hist_1234567890_abc123');
 * if (result.success) {
 *   // Use result.scenario
 * }
 * 
 * **Validates: Requirements 7.3**
 */
function restoreFromHistory(historyId) {
    if (!historyId) {
        return { success: false, message: 'History entry ID is required' };
    }
    
    const entry = getHistoryEntry(historyId);
    if (!entry) {
        return { success: false, message: 'History entry not found' };
    }
    
    try {
        // Create a new scenario based on the historical one
        const restoredScenario = {
            ...entry.scenario,
            id: generateScenarioId(),
            name: entry.scenario.name + ' (Restored)',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return { 
            success: true, 
            message: 'Scenario restored from history',
            scenario: restoredScenario
        };
    } catch (e) {
        return { success: false, message: `Failed to restore from history: ${e.message}` };
    }
}

/**
 * Exports all history entries as a JSON string
 * 
 * @returns {string} JSON string of all history entries
 * 
 * @example
 * const json = exportHistoryToJSON();
 * // Save to file or clipboard
 */
function exportHistoryToJSON() {
    const history = loadHistory();
    return JSON.stringify(history, null, 2);
}

/**
 * Imports history entries from a JSON string
 * 
 * Merges imported entries with existing history. Respects the maximum entry limit.
 * 
 * @param {string} json - JSON string containing history entries to import
 * @returns {{success: boolean, message: string, imported: number, skipped: number}} Result object
 * 
 * @example
 * const result = importHistoryFromJSON(jsonString);
 * console.log(`Imported ${result.imported} history entries`);
 */
function importHistoryFromJSON(json) {
    if (!json || typeof json !== 'string') {
        return { success: false, message: 'Invalid JSON input', imported: 0, skipped: 0 };
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        return { success: false, message: 'localStorage is not available', imported: 0, skipped: 0 };
    }
    
    try {
        const importedEntries = JSON.parse(json);
        
        if (!Array.isArray(importedEntries)) {
            return { success: false, message: 'JSON must contain an array of history entries', imported: 0, skipped: 0 };
        }
        
        // Get existing history
        const history = loadHistory();
        const existingIds = new Set(history.map(e => e.id));
        
        let imported = 0;
        let skipped = 0;
        
        for (const entry of importedEntries) {
            // Validate entry has required fields
            if (!entry || !entry.id || !entry.scenario || !entry.results) {
                skipped++;
                continue;
            }
            
            // Skip if already exists
            if (existingIds.has(entry.id)) {
                skipped++;
                continue;
            }
            
            // Add to history
            history.push(entry);
            existingIds.add(entry.id);
            imported++;
        }
        
        // Sort by timestamp and enforce limit
        history.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        });
        
        while (history.length > MAX_HISTORY_ENTRIES) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        
        return { 
            success: true, 
            message: `Imported ${imported} history entries, skipped ${skipped}`,
            imported: imported,
            skipped: skipped
        };
    } catch (e) {
        return { success: false, message: `Failed to parse JSON: ${e.message}`, imported: 0, skipped: 0 };
    }
}

// ============================================================================
// Module Exports (for ES6 modules or global scope)
// ============================================================================

// Export as global object for browser usage (non-module scripts)
if (typeof window !== 'undefined') {
    window.FAIRCore = {
        // Factory functions
        createPERTInput: createPERTInput,
        createDefaultLEFInput: createDefaultLEFInput,
        createDefaultLMInput: createDefaultLMInput,
        createDefaultControlInput: createDefaultControlInput,
        createDefaultSimulationConfig: createDefaultSimulationConfig,
        createDefaultScenario: createDefaultScenario,
        createScenario: createScenario,
        createSecondaryLossCategory: createSecondaryLossCategory,
        createAdvancedLEFInput: createAdvancedLEFInput,
        createFullyDecomposedLEFInput: createFullyDecomposedLEFInput,
        createLMInputWithCategories: createLMInputWithCategories,
        
        // Utility functions
        generateScenarioId: generateScenarioId,
        cloneScenario: cloneScenario,
        touchScenario: touchScenario,
        isAdvancedTEFMode: isAdvancedTEFMode,
        isAdvancedVulnerabilityMode: isAdvancedVulnerabilityMode,
        hasSecondaryLossCategories: hasSecondaryLossCategories,
        hasControlConfiguration: hasControlConfiguration,
        
        // Validation functions
        autoCorrectPERTOrder: autoCorrectPERTOrder,
        needsPERTOrderCorrection: needsPERTOrderCorrection,
        validatePERTInput: validatePERTInput,
        validateSimulationRuns: validateSimulationRuns,
        validateScenario: validateScenario,
        MIN_SIMULATION_RUNS: MIN_SIMULATION_RUNS,
        MAX_SIMULATION_RUNS: MAX_SIMULATION_RUNS,
        
        // FAIR Model Calculation functions
        calculateTEF: calculateTEF,
        calculateTEFFromPERT: calculateTEFFromPERT,
        getEffectiveTEF: getEffectiveTEF,
        calculateSusceptibility: calculateSusceptibility,
        calculateVulnerability: calculateVulnerability,
        calculateSusceptibilityFromPERT: calculateSusceptibilityFromPERT,
        calculateVulnerabilityFromPERT: calculateVulnerabilityFromPERT,
        calculateVulnerabilityFromTCRS: calculateVulnerabilityFromTCRS,
        getEffectiveVulnerability: getEffectiveVulnerability,
        
        // Secondary Loss Calculation functions
        calculateSecondaryLoss: calculateSecondaryLoss,
        calculateSecondaryLossFromPERT: calculateSecondaryLossFromPERT,
        aggregateSecondaryLossCategories: aggregateSecondaryLossCategories,
        aggregateSecondaryLossCategoriesPERT: aggregateSecondaryLossCategoriesPERT,
        getEffectiveSecondaryLoss: getEffectiveSecondaryLoss,
        
        // Convergence Metrics functions
        CONVERGENCE_THRESHOLD: CONVERGENCE_THRESHOLD,
        MIN_RUNS_FOR_CONVERGENCE: MIN_RUNS_FOR_CONVERGENCE,
        calculateConvergenceMetrics: calculateConvergenceMetrics,
        calculateQuantileStdError: calculateQuantileStdError,
        
        // Sensitivity Analysis functions
        rankInfluentialParameters: rankInfluentialParameters,
        getTopInfluentialParameters: getTopInfluentialParameters,
        
        // Cache Manager functions
        CACHE_DEFAULT_TTL: CACHE_DEFAULT_TTL,
        CACHE_KEY_PREFIX: CACHE_KEY_PREFIX,
        CACHE_MAX_ENTRIES: CACHE_MAX_ENTRIES,
        hashScenarioInputs: hashScenarioInputs,
        setCachedResult: setCachedResult,
        getCachedResult: getCachedResult,
        hasCachedResult: hasCachedResult,
        getCachedResultForScenario: getCachedResultForScenario,
        cacheResultForScenario: cacheResultForScenario,
        cleanupExpiredCache: cleanupExpiredCache,
        enforceMaxCacheEntries: enforceMaxCacheEntries,
        clearAllCache: clearAllCache,
        getCacheStats: getCacheStats,
        
        // Scenario Persistence Manager exports
        SCENARIO_STORAGE_KEY: SCENARIO_STORAGE_KEY,
        MAX_SCENARIOS: MAX_SCENARIOS,
        saveScenario: saveScenario,
        loadScenario: loadScenario,
        listScenarios: listScenarios,
        deleteScenario: deleteScenario,
        clearAllScenarios: clearAllScenarios,
        getScenarioCount: getScenarioCount,
        isScenarioLimitReached: isScenarioLimitReached,
        exportScenariosToJSON: exportScenariosToJSON,
        importScenariosFromJSON: importScenariosFromJSON,
        
        // History Management exports
        HISTORY_STORAGE_KEY: HISTORY_STORAGE_KEY,
        MAX_HISTORY_ENTRIES: MAX_HISTORY_ENTRIES,
        generateHistoryId: generateHistoryId,
        saveToHistory: saveToHistory,
        loadHistory: loadHistory,
        getHistoryEntry: getHistoryEntry,
        deleteHistoryEntry: deleteHistoryEntry,
        clearHistory: clearHistory,
        getHistoryCount: getHistoryCount,
        restoreFromHistory: restoreFromHistory,
        exportHistoryToJSON: exportHistoryToJSON,
        importHistoryFromJSON: importHistoryFromJSON
    };
}

// Export for CommonJS (Node.js without ESM)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createPERTInput,
        createDefaultLEFInput,
        createDefaultLMInput,
        createDefaultControlInput,
        createDefaultSimulationConfig,
        createDefaultScenario,
        createScenario,
        createSecondaryLossCategory,
        createAdvancedLEFInput,
        createFullyDecomposedLEFInput,
        createLMInputWithCategories,
        generateScenarioId,
        cloneScenario,
        touchScenario,
        isAdvancedTEFMode,
        isAdvancedVulnerabilityMode,
        hasSecondaryLossCategories,
        hasControlConfiguration,
        autoCorrectPERTOrder,
        needsPERTOrderCorrection,
        validatePERTInput,
        validateSimulationRuns,
        validateScenario,
        MIN_SIMULATION_RUNS,
        MAX_SIMULATION_RUNS,
        calculateTEF,
        calculateTEFFromPERT,
        getEffectiveTEF,
        calculateSusceptibility,
        calculateVulnerability,
        calculateSusceptibilityFromPERT,
        calculateVulnerabilityFromPERT,
        calculateVulnerabilityFromTCRS,
        getEffectiveVulnerability,
        calculateSecondaryLoss,
        calculateSecondaryLossFromPERT,
        aggregateSecondaryLossCategories,
        aggregateSecondaryLossCategoriesPERT,
        getEffectiveSecondaryLoss,
        CONVERGENCE_THRESHOLD,
        MIN_RUNS_FOR_CONVERGENCE,
        calculateConvergenceMetrics,
        calculateQuantileStdError,
        // Sensitivity Analysis exports
        rankInfluentialParameters,
        getTopInfluentialParameters,
        // Cache Manager exports
        CACHE_DEFAULT_TTL,
        CACHE_KEY_PREFIX,
        CACHE_MAX_ENTRIES,
        hashScenarioInputs,
        setCachedResult,
        getCachedResult,
        hasCachedResult,
        getCachedResultForScenario,
        cacheResultForScenario,
        cleanupExpiredCache,
        enforceMaxCacheEntries,
        clearAllCache,
        getCacheStats,
        // Scenario Persistence Manager exports
        SCENARIO_STORAGE_KEY,
        MAX_SCENARIOS,
        saveScenario,
        loadScenario,
        listScenarios,
        deleteScenario,
        clearAllScenarios,
        getScenarioCount,
        isScenarioLimitReached,
        exportScenariosToJSON,
        importScenariosFromJSON,
        // History Management exports
        HISTORY_STORAGE_KEY,
        MAX_HISTORY_ENTRIES,
        generateHistoryId,
        saveToHistory,
        loadHistory,
        getHistoryEntry,
        deleteHistoryEntry,
        clearHistory,
        getHistoryCount,
        restoreFromHistory,
        exportHistoryToJSON,
        importHistoryFromJSON
    };
}

// ES6 module exports are commented out because this file is loaded as a regular script
// in fair.html. The window.FAIRCore global object provides all exports for browser usage.
// If you need ES6 module support, load this file with <script type="module">
/*
export {
    createPERTInput,
    createDefaultLEFInput,
    createDefaultLMInput,
    createDefaultControlInput,
    createDefaultSimulationConfig,
    createDefaultScenario,
    createScenario,
    createSecondaryLossCategory,
    createAdvancedLEFInput,
    createFullyDecomposedLEFInput,
    createLMInputWithCategories,
    generateScenarioId,
    cloneScenario,
    touchScenario,
    isAdvancedTEFMode,
    isAdvancedVulnerabilityMode,
    hasSecondaryLossCategories,
    hasControlConfiguration,
    autoCorrectPERTOrder,
    needsPERTOrderCorrection,
    validatePERTInput,
    validateSimulationRuns,
    validateScenario,
    MIN_SIMULATION_RUNS,
    MAX_SIMULATION_RUNS,
    calculateTEF,
    calculateTEFFromPERT,
    getEffectiveTEF,
    calculateSusceptibility,
    calculateVulnerability,
    calculateSusceptibilityFromPERT,
    calculateVulnerabilityFromPERT,
    calculateVulnerabilityFromTCRS,
    getEffectiveVulnerability,
    calculateSecondaryLoss,
    calculateSecondaryLossFromPERT,
    aggregateSecondaryLossCategories,
    aggregateSecondaryLossCategoriesPERT,
    getEffectiveSecondaryLoss,
    CONVERGENCE_THRESHOLD,
    MIN_RUNS_FOR_CONVERGENCE,
    calculateConvergenceMetrics,
    calculateQuantileStdError,
    // Sensitivity Analysis exports
    rankInfluentialParameters,
    getTopInfluentialParameters,
    // Cache Manager exports
    CACHE_DEFAULT_TTL,
    CACHE_KEY_PREFIX,
    CACHE_MAX_ENTRIES,
    hashScenarioInputs,
    setCachedResult,
    getCachedResult,
    hasCachedResult,
    getCachedResultForScenario,
    cacheResultForScenario,
    cleanupExpiredCache,
    enforceMaxCacheEntries,
    clearAllCache,
    getCacheStats,
    // Scenario Persistence Manager exports
    SCENARIO_STORAGE_KEY,
    MAX_SCENARIOS,
    saveScenario,
    loadScenario,
    listScenarios,
    deleteScenario,
    clearAllScenarios,
    getScenarioCount,
    isScenarioLimitReached,
    exportScenariosToJSON,
    importScenariosFromJSON,
    // History Management exports
    HISTORY_STORAGE_KEY,
    MAX_HISTORY_ENTRIES,
    generateHistoryId,
    saveToHistory,
    loadHistory,
    getHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    getHistoryCount,
    restoreFromHistory,
    exportHistoryToJSON,
    importHistoryFromJSON,
    // Comparison Table exports
    calculateRiskPriority,
    prepareComparisonTableData,
    sortComparisonTableData,
    filterComparisonTableData,
    getComparisonTableData,
    validateComparisonTableRow,
    validateComparisonTableData,
    getComparisonTableSummary,
    // Comparison Export exports
    exportComparisonToCSV,
    generateComparisonReportData,
    downloadComparisonCSV,
    // Report Generator exports (added later in file)
    calculatePercentile,
    calculatePercentiles,
    calculateConfidenceInterval,
    formatCurrency,
    formatPercentage,
    getReportLabels,
    assessRiskLevel,
    generateExecutiveSummary,
    generateMethodologySection,
    generateInputsSection,
    generateResultsSection,
    generateInvestmentRecommendation,
    generateRecommendationsSection,
    generateReportData,
    generateReportHTML,
    generateReport,
    openReportInNewWindow,
    // Chart generation exports
    generateLossExceedanceCurveData,
    generateTornadoChartData,
    getLossExceedanceCurveOptions,
    getTornadoChartOptions,
    generateChartsSection,
    generateReportDataWithCharts,
    generateReportWithCharts,
    // PDF export functions
    exportReportToPDF,
    downloadReportPDF,
    exportHTMLReportToPDF
};
*/

// ============================================================================
// Scenario Comparison Table Functions
// ============================================================================

/**
 * Comparison table row data
 * @typedef {Object} ComparisonTableRow
 * @property {string} id - Scenario ID
 * @property {string} name - Scenario name
 * @property {number} aal - Average Annual Loss
 * @property {number} var90 - Value at Risk 90th percentile
 * @property {number|null} rosi - Return on Security Investment (null if not applicable)
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} priority - Risk priority level ('critical', 'high', 'medium', 'low')
 */

/**
 * Comparison table sort configuration
 * @typedef {Object} SortConfig
 * @property {'name'|'aal'|'var90'|'rosi'|'updatedAt'} field - Field to sort by
 * @property {'asc'|'desc'} direction - Sort direction
 */

/**
 * Comparison table filter configuration
 * @typedef {Object} FilterConfig
 * @property {string} [searchTerm] - Search term for scenario name
 * @property {string[]} [priorities] - Filter by priority levels
 * @property {number} [minAAL] - Minimum AAL filter
 * @property {number} [maxAAL] - Maximum AAL filter
 */

/**
 * Calculates risk priority level based on AAL and VaR values
 * 
 * Priority levels:
 * - Critical: AAL > 1,000,000 or VaR90 > 5,000,000
 * - High: AAL > 500,000 or VaR90 > 2,000,000
 * - Medium: AAL > 100,000 or VaR90 > 500,000
 * - Low: Everything else
 * 
 * @param {number} aal - Average Annual Loss
 * @param {number} var90 - Value at Risk 90th percentile
 * @returns {string} Priority level ('critical', 'high', 'medium', 'low')
 * 
 * @example
 * calculateRiskPriority(1500000, 6000000); // Returns 'critical'
 * calculateRiskPriority(300000, 1000000); // Returns 'medium'
 */
function calculateRiskPriority(aal, var90) {
    if (aal > 1000000 || var90 > 5000000) {
        return 'critical';
    }
    if (aal > 500000 || var90 > 2000000) {
        return 'high';
    }
    if (aal > 100000 || var90 > 500000) {
        return 'medium';
    }
    return 'low';
}

/**
 * Prepares comparison table data from saved scenarios
 * 
 * Extracts relevant fields from scenarios and their risk outputs
 * for display in the comparison table.
 * 
 * @param {FAIRScenario[]} scenarios - Array of saved scenarios
 * @returns {ComparisonTableRow[]} Array of comparison table rows
 * 
 * @example
 * const scenarios = listScenarios();
 * const tableData = prepareComparisonTableData(scenarios);
 * // Returns array of { id, name, aal, var90, rosi, updatedAt, priority }
 * 
 * **Validates: Requirements 4.2**
 */
function prepareComparisonTableData(scenarios) {
    if (!scenarios || !Array.isArray(scenarios)) {
        return [];
    }
    
    return scenarios.map(scenario => {
        const risk = scenario.risk || {};
        const aal = risk.aal || 0;
        const var90 = risk.var90 || 0;
        const rosi = risk.rosi !== undefined ? risk.rosi : null;
        
        return {
            id: scenario.id,
            name: scenario.name || 'Unnamed Scenario',
            aal: aal,
            var90: var90,
            rosi: rosi,
            updatedAt: scenario.updatedAt ? new Date(scenario.updatedAt) : new Date(),
            priority: calculateRiskPriority(aal, var90)
        };
    });
}

/**
 * Sorts comparison table data by specified field and direction
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @param {SortConfig} sortConfig - Sort configuration
 * @returns {ComparisonTableRow[]} Sorted array (new array, original not modified)
 * 
 * @example
 * const sorted = sortComparisonTableData(tableData, { field: 'aal', direction: 'desc' });
 */
function sortComparisonTableData(data, sortConfig) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
    }
    
    if (!sortConfig || !sortConfig.field) {
        return [...data];
    }
    
    const { field, direction = 'asc' } = sortConfig;
    const multiplier = direction === 'desc' ? -1 : 1;
    
    return [...data].sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];
        
        // Handle null/undefined values
        if (valueA === null || valueA === undefined) valueA = direction === 'asc' ? Infinity : -Infinity;
        if (valueB === null || valueB === undefined) valueB = direction === 'asc' ? Infinity : -Infinity;
        
        // Handle string comparison
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return multiplier * valueA.localeCompare(valueB);
        }
        
        // Handle date comparison
        if (valueA instanceof Date && valueB instanceof Date) {
            return multiplier * (valueA.getTime() - valueB.getTime());
        }
        
        // Handle numeric comparison
        return multiplier * (valueA - valueB);
    });
}

/**
 * Filters comparison table data based on filter configuration
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @param {FilterConfig} filterConfig - Filter configuration
 * @returns {ComparisonTableRow[]} Filtered array (new array, original not modified)
 * 
 * @example
 * const filtered = filterComparisonTableData(tableData, { 
 *   searchTerm: 'ransomware',
 *   priorities: ['critical', 'high']
 * });
 */
function filterComparisonTableData(data, filterConfig) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
    }
    
    if (!filterConfig) {
        return [...data];
    }
    
    return data.filter(row => {
        // Search term filter (case-insensitive)
        if (filterConfig.searchTerm) {
            const searchLower = filterConfig.searchTerm.toLowerCase();
            if (!row.name.toLowerCase().includes(searchLower)) {
                return false;
            }
        }
        
        // Priority filter
        if (filterConfig.priorities && filterConfig.priorities.length > 0) {
            if (!filterConfig.priorities.includes(row.priority)) {
                return false;
            }
        }
        
        // AAL range filter
        if (filterConfig.minAAL !== undefined && row.aal < filterConfig.minAAL) {
            return false;
        }
        if (filterConfig.maxAAL !== undefined && row.aal > filterConfig.maxAAL) {
            return false;
        }
        
        return true;
    });
}

/**
 * Gets comparison table data with sorting and filtering applied
 * 
 * This is a convenience function that combines data preparation,
 * filtering, and sorting in one call.
 * 
 * @param {SortConfig} [sortConfig] - Optional sort configuration
 * @param {FilterConfig} [filterConfig] - Optional filter configuration
 * @returns {ComparisonTableRow[]} Processed comparison table data
 * 
 * @example
 * const tableData = getComparisonTableData(
 *   { field: 'aal', direction: 'desc' },
 *   { priorities: ['critical', 'high'] }
 * );
 * 
 * **Validates: Requirements 4.2**
 */
function getComparisonTableData(sortConfig, filterConfig) {
    const scenarios = listScenarios();
    let data = prepareComparisonTableData(scenarios);
    
    if (filterConfig) {
        data = filterComparisonTableData(data, filterConfig);
    }
    
    if (sortConfig) {
        data = sortComparisonTableData(data, sortConfig);
    }
    
    return data;
}

/**
 * Validates that a comparison table row contains all required fields
 * 
 * Each row must have: id, name, aal, var90, rosi (or null), priority
 * 
 * @param {ComparisonTableRow} row - Row to validate
 * @returns {boolean} True if row is valid
 * 
 * @example
 * const isValid = validateComparisonTableRow(row);
 * 
 * **Validates: Requirements 4.2 - Property 12: Comparison Table Completeness**
 */
function validateComparisonTableRow(row) {
    if (!row || typeof row !== 'object') {
        return false;
    }
    
    // Check required fields exist
    if (!row.id || typeof row.id !== 'string') {
        return false;
    }
    
    if (!row.name || typeof row.name !== 'string') {
        return false;
    }
    
    if (typeof row.aal !== 'number' || isNaN(row.aal)) {
        return false;
    }
    
    if (typeof row.var90 !== 'number' || isNaN(row.var90)) {
        return false;
    }
    
    // ROSI can be null or a number
    if (row.rosi !== null && (typeof row.rosi !== 'number' || isNaN(row.rosi))) {
        return false;
    }
    
    // Priority must be one of the valid values
    const validPriorities = ['critical', 'high', 'medium', 'low'];
    if (!row.priority || !validPriorities.includes(row.priority)) {
        return false;
    }
    
    return true;
}

/**
 * Validates all rows in comparison table data
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @returns {{isValid: boolean, invalidRows: number[]}} Validation result
 * 
 * @example
 * const result = validateComparisonTableData(tableData);
 * if (!result.isValid) {
 *   console.log('Invalid rows:', result.invalidRows);
 * }
 * 
 * **Validates: Requirements 4.2 - Property 12: Comparison Table Completeness**
 */
function validateComparisonTableData(data) {
    if (!data || !Array.isArray(data)) {
        return { isValid: false, invalidRows: [] };
    }
    
    const invalidRows = [];
    
    for (let i = 0; i < data.length; i++) {
        if (!validateComparisonTableRow(data[i])) {
            invalidRows.push(i);
        }
    }
    
    return {
        isValid: invalidRows.length === 0,
        invalidRows: invalidRows
    };
}

/**
 * Calculates summary statistics for comparison table data
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @returns {Object} Summary statistics
 * 
 * @example
 * const stats = getComparisonTableSummary(tableData);
 * // Returns { totalScenarios, totalAAL, avgAAL, maxAAL, minAAL, ... }
 */
function getComparisonTableSummary(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return {
            totalScenarios: 0,
            totalAAL: 0,
            avgAAL: 0,
            maxAAL: 0,
            minAAL: 0,
            totalVaR90: 0,
            avgVaR90: 0,
            priorityCounts: { critical: 0, high: 0, medium: 0, low: 0 }
        };
    }
    
    const aalValues = data.map(row => row.aal);
    const var90Values = data.map(row => row.var90);
    
    const priorityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    data.forEach(row => {
        if (priorityCounts[row.priority] !== undefined) {
            priorityCounts[row.priority]++;
        }
    });
    
    return {
        totalScenarios: data.length,
        totalAAL: aalValues.reduce((sum, val) => sum + val, 0),
        avgAAL: aalValues.reduce((sum, val) => sum + val, 0) / data.length,
        maxAAL: Math.max(...aalValues),
        minAAL: Math.min(...aalValues),
        totalVaR90: var90Values.reduce((sum, val) => sum + val, 0),
        avgVaR90: var90Values.reduce((sum, val) => sum + val, 0) / data.length,
        priorityCounts: priorityCounts
    };
}

// ============================================================================
// Comparison Export Functions
// ============================================================================

/**
 * Exports comparison table data to CSV format
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @param {Object} options - Export options
 * @param {string} [options.currency='USD'] - Currency symbol for formatting
 * @param {Object} [options.headers] - Custom header labels
 * @returns {string} CSV content string
 * 
 * @example
 * const csvContent = exportComparisonToCSV(tableData, { currency: 'TWD' });
 * 
 * **Validates: Requirements 4.4**
 */
function exportComparisonToCSV(data, options = {}) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '';
    }
    
    const currency = options.currency || 'USD';
    const headers = options.headers || {
        scenario: 'Scenario',
        aal: 'AAL',
        var90: 'VaR 90%',
        rosi: 'ROSI',
        priority: 'Priority',
        updatedAt: 'Last Updated'
    };
    
    // Build CSV header row
    const headerRow = [
        headers.scenario,
        `${headers.aal} (${currency})`,
        `${headers.var90} (${currency})`,
        `${headers.rosi} (%)`,
        headers.priority,
        headers.updatedAt
    ].join(',');
    
    // Build data rows
    const dataRows = data.map(row => {
        const rosiValue = row.rosi !== null ? row.rosi.toFixed(1) : 'N/A';
        const updatedAt = row.updatedAt instanceof Date 
            ? row.updatedAt.toISOString().slice(0, 10)
            : new Date(row.updatedAt).toISOString().slice(0, 10);
        
        // Escape scenario name for CSV (handle commas and quotes)
        const escapedName = `"${row.name.replace(/"/g, '""')}"`;
        
        return [
            escapedName,
            row.aal.toFixed(2),
            row.var90.toFixed(2),
            rosiValue,
            row.priority,
            updatedAt
        ].join(',');
    });
    
    return [headerRow, ...dataRows].join('\n');
}

/**
 * Generates comparison report data for PDF export
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @param {Object} options - Report options
 * @param {string} [options.title] - Report title
 * @param {string} [options.currency='USD'] - Currency symbol
 * @param {Object} [options.labels] - Custom labels for the report
 * @returns {Object} Report data structure for PDF generation
 * 
 * @example
 * const reportData = generateComparisonReportData(tableData, { 
 *   title: 'Risk Comparison Report',
 *   currency: 'USD'
 * });
 * 
 * **Validates: Requirements 4.4**
 */
function generateComparisonReportData(data, options = {}) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }
    
    const currency = options.currency || 'USD';
    const title = options.title || 'Scenario Comparison Report';
    const labels = options.labels || {
        scenario: 'Scenario',
        aal: 'AAL',
        var90: 'VaR 90%',
        rosi: 'ROSI',
        priority: 'Priority',
        summary: 'Summary',
        totalScenarios: 'Total Scenarios',
        totalAAL: 'Total AAL',
        avgAAL: 'Average AAL',
        criticalHigh: 'Critical/High Priority',
        generatedAt: 'Generated at'
    };
    
    // Calculate summary
    const summary = getComparisonTableSummary(data);
    
    // Format table data
    const tableData = data.map(row => ({
        name: row.name,
        aal: row.aal,
        var90: row.var90,
        rosi: row.rosi,
        rosiFormatted: row.rosi !== null ? `${row.rosi.toFixed(1)}%` : 'N/A',
        priority: row.priority,
        priorityLabel: row.priority.charAt(0).toUpperCase() + row.priority.slice(1),
        updatedAt: row.updatedAt instanceof Date 
            ? row.updatedAt.toISOString().slice(0, 10)
            : new Date(row.updatedAt).toISOString().slice(0, 10)
    }));
    
    return {
        title: title,
        currency: currency,
        labels: labels,
        generatedAt: new Date().toISOString(),
        summary: {
            totalScenarios: summary.totalScenarios,
            totalAAL: summary.totalAAL,
            avgAAL: summary.avgAAL,
            maxAAL: summary.maxAAL,
            minAAL: summary.minAAL,
            criticalCount: summary.priorityCounts.critical,
            highCount: summary.priorityCounts.high,
            mediumCount: summary.priorityCounts.medium,
            lowCount: summary.priorityCounts.low
        },
        tableData: tableData
    };
}

/**
 * Downloads comparison data as CSV file
 * 
 * @param {ComparisonTableRow[]} data - Array of comparison table rows
 * @param {Object} options - Export options
 * @param {string} [options.filename] - Custom filename (without extension)
 * @param {string} [options.currency='USD'] - Currency symbol
 * @param {Object} [options.headers] - Custom header labels
 * 
 * @example
 * downloadComparisonCSV(tableData, { filename: 'risk_comparison', currency: 'TWD' });
 * 
 * **Validates: Requirements 4.4**
 */
function downloadComparisonCSV(data, options = {}) {
    const csvContent = exportComparisonToCSV(data, options);
    
    if (!csvContent) {
        return false;
    }
    
    const filename = options.filename || `FAIR_Comparison_${new Date().toISOString().slice(0, 10)}`;
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
}

// Add comparison table functions to window.FAIRCore
if (typeof window !== 'undefined' && window.FAIRCore) {
    window.FAIRCore.calculateRiskPriority = calculateRiskPriority;
    window.FAIRCore.prepareComparisonTableData = prepareComparisonTableData;
    window.FAIRCore.sortComparisonTableData = sortComparisonTableData;
    window.FAIRCore.filterComparisonTableData = filterComparisonTableData;
    window.FAIRCore.getComparisonTableData = getComparisonTableData;
    window.FAIRCore.validateComparisonTableRow = validateComparisonTableRow;
    window.FAIRCore.validateComparisonTableData = validateComparisonTableData;
    window.FAIRCore.getComparisonTableSummary = getComparisonTableSummary;
    window.FAIRCore.exportComparisonToCSV = exportComparisonToCSV;
    window.FAIRCore.generateComparisonReportData = generateComparisonReportData;
    window.FAIRCore.downloadComparisonCSV = downloadComparisonCSV;
}

// Add to CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports.calculateRiskPriority = calculateRiskPriority;
    module.exports.prepareComparisonTableData = prepareComparisonTableData;
    module.exports.sortComparisonTableData = sortComparisonTableData;
    module.exports.filterComparisonTableData = filterComparisonTableData;
    module.exports.getComparisonTableData = getComparisonTableData;
    module.exports.validateComparisonTableRow = validateComparisonTableRow;
    module.exports.validateComparisonTableData = validateComparisonTableData;
    module.exports.getComparisonTableSummary = getComparisonTableSummary;
    module.exports.exportComparisonToCSV = exportComparisonToCSV;
    module.exports.generateComparisonReportData = generateComparisonReportData;
    module.exports.downloadComparisonCSV = downloadComparisonCSV;
}

// ============================================================================
// Report Generator Functions
// ============================================================================

/**
 * Report configuration options
 * @typedef {Object} ReportConfig
 * @property {string} [title] - Report title
 * @property {boolean} [includeExecutiveSummary=true] - Include executive summary section
 * @property {boolean} [includeMethodology=true] - Include methodology section
 * @property {boolean} [includeInputs=true] - Include inputs section
 * @property {boolean} [includeResults=true] - Include results section
 * @property {boolean} [includeCharts=true] - Include charts section
 * @property {boolean} [includeSensitivity=false] - Include sensitivity analysis
 * @property {boolean} [includeRecommendations=true] - Include recommendations
 * @property {string} [format='html'] - Output format ('html' or 'pdf')
 * @property {string} [language='en'] - Language code
 * @property {string} [currency='USD'] - Currency symbol
 */

/**
 * Report section structure
 * @typedef {Object} ReportSection
 * @property {string} id - Section identifier
 * @property {string} title - Section title
 * @property {string} content - HTML content
 */

/**
 * Complete report data structure
 * @typedef {Object} ReportData
 * @property {string} title - Report title
 * @property {string} generatedAt - ISO timestamp
 * @property {string} scenarioName - Scenario name
 * @property {ReportSection[]} sections - Report sections
 * @property {Object} metadata - Report metadata
 */

/**
 * Calculates percentile value from an array of numbers
 * 
 * @param {number[]} values - Array of numeric values
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} The percentile value
 * 
 * @example
 * const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
 * calculatePercentile(values, 50); // Returns 55 (median)
 * calculatePercentile(values, 90); // Returns 91
 * 
 * **Validates: Requirements 6.4**
 */
function calculatePercentile(values, percentile) {
    if (!values || !Array.isArray(values) || values.length === 0) {
        return 0;
    }
    
    if (percentile < 0 || percentile > 100) {
        throw new Error('Percentile must be between 0 and 100');
    }
    
    // Sort values in ascending order
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    
    // Handle edge cases
    if (percentile === 0) return sorted[0];
    if (percentile === 100) return sorted[n - 1];
    
    // Calculate the index using linear interpolation
    const index = (percentile / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const fraction = index - lower;
    
    // Interpolate between adjacent values
    if (lower === upper) {
        return sorted[lower];
    }
    
    return sorted[lower] + fraction * (sorted[upper] - sorted[lower]);
}

/**
 * Calculates multiple percentiles from simulation results
 * 
 * @param {Array<{total: number}>} results - Simulation results with 'total' property
 * @param {number[]} [percentiles=[5, 50, 95]] - Percentiles to calculate
 * @returns {Object} Object with percentile values
 * 
 * @example
 * const results = [{total: 1000}, {total: 2000}, ...];
 * calculatePercentiles(results);
 * // Returns { p5: 1200, p50: 5000, p95: 15000 }
 * 
 * **Validates: Requirements 6.4**
 */
function calculatePercentiles(results, percentiles = [5, 50, 95]) {
    if (!results || !Array.isArray(results) || results.length === 0) {
        return {};
    }
    
    const values = results.map(r => r.total || 0);
    const result = {};
    
    for (const p of percentiles) {
        result[`p${p}`] = calculatePercentile(values, p);
    }
    
    return result;
}

/**
 * Calculates confidence interval from simulation results
 * 
 * @param {Array<{total: number}>} results - Simulation results
 * @param {number} [confidenceLevel=90] - Confidence level (e.g., 90 for 90%)
 * @returns {Object} Confidence interval with lower, median, upper bounds
 * 
 * @example
 * const ci = calculateConfidenceInterval(results, 90);
 * // Returns { lower: 1200, median: 5000, upper: 15000, level: 90 }
 * 
 * **Validates: Requirements 6.4**
 */
function calculateConfidenceInterval(results, confidenceLevel = 90) {
    if (!results || !Array.isArray(results) || results.length === 0) {
        return { lower: 0, median: 0, upper: 0, level: confidenceLevel };
    }
    
    const values = results.map(r => r.total || 0);
    const lowerPercentile = (100 - confidenceLevel) / 2;
    const upperPercentile = 100 - lowerPercentile;
    
    return {
        lower: calculatePercentile(values, lowerPercentile),
        median: calculatePercentile(values, 50),
        upper: calculatePercentile(values, upperPercentile),
        level: confidenceLevel
    };
}

/**
 * Formats a number as currency string
 * 
 * @param {number} value - Value to format
 * @param {string} [currency='USD'] - Currency code
 * @param {string} [locale='en-US'] - Locale for formatting
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    if (typeof value !== 'number' || isNaN(value)) {
        return '-';
    }
    
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    } catch (e) {
        return `${currency} ${value.toLocaleString()}`;
    }
}

/**
 * Formats a percentage value
 * 
 * @param {number} value - Value to format (0-100 or 0-1)
 * @param {boolean} [isDecimal=false] - If true, value is 0-1 scale
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, isDecimal = false) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '-';
    }
    
    const pct = isDecimal ? value * 100 : value;
    return `${pct.toFixed(1)}%`;
}

/**
 * Generates the executive summary section of the report
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {Object} options - Report options
 * @returns {ReportSection} Executive summary section
 */
function generateExecutiveSummary(scenario, results, options = {}) {
    const currency = options.currency || 'USD';
    const lang = options.language || 'en';
    
    const labels = getReportLabels(lang);
    
    let summaryText = '';
    
    // Risk level assessment
    const riskLevel = assessRiskLevel(results.aal, results.var90);
    
    summaryText += `<div class="summary-highlight ${riskLevel.class}">`;
    summaryText += `<p class="risk-level">${labels.riskLevel}: <strong>${riskLevel.label}</strong></p>`;
    summaryText += `</div>`;
    
    // Key metrics
    summaryText += `<div class="key-metrics">`;
    summaryText += `<div class="metric"><span class="label">${labels.aal}:</span> <span class="value">${formatCurrency(results.aal, currency)}</span></div>`;
    summaryText += `<div class="metric"><span class="label">${labels.var90}:</span> <span class="value">${formatCurrency(results.var90, currency)}</span></div>`;
    summaryText += `<div class="metric"><span class="label">${labels.var95}:</span> <span class="value">${formatCurrency(results.var95, currency)}</span></div>`;
    summaryText += `</div>`;
    
    // ROSI if available
    if (results.rosi !== undefined && results.rosi !== null) {
        summaryText += `<div class="rosi-summary">`;
        summaryText += `<p>${labels.rosiSummary}: <strong>${formatPercentage(results.rosi)}</strong></p>`;
        if (results.riskReduction) {
            summaryText += `<p>${labels.riskReduction}: ${formatCurrency(results.riskReduction, currency)}</p>`;
        }
        summaryText += `</div>`;
    }
    
    return {
        id: 'executive-summary',
        title: labels.executiveSummary,
        content: summaryText
    };
}

/**
 * Assesses risk level based on AAL and VaR values
 * 
 * @param {number} aal - Average Annual Loss
 * @param {number} var90 - Value at Risk 90%
 * @returns {Object} Risk level assessment with label and CSS class
 */
function assessRiskLevel(aal, var90) {
    // Risk thresholds (can be customized)
    const ratio = var90 / (aal || 1);
    
    if (aal > 1000000 || var90 > 5000000) {
        return { level: 'critical', label: 'Critical', class: 'risk-critical' };
    } else if (aal > 500000 || var90 > 2000000) {
        return { level: 'high', label: 'High', class: 'risk-high' };
    } else if (aal > 100000 || var90 > 500000) {
        return { level: 'medium', label: 'Medium', class: 'risk-medium' };
    } else {
        return { level: 'low', label: 'Low', class: 'risk-low' };
    }
}

/**
 * Gets localized report labels
 * 
 * @param {string} lang - Language code
 * @returns {Object} Localized labels
 */
function getReportLabels(lang = 'en') {
    const labels = {
        en: {
            reportTitle: 'FAIR Risk Analysis Report',
            executiveSummary: 'Executive Summary',
            methodology: 'Methodology',
            inputs: 'Input Parameters',
            results: 'Analysis Results',
            charts: 'Visualizations',
            sensitivity: 'Sensitivity Analysis',
            recommendations: 'Recommendations',
            riskLevel: 'Risk Level',
            aal: 'Average Annual Loss (AAL)',
            var90: 'Value at Risk (90%)',
            var95: 'Value at Risk (95%)',
            minLoss: 'Minimum Loss',
            maxLoss: 'Maximum Loss',
            median: 'Median Loss',
            rosiSummary: 'Return on Security Investment',
            riskReduction: 'Risk Reduction',
            confidenceInterval: 'Confidence Interval',
            percentile: 'Percentile',
            generatedAt: 'Generated at',
            scenarioName: 'Scenario',
            simulationRuns: 'Simulation Runs',
            tef: 'Threat Event Frequency',
            vulnerability: 'Vulnerability',
            primaryLoss: 'Primary Loss',
            secondaryLoss: 'Secondary Loss',
            controlCost: 'Control Cost',
            controlEffectiveness: 'Control Effectiveness',
            lossExceedanceCurve: 'Loss Exceedance Curve',
            tornadoChart: 'Sensitivity Tornado Chart',
            topRiskDrivers: 'Top Risk Drivers',
            investmentRecommendation: 'Investment Recommendation'
        },
        'zh-TW': {
            reportTitle: 'FAIR 風險分析報告',
            executiveSummary: '執行摘要',
            methodology: '方法論',
            inputs: '輸入參數',
            results: '分析結果',
            charts: '視覺化圖表',
            sensitivity: '敏感度分析',
            recommendations: '建議',
            riskLevel: '風險等級',
            aal: '年均損失 (AAL)',
            var90: '風險值 (90%)',
            var95: '風險值 (95%)',
            minLoss: '最小損失',
            maxLoss: '最大損失',
            median: '中位數損失',
            rosiSummary: '資安投資報酬率',
            riskReduction: '風險降低',
            confidenceInterval: '信賴區間',
            percentile: '百分位數',
            generatedAt: '產生時間',
            scenarioName: '情境',
            simulationRuns: '模擬次數',
            tef: '威脅事件頻率',
            vulnerability: '脆弱性',
            primaryLoss: '主要損失',
            secondaryLoss: '次要損失',
            controlCost: '控制成本',
            controlEffectiveness: '控制有效性',
            lossExceedanceCurve: '損失超越曲線',
            tornadoChart: '敏感度龍捲風圖',
            topRiskDrivers: '主要風險驅動因子',
            investmentRecommendation: '投資建議'
        },
        ja: {
            reportTitle: 'FAIRリスク分析レポート',
            executiveSummary: 'エグゼクティブサマリー',
            methodology: '方法論',
            inputs: '入力パラメータ',
            results: '分析結果',
            charts: '可視化',
            sensitivity: '感度分析',
            recommendations: '推奨事項',
            riskLevel: 'リスクレベル',
            aal: '年間平均損失 (AAL)',
            var90: 'バリューアットリスク (90%)',
            var95: 'バリューアットリスク (95%)',
            minLoss: '最小損失',
            maxLoss: '最大損失',
            median: '中央値損失',
            rosiSummary: 'セキュリティ投資収益率',
            riskReduction: 'リスク削減',
            confidenceInterval: '信頼区間',
            percentile: 'パーセンタイル',
            generatedAt: '生成日時',
            scenarioName: 'シナリオ',
            simulationRuns: 'シミュレーション回数',
            tef: '脅威イベント頻度',
            vulnerability: '脆弱性',
            primaryLoss: '一次損失',
            secondaryLoss: '二次損失',
            controlCost: 'コントロールコスト',
            controlEffectiveness: 'コントロール有効性',
            lossExceedanceCurve: '損失超過曲線',
            tornadoChart: '感度トルネードチャート',
            topRiskDrivers: '主要リスクドライバー',
            investmentRecommendation: '投資推奨'
        }
    };
    
    return labels[lang] || labels.en;
}

/**
 * Generates the methodology section of the report
 * 
 * @param {Object} options - Report options
 * @returns {ReportSection} Methodology section
 */
function generateMethodologySection(options = {}) {
    const lang = options.language || 'en';
    const labels = getReportLabels(lang);
    const runs = options.simulationRuns || 10000;
    
    const methodologyContent = {
        en: `
            <p>This analysis uses the <strong>Factor Analysis of Information Risk (FAIR)</strong> methodology, 
            an international standard for quantifying information risk in financial terms.</p>
            <h4>Key Components:</h4>
            <ul>
                <li><strong>Loss Event Frequency (LEF)</strong> = Threat Event Frequency × Vulnerability</li>
                <li><strong>Loss Magnitude (LM)</strong> = Primary Loss + Secondary Loss</li>
                <li><strong>Risk</strong> = LEF × LM</li>
            </ul>
            <h4>Monte Carlo Simulation:</h4>
            <p>This analysis performed <strong>${runs.toLocaleString()}</strong> Monte Carlo simulations using 
            Beta-PERT distributions to model uncertainty in input parameters.</p>
        `,
        'zh-TW': `
            <p>本分析使用 <strong>資訊風險因子分析 (FAIR)</strong> 方法論，
            這是一個將資訊風險量化為財務術語的國際標準。</p>
            <h4>關鍵組成：</h4>
            <ul>
                <li><strong>損失事件頻率 (LEF)</strong> = 威脅事件頻率 × 脆弱性</li>
                <li><strong>損失幅度 (LM)</strong> = 主要損失 + 次要損失</li>
                <li><strong>風險</strong> = LEF × LM</li>
            </ul>
            <h4>蒙地卡羅模擬：</h4>
            <p>本分析執行了 <strong>${runs.toLocaleString()}</strong> 次蒙地卡羅模擬，
            使用 Beta-PERT 分布來建模輸入參數的不確定性。</p>
        `,
        ja: `
            <p>この分析は、情報リスクを財務用語で定量化する国際標準である
            <strong>情報リスク因子分析 (FAIR)</strong> 方法論を使用しています。</p>
            <h4>主要コンポーネント：</h4>
            <ul>
                <li><strong>損失イベント頻度 (LEF)</strong> = 脅威イベント頻度 × 脆弱性</li>
                <li><strong>損失規模 (LM)</strong> = 一次損失 + 二次損失</li>
                <li><strong>リスク</strong> = LEF × LM</li>
            </ul>
            <h4>モンテカルロシミュレーション：</h4>
            <p>この分析では、入力パラメータの不確実性をモデル化するために
            Beta-PERT分布を使用して <strong>${runs.toLocaleString()}</strong> 回の
            モンテカルロシミュレーションを実行しました。</p>
        `
    };
    
    return {
        id: 'methodology',
        title: labels.methodology,
        content: methodologyContent[lang] || methodologyContent.en
    };
}

/**
 * Generates the inputs section of the report
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {Object} options - Report options
 * @returns {ReportSection} Inputs section
 */
function generateInputsSection(scenario, options = {}) {
    const currency = options.currency || 'USD';
    const lang = options.language || 'en';
    const labels = getReportLabels(lang);
    
    let content = '<table class="inputs-table">';
    content += '<thead><tr><th>Parameter</th><th>Min</th><th>Most Likely</th><th>Max</th></tr></thead>';
    content += '<tbody>';
    
    // TEF
    if (scenario.lef) {
        if (scenario.lef.tef) {
            content += `<tr><td>${labels.tef}</td>`;
            content += `<td>${scenario.lef.tef.min}</td>`;
            content += `<td>${scenario.lef.tef.mostLikely}</td>`;
            content += `<td>${scenario.lef.tef.max}</td></tr>`;
        } else if (scenario.lef.contactFrequency && scenario.lef.probabilityOfAction) {
            content += `<tr><td>Contact Frequency</td>`;
            content += `<td>${scenario.lef.contactFrequency.min}</td>`;
            content += `<td>${scenario.lef.contactFrequency.mostLikely}</td>`;
            content += `<td>${scenario.lef.contactFrequency.max}</td></tr>`;
            content += `<tr><td>Probability of Action (%)</td>`;
            content += `<td>${scenario.lef.probabilityOfAction.min}</td>`;
            content += `<td>${scenario.lef.probabilityOfAction.mostLikely}</td>`;
            content += `<td>${scenario.lef.probabilityOfAction.max}</td></tr>`;
        }
        
        // Vulnerability
        if (scenario.lef.vulnerability) {
            content += `<tr><td>${labels.vulnerability} (%)</td>`;
            content += `<td>${scenario.lef.vulnerability.min}</td>`;
            content += `<td>${scenario.lef.vulnerability.mostLikely}</td>`;
            content += `<td>${scenario.lef.vulnerability.max}</td></tr>`;
        }
    }
    
    // Loss Magnitude
    if (scenario.lm) {
        if (scenario.lm.primaryLoss) {
            content += `<tr><td>${labels.primaryLoss}</td>`;
            content += `<td>${formatCurrency(scenario.lm.primaryLoss.min, currency)}</td>`;
            content += `<td>${formatCurrency(scenario.lm.primaryLoss.mostLikely, currency)}</td>`;
            content += `<td>${formatCurrency(scenario.lm.primaryLoss.max, currency)}</td></tr>`;
        }
        
        if (scenario.lm.secondaryLoss && scenario.lm.secondaryLoss.magnitude) {
            content += `<tr><td>${labels.secondaryLoss}</td>`;
            content += `<td>${formatCurrency(scenario.lm.secondaryLoss.magnitude.min, currency)}</td>`;
            content += `<td>${formatCurrency(scenario.lm.secondaryLoss.magnitude.mostLikely, currency)}</td>`;
            content += `<td>${formatCurrency(scenario.lm.secondaryLoss.magnitude.max, currency)}</td></tr>`;
            content += `<tr><td>Secondary Loss Probability (%)</td>`;
            content += `<td colspan="3">${scenario.lm.secondaryLoss.probability}%</td></tr>`;
        }
    }
    
    // Control
    if (scenario.control && scenario.control.annualCost > 0) {
        content += `<tr><td>${labels.controlCost}</td>`;
        content += `<td colspan="3">${formatCurrency(scenario.control.annualCost, currency)}</td></tr>`;
        content += `<tr><td>${labels.controlEffectiveness}</td>`;
        content += `<td colspan="3">${scenario.control.effectiveness}%</td></tr>`;
    }
    
    content += '</tbody></table>';
    
    return {
        id: 'inputs',
        title: labels.inputs,
        content: content
    };
}

/**
 * Generates the results section of the report
 * 
 * @param {RiskOutput} results - Simulation results
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results for percentile calculation
 * @param {Object} options - Report options
 * @returns {ReportSection} Results section
 */
function generateResultsSection(results, rawResults, options = {}) {
    const currency = options.currency || 'USD';
    const lang = options.language || 'en';
    const labels = getReportLabels(lang);
    
    let content = '<div class="results-grid">';
    
    // Main metrics
    content += '<div class="results-card primary">';
    content += `<h4>${labels.aal}</h4>`;
    content += `<p class="value">${formatCurrency(results.aal, currency)}</p>`;
    content += '</div>';
    
    content += '<div class="results-card danger">';
    content += `<h4>${labels.var90}</h4>`;
    content += `<p class="value">${formatCurrency(results.var90, currency)}</p>`;
    content += '</div>';
    
    content += '<div class="results-card warning">';
    content += `<h4>${labels.var95}</h4>`;
    content += `<p class="value">${formatCurrency(results.var95, currency)}</p>`;
    content += '</div>';
    
    content += '<div class="results-card">';
    content += `<h4>${labels.median}</h4>`;
    content += `<p class="value">${formatCurrency(results.median, currency)}</p>`;
    content += '</div>';
    
    content += '</div>';
    
    // Percentiles and confidence interval
    if (rawResults && rawResults.length > 0) {
        const percentiles = calculatePercentiles(rawResults, [5, 25, 50, 75, 95]);
        const ci = calculateConfidenceInterval(rawResults, 90);
        
        content += `<h4>${labels.confidenceInterval} (90%)</h4>`;
        content += '<table class="percentile-table">';
        content += '<thead><tr><th>Percentile</th><th>Value</th></tr></thead>';
        content += '<tbody>';
        content += `<tr><td>5th (Lower Bound)</td><td>${formatCurrency(percentiles.p5, currency)}</td></tr>`;
        content += `<tr><td>25th</td><td>${formatCurrency(percentiles.p25, currency)}</td></tr>`;
        content += `<tr><td>50th (Median)</td><td>${formatCurrency(percentiles.p50, currency)}</td></tr>`;
        content += `<tr><td>75th</td><td>${formatCurrency(percentiles.p75, currency)}</td></tr>`;
        content += `<tr><td>95th (Upper Bound)</td><td>${formatCurrency(percentiles.p95, currency)}</td></tr>`;
        content += '</tbody></table>';
    }
    
    // ROSI section if available
    if (results.rosi !== undefined && results.rosi !== null) {
        content += '<div class="rosi-results">';
        content += `<h4>${labels.rosiSummary}</h4>`;
        content += '<div class="results-grid">';
        
        content += '<div class="results-card success">';
        content += '<h4>ROSI</h4>';
        content += `<p class="value">${formatPercentage(results.rosi)}</p>`;
        content += '</div>';
        
        content += '<div class="results-card">';
        content += `<h4>${labels.riskReduction}</h4>`;
        content += `<p class="value">${formatCurrency(results.riskReduction, currency)}</p>`;
        content += '</div>';
        
        if (results.aalAfterControl !== undefined) {
            content += '<div class="results-card">';
            content += '<h4>AAL After Control</h4>';
            content += `<p class="value">${formatCurrency(results.aalAfterControl, currency)}</p>`;
            content += '</div>';
        }
        
        content += '</div></div>';
    }
    
    return {
        id: 'results',
        title: labels.results,
        content: content
    };
}

/**
 * Generates investment recommendation based on ROSI
 * 
 * @param {RiskOutput} results - Simulation results with ROSI
 * @param {Object} options - Report options
 * @returns {Object} Recommendation with text and level
 * 
 * **Validates: Requirements 6.5**
 */
function generateInvestmentRecommendation(results, options = {}) {
    const lang = options.language || 'en';
    
    if (results.rosi === undefined || results.rosi === null) {
        return null;
    }
    
    const rosi = results.rosi;
    let recommendation = { level: '', text: '', icon: '' };
    
    const recommendations = {
        en: {
            stronglyRecommend: {
                level: 'strongly-recommend',
                text: 'Strongly Recommended: The control investment shows excellent return with ROSI of ' + formatPercentage(rosi) + '. The risk reduction significantly outweighs the cost.',
                icon: '✅'
            },
            recommend: {
                level: 'recommend',
                text: 'Recommended: The control investment shows positive return with ROSI of ' + formatPercentage(rosi) + '. Consider implementing this control.',
                icon: '👍'
            },
            marginal: {
                level: 'marginal',
                text: 'Marginal: The control investment shows minimal return with ROSI of ' + formatPercentage(rosi) + '. Consider alternative controls or negotiate better pricing.',
                icon: '⚠️'
            },
            notRecommend: {
                level: 'not-recommend',
                text: 'Not Recommended: The control investment shows negative return with ROSI of ' + formatPercentage(rosi) + '. The cost exceeds the risk reduction benefit.',
                icon: '❌'
            }
        },
        'zh-TW': {
            stronglyRecommend: {
                level: 'strongly-recommend',
                text: '強烈建議：控制投資顯示優異報酬，ROSI 為 ' + formatPercentage(rosi) + '。風險降低顯著超過成本。',
                icon: '✅'
            },
            recommend: {
                level: 'recommend',
                text: '建議：控制投資顯示正向報酬，ROSI 為 ' + formatPercentage(rosi) + '。建議實施此控制措施。',
                icon: '👍'
            },
            marginal: {
                level: 'marginal',
                text: '邊際效益：控制投資顯示最小報酬，ROSI 為 ' + formatPercentage(rosi) + '。考慮替代控制措施或協商更好的價格。',
                icon: '⚠️'
            },
            notRecommend: {
                level: 'not-recommend',
                text: '不建議：控制投資顯示負報酬，ROSI 為 ' + formatPercentage(rosi) + '。成本超過風險降低效益。',
                icon: '❌'
            }
        },
        ja: {
            stronglyRecommend: {
                level: 'strongly-recommend',
                text: '強く推奨：コントロール投資は優れたリターンを示し、ROSIは ' + formatPercentage(rosi) + ' です。リスク削減がコストを大幅に上回っています。',
                icon: '✅'
            },
            recommend: {
                level: 'recommend',
                text: '推奨：コントロール投資は正のリターンを示し、ROSIは ' + formatPercentage(rosi) + ' です。このコントロールの実装を検討してください。',
                icon: '👍'
            },
            marginal: {
                level: 'marginal',
                text: '限界的：コントロール投資は最小限のリターンを示し、ROSIは ' + formatPercentage(rosi) + ' です。代替コントロールまたはより良い価格交渉を検討してください。',
                icon: '⚠️'
            },
            notRecommend: {
                level: 'not-recommend',
                text: '非推奨：コントロール投資は負のリターンを示し、ROSIは ' + formatPercentage(rosi) + ' です。コストがリスク削減効果を上回っています。',
                icon: '❌'
            }
        }
    };
    
    const langRecs = recommendations[lang] || recommendations.en;
    
    if (rosi >= 100) {
        recommendation = langRecs.stronglyRecommend;
    } else if (rosi >= 25) {
        recommendation = langRecs.recommend;
    } else if (rosi >= 0) {
        recommendation = langRecs.marginal;
    } else {
        recommendation = langRecs.notRecommend;
    }
    
    return recommendation;
}

/**
 * Generates the recommendations section of the report
 * 
 * @param {RiskOutput} results - Simulation results
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @param {Object} options - Report options
 * @returns {ReportSection} Recommendations section
 */
function generateRecommendationsSection(results, sensitivityResults, options = {}) {
    const lang = options.language || 'en';
    const labels = getReportLabels(lang);
    
    let content = '<div class="recommendations">';
    
    // Investment recommendation if ROSI is available
    const investmentRec = generateInvestmentRecommendation(results, options);
    if (investmentRec) {
        content += `<div class="recommendation-card ${investmentRec.level}">`;
        content += `<span class="icon">${investmentRec.icon}</span>`;
        content += `<p>${investmentRec.text}</p>`;
        content += '</div>';
    }
    
    // Top risk drivers from sensitivity analysis
    if (sensitivityResults && sensitivityResults.length > 0) {
        const topParams = rankInfluentialParameters(sensitivityResults, 3);
        
        content += `<div class="risk-drivers">`;
        content += `<h4>${labels.topRiskDrivers}</h4>`;
        content += '<ol>';
        
        for (const param of topParams) {
            content += `<li><strong>${param.parameter}</strong>: ${param.impactPercentage.toFixed(1)}% impact on AAL</li>`;
        }
        
        content += '</ol></div>';
    }
    
    content += '</div>';
    
    return {
        id: 'recommendations',
        title: labels.recommendations,
        content: content
    };
}

/**
 * Generates the complete HTML report structure
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {Object} options - Report configuration options
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {ReportData} Complete report data
 * 
 * **Validates: Requirements 6.1, 6.2**
 */
function generateReportData(scenario, results, options = {}, rawResults = null, sensitivityResults = null) {
    const config = {
        title: options.title || 'FAIR Risk Analysis Report',
        includeExecutiveSummary: options.includeExecutiveSummary !== false,
        includeMethodology: options.includeMethodology !== false,
        includeInputs: options.includeInputs !== false,
        includeResults: options.includeResults !== false,
        includeCharts: options.includeCharts !== false,
        includeSensitivity: options.includeSensitivity === true,
        includeRecommendations: options.includeRecommendations !== false,
        language: options.language || 'en',
        currency: options.currency || 'USD',
        simulationRuns: scenario.simulationConfig?.runs || 10000
    };
    
    const labels = getReportLabels(config.language);
    const sections = [];
    
    // Executive Summary
    if (config.includeExecutiveSummary) {
        sections.push(generateExecutiveSummary(scenario, results, config));
    }
    
    // Methodology
    if (config.includeMethodology) {
        sections.push(generateMethodologySection(config));
    }
    
    // Inputs
    if (config.includeInputs) {
        sections.push(generateInputsSection(scenario, config));
    }
    
    // Results
    if (config.includeResults) {
        sections.push(generateResultsSection(results, rawResults, config));
    }
    
    // Recommendations
    if (config.includeRecommendations) {
        sections.push(generateRecommendationsSection(results, sensitivityResults, config));
    }
    
    return {
        title: config.title,
        generatedAt: new Date().toISOString(),
        scenarioName: scenario.name || 'Unnamed Scenario',
        sections: sections,
        metadata: {
            language: config.language,
            currency: config.currency,
            simulationRuns: config.simulationRuns,
            includeCharts: config.includeCharts,
            includeSensitivity: config.includeSensitivity
        },
        labels: labels
    };
}


/**
 * Generates the complete HTML report from report data
 * 
 * @param {ReportData} reportData - Report data from generateReportData
 * @returns {string} Complete HTML document string
 * 
 * **Validates: Requirements 6.1, 6.2**
 */
function generateReportHTML(reportData) {
    if (!reportData) {
        return '';
    }
    
    const { title, generatedAt, scenarioName, sections, metadata, labels } = reportData;
    
    // Build HTML document
    let html = `<!DOCTYPE html>
<html lang="${metadata.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .report-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 40px;
        }
        .report-header {
            text-align: center;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .report-header h1 {
            color: #1e3a5f;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .report-header .meta {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #1e3a5f;
            font-size: 20px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .section h4 {
            color: #333;
            font-size: 16px;
            margin: 15px 0 10px 0;
        }
        .summary-highlight {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .risk-critical { background: #fee2e2; border-left: 4px solid #ef4444; }
        .risk-high { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .risk-medium { background: #fef9c3; border-left: 4px solid #eab308; }
        .risk-low { background: #dcfce7; border-left: 4px solid #22c55e; }
        .risk-level { font-size: 18px; }
        .key-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .metric {
            background: #f8fafc;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .metric .label { color: #64748b; font-size: 13px; }
        .metric .value { font-size: 18px; font-weight: 600; color: #1e3a5f; }
        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .results-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .results-card h4 { font-size: 13px; color: #64748b; margin-bottom: 5px; }
        .results-card .value { font-size: 20px; font-weight: 700; color: #1e3a5f; }
        .results-card.primary { border-left: 4px solid #3B82F6; }
        .results-card.danger { border-left: 4px solid #ef4444; }
        .results-card.warning { border-left: 4px solid #f59e0b; }
        .results-card.success { border-left: 4px solid #22c55e; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background: #f8fafc;
            font-weight: 600;
            color: #475569;
        }
        .inputs-table td:first-child { font-weight: 500; }
        .percentile-table { max-width: 400px; }
        .rosi-results { margin-top: 20px; }
        .recommendations { margin-top: 15px; }
        .recommendation-card {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        .recommendation-card .icon { font-size: 24px; }
        .recommendation-card p { margin: 0; }
        .recommendation-card.strongly-recommend { background: #dcfce7; border: 1px solid #22c55e; }
        .recommendation-card.recommend { background: #dbeafe; border: 1px solid #3B82F6; }
        .recommendation-card.marginal { background: #fef9c3; border: 1px solid #eab308; }
        .recommendation-card.not-recommend { background: #fee2e2; border: 1px solid #ef4444; }
        .risk-drivers { margin-top: 15px; }
        .risk-drivers ol { padding-left: 20px; }
        .risk-drivers li { margin: 8px 0; }
        ul { padding-left: 20px; margin: 10px 0; }
        li { margin: 5px 0; }
        .chart-placeholder {
            background: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: #64748b;
            margin: 15px 0;
        }
        .report-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        @media print {
            body { background: white; padding: 0; }
            .report-container { box-shadow: none; padding: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="report-header">
            <h1>${title}</h1>
            <div class="meta">
                <p>${labels.scenarioName}: <strong>${scenarioName}</strong></p>
                <p>${labels.generatedAt}: ${new Date(generatedAt).toLocaleString()}</p>
                <p>${labels.simulationRuns}: ${metadata.simulationRuns.toLocaleString()}</p>
            </div>
        </div>
`;
    
    // Add sections
    for (const section of sections) {
        html += `
        <div class="section" id="${section.id}">
            <h2>${section.title}</h2>
            ${section.content}
        </div>
`;
    }
    
    // Add chart placeholders if charts are enabled
    if (metadata.includeCharts) {
        html += `
        <div class="section" id="charts">
            <h2>${labels.charts || 'Visualizations'}</h2>
            <div class="chart-placeholder" id="loss-exceedance-chart">
                <p>${labels.lossExceedanceCurve || 'Loss Exceedance Curve'}</p>
                <p><em>Chart will be rendered when viewing in browser</em></p>
            </div>
        </div>
`;
    }
    
    // Add sensitivity chart placeholder if enabled
    if (metadata.includeSensitivity) {
        html += `
        <div class="section" id="sensitivity">
            <h2>${labels.sensitivity || 'Sensitivity Analysis'}</h2>
            <div class="chart-placeholder" id="tornado-chart">
                <p>${labels.tornadoChart || 'Sensitivity Tornado Chart'}</p>
                <p><em>Chart will be rendered when viewing in browser</em></p>
            </div>
        </div>
`;
    }
    
    // Footer
    html += `
        <div class="report-footer">
            <p>Generated by FAIR Risk Analysis Tool</p>
            <p>Based on OpenFAIR™ methodology. OpenFAIR™ is a trademark of The Open Group.</p>
        </div>
    </div>
</body>
</html>`;
    
    return html;
}

/**
 * Generates a complete HTML report from scenario and results
 * 
 * This is a convenience function that combines generateReportData and generateReportHTML.
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {ReportConfig} [options] - Report configuration options
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results for percentile calculation
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {string} Complete HTML report string
 * 
 * @example
 * const html = generateReport(scenario, results, { language: 'zh-TW', currency: 'TWD' });
 * 
 * **Validates: Requirements 6.1, 6.2**
 */
function generateReport(scenario, results, options = {}, rawResults = null, sensitivityResults = null) {
    const reportData = generateReportData(scenario, results, options, rawResults, sensitivityResults);
    return generateReportHTML(reportData);
}

/**
 * Opens the report in a new browser window for printing or saving
 * 
 * @param {string} htmlContent - HTML report content
 * @param {string} [windowTitle] - Title for the new window
 * @returns {Window|null} Reference to the new window, or null if blocked
 */
function openReportInNewWindow(htmlContent, windowTitle = 'FAIR Risk Analysis Report') {
    if (typeof window === 'undefined') {
        return null;
    }
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.document.title = windowTitle;
    }
    return newWindow;
}

// Add report generator functions to window.FAIRCore
if (typeof window !== 'undefined' && window.FAIRCore) {
    // Percentile calculation functions
    window.FAIRCore.calculatePercentile = calculatePercentile;
    window.FAIRCore.calculatePercentiles = calculatePercentiles;
    window.FAIRCore.calculateConfidenceInterval = calculateConfidenceInterval;
    
    // Formatting functions
    window.FAIRCore.formatCurrency = formatCurrency;
    window.FAIRCore.formatPercentage = formatPercentage;
    
    // Report generation functions
    window.FAIRCore.getReportLabels = getReportLabels;
    window.FAIRCore.assessRiskLevel = assessRiskLevel;
    window.FAIRCore.generateExecutiveSummary = generateExecutiveSummary;
    window.FAIRCore.generateMethodologySection = generateMethodologySection;
    window.FAIRCore.generateInputsSection = generateInputsSection;
    window.FAIRCore.generateResultsSection = generateResultsSection;
    window.FAIRCore.generateInvestmentRecommendation = generateInvestmentRecommendation;
    window.FAIRCore.generateRecommendationsSection = generateRecommendationsSection;
    window.FAIRCore.generateReportData = generateReportData;
    window.FAIRCore.generateReportHTML = generateReportHTML;
    window.FAIRCore.generateReport = generateReport;
    window.FAIRCore.openReportInNewWindow = openReportInNewWindow;
}

// Add to CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports.calculatePercentile = calculatePercentile;
    module.exports.calculatePercentiles = calculatePercentiles;
    module.exports.calculateConfidenceInterval = calculateConfidenceInterval;
    module.exports.formatCurrency = formatCurrency;
    module.exports.formatPercentage = formatPercentage;
    module.exports.getReportLabels = getReportLabels;
    module.exports.assessRiskLevel = assessRiskLevel;
    module.exports.generateExecutiveSummary = generateExecutiveSummary;
    module.exports.generateMethodologySection = generateMethodologySection;
    module.exports.generateInputsSection = generateInputsSection;
    module.exports.generateResultsSection = generateResultsSection;
    module.exports.generateInvestmentRecommendation = generateInvestmentRecommendation;
    module.exports.generateRecommendationsSection = generateRecommendationsSection;
    module.exports.generateReportData = generateReportData;
    module.exports.generateReportHTML = generateReportHTML;
    module.exports.generateReport = generateReport;
    module.exports.openReportInNewWindow = openReportInNewWindow;
}


// ============================================================================
// Report Chart Generation Functions
// ============================================================================

/**
 * Generates loss exceedance curve data for Chart.js
 * 
 * The loss exceedance curve shows the probability of exceeding various loss levels.
 * X-axis: Loss amount
 * Y-axis: Probability of exceeding that loss (0-100%)
 * 
 * @param {Array<{total: number}>} results - Simulation results with 'total' property
 * @param {number} [numPoints=20] - Number of points on the curve
 * @returns {Object} Chart.js compatible data object
 * 
 * @example
 * const chartData = generateLossExceedanceCurveData(results);
 * new Chart(ctx, { type: 'line', data: chartData, options: {...} });
 * 
 * **Validates: Requirements 6.3**
 */
function generateLossExceedanceCurveData(results, numPoints = 20) {
    if (!results || !Array.isArray(results) || results.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Loss Exceedance Probability',
                data: [],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };
    }
    
    const values = results.map(r => r.total || 0).sort((a, b) => a - b);
    const n = values.length;
    
    // Generate evenly spaced loss levels
    const minLoss = values[0];
    const maxLoss = values[n - 1];
    const step = (maxLoss - minLoss) / (numPoints - 1);
    
    const labels = [];
    const data = [];
    
    for (let i = 0; i < numPoints; i++) {
        const lossLevel = minLoss + (step * i);
        labels.push(lossLevel);
        
        // Calculate probability of exceeding this loss level
        const exceedCount = values.filter(v => v > lossLevel).length;
        const exceedProb = (exceedCount / n) * 100;
        data.push(exceedProb);
    }
    
    return {
        labels: labels,
        datasets: [{
            label: 'Loss Exceedance Probability (%)',
            data: data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
        }]
    };
}

/**
 * Generates tornado chart data for sensitivity analysis
 * 
 * The tornado chart shows the impact of each parameter on AAL when varied by ±20%.
 * 
 * @param {SensitivityResult[]} sensitivityResults - Sensitivity analysis results
 * @param {number} [baselineAAL] - Baseline AAL for reference line
 * @returns {Object} Chart.js compatible data object for horizontal bar chart
 * 
 * @example
 * const chartData = generateTornadoChartData(sensitivityResults, baselineAAL);
 * new Chart(ctx, { type: 'bar', data: chartData, options: { indexAxis: 'y' } });
 * 
 * **Validates: Requirements 6.3**
 */
function generateTornadoChartData(sensitivityResults, baselineAAL = 0) {
    if (!sensitivityResults || !Array.isArray(sensitivityResults) || sensitivityResults.length === 0) {
        return {
            labels: [],
            datasets: []
        };
    }
    
    // Sort by absolute impact (descending)
    const sorted = [...sensitivityResults].sort((a, b) => {
        const impactA = Math.abs((a.highAAL || 0) - (a.lowAAL || 0));
        const impactB = Math.abs((b.highAAL || 0) - (b.lowAAL || 0));
        return impactB - impactA;
    });
    
    const labels = sorted.map(r => r.parameter || 'Unknown');
    const lowDeltas = sorted.map(r => (r.lowAAL || 0) - baselineAAL);
    const highDeltas = sorted.map(r => (r.highAAL || 0) - baselineAAL);
    
    return {
        labels: labels,
        datasets: [
            {
                label: '-20% Parameter Change',
                data: lowDeltas,
                backgroundColor: '#22C55E',
                borderColor: '#16A34A',
                borderWidth: 1
            },
            {
                label: '+20% Parameter Change',
                data: highDeltas,
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                borderWidth: 1
            }
        ]
    };
}

/**
 * Generates Chart.js options for loss exceedance curve
 * 
 * @param {Object} options - Chart options
 * @param {string} [options.currency='USD'] - Currency for formatting
 * @param {string} [options.title] - Chart title
 * @returns {Object} Chart.js options object
 */
function getLossExceedanceCurveOptions(options = {}) {
    const currency = options.currency || 'USD';
    const title = options.title || 'Loss Exceedance Curve';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 16, weight: 'bold' }
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const loss = context.label;
                        const prob = context.raw;
                        return `${prob.toFixed(1)}% chance of exceeding ${currency} ${Number(loss).toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: `Loss Amount (${currency})`
                },
                ticks: {
                    callback: function(value) {
                        return currency + ' ' + Number(value).toLocaleString();
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Probability of Exceedance (%)'
                },
                min: 0,
                max: 100
            }
        }
    };
}

/**
 * Generates Chart.js options for tornado chart
 * 
 * @param {Object} options - Chart options
 * @param {string} [options.currency='USD'] - Currency for formatting
 * @param {string} [options.title] - Chart title
 * @returns {Object} Chart.js options object
 */
function getTornadoChartOptions(options = {}) {
    const currency = options.currency || 'USD';
    const title = options.title || 'Sensitivity Analysis - Tornado Chart';
    
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 16, weight: 'bold' }
            },
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const delta = context.raw;
                        const sign = delta >= 0 ? '+' : '';
                        return `${context.dataset.label}: ${sign}${currency} ${Number(delta).toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: `Change in AAL (${currency})`
                },
                ticks: {
                    callback: function(value) {
                        const sign = value >= 0 ? '+' : '';
                        return sign + currency + ' ' + Number(value).toLocaleString();
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Parameter'
                }
            }
        }
    };
}

/**
 * Generates the charts section HTML with embedded Chart.js rendering script
 * 
 * @param {Array<{total: number}>} rawResults - Raw simulation results
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @param {Object} options - Report options
 * @returns {ReportSection} Charts section with embedded scripts
 * 
 * **Validates: Requirements 6.3**
 */
function generateChartsSection(rawResults, sensitivityResults, options = {}) {
    const currency = options.currency || 'USD';
    const lang = options.language || 'en';
    const labels = getReportLabels(lang);
    
    let content = '';
    
    // Loss Exceedance Curve
    if (rawResults && rawResults.length > 0) {
        const lecData = generateLossExceedanceCurveData(rawResults);
        const lecOptions = getLossExceedanceCurveOptions({ currency, title: labels.lossExceedanceCurve });
        
        content += `
        <div class="chart-container" style="height: 300px; margin-bottom: 30px;">
            <canvas id="lossExceedanceChart"></canvas>
        </div>
        <script>
            (function() {
                const ctx = document.getElementById('lossExceedanceChart');
                if (ctx && typeof Chart !== 'undefined') {
                    new Chart(ctx, {
                        type: 'line',
                        data: ${JSON.stringify(lecData)},
                        options: ${JSON.stringify(lecOptions)}
                    });
                }
            })();
        </script>
        `;
    }
    
    // Tornado Chart for Sensitivity Analysis
    if (sensitivityResults && sensitivityResults.length > 0) {
        const baselineAAL = sensitivityResults[0]?.baselineAAL || 0;
        const tornadoData = generateTornadoChartData(sensitivityResults, baselineAAL);
        const tornadoOptions = getTornadoChartOptions({ currency, title: labels.tornadoChart });
        
        content += `
        <div class="chart-container" style="height: ${Math.max(200, sensitivityResults.length * 40)}px; margin-top: 30px;">
            <canvas id="tornadoChart"></canvas>
        </div>
        <script>
            (function() {
                const ctx = document.getElementById('tornadoChart');
                if (ctx && typeof Chart !== 'undefined') {
                    new Chart(ctx, {
                        type: 'bar',
                        data: ${JSON.stringify(tornadoData)},
                        options: ${JSON.stringify(tornadoOptions)}
                    });
                }
            })();
        </script>
        `;
    }
    
    // Add Chart.js CDN if charts are present
    if (content) {
        content = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
        ` + content;
    }
    
    return {
        id: 'charts',
        title: labels.charts || 'Visualizations',
        content: content || '<p>No chart data available.</p>'
    };
}

/**
 * Enhanced report generation that includes charts
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {ReportConfig} [options] - Report configuration options
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results for charts
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {ReportData} Complete report data with charts
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3**
 */
function generateReportDataWithCharts(scenario, results, options = {}, rawResults = null, sensitivityResults = null) {
    const config = {
        title: options.title || 'FAIR Risk Analysis Report',
        includeExecutiveSummary: options.includeExecutiveSummary !== false,
        includeMethodology: options.includeMethodology !== false,
        includeInputs: options.includeInputs !== false,
        includeResults: options.includeResults !== false,
        includeCharts: options.includeCharts !== false,
        includeSensitivity: options.includeSensitivity === true,
        includeRecommendations: options.includeRecommendations !== false,
        language: options.language || 'en',
        currency: options.currency || 'USD',
        simulationRuns: scenario.simulationConfig?.runs || 10000
    };
    
    const labels = getReportLabels(config.language);
    const sections = [];
    
    // Executive Summary
    if (config.includeExecutiveSummary) {
        sections.push(generateExecutiveSummary(scenario, results, config));
    }
    
    // Methodology
    if (config.includeMethodology) {
        sections.push(generateMethodologySection(config));
    }
    
    // Inputs
    if (config.includeInputs) {
        sections.push(generateInputsSection(scenario, config));
    }
    
    // Results
    if (config.includeResults) {
        sections.push(generateResultsSection(results, rawResults, config));
    }
    
    // Charts (with actual Chart.js rendering)
    if (config.includeCharts && (rawResults || sensitivityResults)) {
        sections.push(generateChartsSection(rawResults, sensitivityResults, config));
    }
    
    // Recommendations
    if (config.includeRecommendations) {
        sections.push(generateRecommendationsSection(results, sensitivityResults, config));
    }
    
    return {
        title: config.title,
        generatedAt: new Date().toISOString(),
        scenarioName: scenario.name || 'Unnamed Scenario',
        sections: sections,
        metadata: {
            language: config.language,
            currency: config.currency,
            simulationRuns: config.simulationRuns,
            includeCharts: config.includeCharts,
            includeSensitivity: config.includeSensitivity
        },
        labels: labels
    };
}

/**
 * Generates a complete HTML report with charts from scenario and results
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {ReportConfig} [options] - Report configuration options
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results for charts
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {string} Complete HTML report string with embedded charts
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3**
 */
function generateReportWithCharts(scenario, results, options = {}, rawResults = null, sensitivityResults = null) {
    const reportData = generateReportDataWithCharts(scenario, results, options, rawResults, sensitivityResults);
    return generateReportHTML(reportData);
}

// Add chart generation functions to window.FAIRCore
if (typeof window !== 'undefined' && window.FAIRCore) {
    window.FAIRCore.generateLossExceedanceCurveData = generateLossExceedanceCurveData;
    window.FAIRCore.generateTornadoChartData = generateTornadoChartData;
    window.FAIRCore.getLossExceedanceCurveOptions = getLossExceedanceCurveOptions;
    window.FAIRCore.getTornadoChartOptions = getTornadoChartOptions;
    window.FAIRCore.generateChartsSection = generateChartsSection;
    window.FAIRCore.generateReportDataWithCharts = generateReportDataWithCharts;
    window.FAIRCore.generateReportWithCharts = generateReportWithCharts;
}

// Add to CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports.generateLossExceedanceCurveData = generateLossExceedanceCurveData;
    module.exports.generateTornadoChartData = generateTornadoChartData;
    module.exports.getLossExceedanceCurveOptions = getLossExceedanceCurveOptions;
    module.exports.getTornadoChartOptions = getTornadoChartOptions;
    module.exports.generateChartsSection = generateChartsSection;
    module.exports.generateReportDataWithCharts = generateReportDataWithCharts;
    module.exports.generateReportWithCharts = generateReportWithCharts;
}


// ============================================================================
// PDF Export Functions
// ============================================================================

/**
 * PDF export configuration
 * @typedef {Object} PDFExportConfig
 * @property {string} [filename] - Output filename (without .pdf extension)
 * @property {string} [orientation='portrait'] - Page orientation ('portrait' or 'landscape')
 * @property {string} [format='a4'] - Page format ('a4', 'letter', etc.)
 * @property {number} [margin=10] - Page margin in mm
 * @property {boolean} [includeCharts=true] - Whether to include charts
 * @property {string} [title] - Report title
 */

/**
 * Generates a PDF report from scenario and results using jsPDF
 * 
 * This function creates a PDF document with all report sections including
 * executive summary, methodology, inputs, results, and recommendations.
 * Charts are rendered as images using html2canvas if available.
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {PDFExportConfig} [config] - PDF export configuration
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results for percentiles
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {Promise<Blob>} PDF blob that can be downloaded
 * 
 * @example
 * const pdfBlob = await exportReportToPDF(scenario, results, { filename: 'risk_report' });
 * 
 * **Validates: Requirements 6.1**
 */
async function exportReportToPDF(scenario, results, config = {}, rawResults = null, sensitivityResults = null) {
    // Check if jsPDF is available
    if (typeof window === 'undefined' || typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library is not loaded. Please include jsPDF CDN.');
    }
    
    const { jsPDF } = window.jspdf;
    
    const pdfConfig = {
        filename: config.filename || `FAIR_Report_${new Date().toISOString().slice(0, 10)}`,
        orientation: config.orientation || 'portrait',
        format: config.format || 'a4',
        margin: config.margin || 15,
        title: config.title || 'FAIR Risk Analysis Report',
        currency: config.currency || 'USD',
        language: config.language || 'en'
    };
    
    const labels = getReportLabels(pdfConfig.language);
    
    // Create PDF document
    const doc = new jsPDF({
        orientation: pdfConfig.orientation,
        unit: 'mm',
        format: pdfConfig.format
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = pdfConfig.margin;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;
    
    // Helper function to add new page if needed
    const checkNewPage = (requiredHeight) => {
        if (yPos + requiredHeight > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };
    
    // Helper function to add text with word wrap
    const addWrappedText = (text, fontSize, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.4;
        
        for (const line of lines) {
            checkNewPage(lineHeight);
            doc.text(line, margin, yPos);
            yPos += lineHeight;
        }
        yPos += 2;
    };
    
    // Helper function to add a section header
    const addSectionHeader = (title) => {
        checkNewPage(15);
        yPos += 5;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 95); // Dark blue
        doc.text(title, margin, yPos);
        yPos += 3;
        doc.setDrawColor(59, 130, 246); // Blue line
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
        doc.setTextColor(0, 0, 0); // Reset to black
    };
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text(pdfConfig.title, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Scenario name and date
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${labels.scenarioName}: ${scenario.name || 'Unnamed Scenario'}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`${labels.generatedAt}: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`${labels.simulationRuns}: ${(scenario.simulationConfig?.runs || 10000).toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setTextColor(0, 0, 0);
    
    // Horizontal line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Executive Summary
    addSectionHeader(labels.executiveSummary);
    
    // Risk level
    const riskLevel = assessRiskLevel(results.aal, results.var90);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${labels.riskLevel}: ${riskLevel.label}`, margin, yPos);
    yPos += 8;
    
    // Key metrics
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`${labels.aal}: ${formatCurrency(results.aal, pdfConfig.currency)}`, margin, yPos);
    yPos += 6;
    doc.text(`${labels.var90}: ${formatCurrency(results.var90, pdfConfig.currency)}`, margin, yPos);
    yPos += 6;
    doc.text(`${labels.var95}: ${formatCurrency(results.var95, pdfConfig.currency)}`, margin, yPos);
    yPos += 6;
    
    // ROSI if available
    if (results.rosi !== undefined && results.rosi !== null) {
        yPos += 3;
        doc.text(`${labels.rosiSummary}: ${formatPercentage(results.rosi)}`, margin, yPos);
        yPos += 6;
        if (results.riskReduction) {
            doc.text(`${labels.riskReduction}: ${formatCurrency(results.riskReduction, pdfConfig.currency)}`, margin, yPos);
            yPos += 6;
        }
    }
    
    // Methodology Section
    addSectionHeader(labels.methodology);
    doc.setFontSize(10);
    addWrappedText('This analysis uses the Factor Analysis of Information Risk (FAIR) methodology, an international standard for quantifying information risk in financial terms.', 10);
    yPos += 3;
    addWrappedText('Key Components:', 10, true);
    addWrappedText('• Loss Event Frequency (LEF) = Threat Event Frequency × Vulnerability', 10);
    addWrappedText('• Loss Magnitude (LM) = Primary Loss + Secondary Loss', 10);
    addWrappedText('• Risk = LEF × LM', 10);
    yPos += 3;
    addWrappedText(`Monte Carlo Simulation: ${(scenario.simulationConfig?.runs || 10000).toLocaleString()} iterations using Beta-PERT distributions.`, 10);
    
    // Input Parameters Section
    addSectionHeader(labels.inputs);
    
    // Create input table
    const inputData = [];
    
    if (scenario.lef) {
        if (scenario.lef.tef) {
            inputData.push([labels.tef, scenario.lef.tef.min, scenario.lef.tef.mostLikely, scenario.lef.tef.max]);
        }
        if (scenario.lef.vulnerability) {
            inputData.push([`${labels.vulnerability} (%)`, scenario.lef.vulnerability.min, scenario.lef.vulnerability.mostLikely, scenario.lef.vulnerability.max]);
        }
    }
    
    if (scenario.lm) {
        if (scenario.lm.primaryLoss) {
            inputData.push([labels.primaryLoss, 
                formatCurrency(scenario.lm.primaryLoss.min, pdfConfig.currency),
                formatCurrency(scenario.lm.primaryLoss.mostLikely, pdfConfig.currency),
                formatCurrency(scenario.lm.primaryLoss.max, pdfConfig.currency)
            ]);
        }
        if (scenario.lm.secondaryLoss && scenario.lm.secondaryLoss.magnitude) {
            inputData.push([labels.secondaryLoss,
                formatCurrency(scenario.lm.secondaryLoss.magnitude.min, pdfConfig.currency),
                formatCurrency(scenario.lm.secondaryLoss.magnitude.mostLikely, pdfConfig.currency),
                formatCurrency(scenario.lm.secondaryLoss.magnitude.max, pdfConfig.currency)
            ]);
        }
    }
    
    if (inputData.length > 0) {
        // Table header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
        doc.text('Parameter', margin + 2, yPos);
        doc.text('Min', margin + 60, yPos);
        doc.text('Most Likely', margin + 90, yPos);
        doc.text('Max', margin + 130, yPos);
        yPos += 6;
        
        // Table rows
        doc.setFont('helvetica', 'normal');
        for (const row of inputData) {
            checkNewPage(8);
            doc.text(String(row[0]), margin + 2, yPos);
            doc.text(String(row[1]), margin + 60, yPos);
            doc.text(String(row[2]), margin + 90, yPos);
            doc.text(String(row[3]), margin + 130, yPos);
            yPos += 6;
        }
    }
    
    // Results Section
    addSectionHeader(labels.results);
    
    // Results table
    doc.setFontSize(10);
    const resultsData = [
        [labels.aal, formatCurrency(results.aal, pdfConfig.currency)],
        [labels.var90, formatCurrency(results.var90, pdfConfig.currency)],
        [labels.var95, formatCurrency(results.var95, pdfConfig.currency)],
        [labels.median, formatCurrency(results.median, pdfConfig.currency)],
        [labels.minLoss, formatCurrency(results.minLoss, pdfConfig.currency)],
        [labels.maxLoss, formatCurrency(results.maxLoss, pdfConfig.currency)]
    ];
    
    for (const row of resultsData) {
        checkNewPage(8);
        doc.setFont('helvetica', 'bold');
        doc.text(row[0] + ':', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(row[1], margin + 60, yPos);
        yPos += 6;
    }
    
    // Percentiles if raw results available
    if (rawResults && rawResults.length > 0) {
        yPos += 5;
        addWrappedText(`${labels.confidenceInterval} (90%):`, 10, true);
        
        const percentiles = calculatePercentiles(rawResults, [5, 25, 50, 75, 95]);
        const percentileData = [
            ['5th Percentile', formatCurrency(percentiles.p5, pdfConfig.currency)],
            ['25th Percentile', formatCurrency(percentiles.p25, pdfConfig.currency)],
            ['50th Percentile (Median)', formatCurrency(percentiles.p50, pdfConfig.currency)],
            ['75th Percentile', formatCurrency(percentiles.p75, pdfConfig.currency)],
            ['95th Percentile', formatCurrency(percentiles.p95, pdfConfig.currency)]
        ];
        
        for (const row of percentileData) {
            checkNewPage(6);
            doc.text(`  ${row[0]}: ${row[1]}`, margin, yPos);
            yPos += 5;
        }
    }
    
    // Recommendations Section
    if (results.rosi !== undefined && results.rosi !== null) {
        addSectionHeader(labels.recommendations);
        
        const recommendation = generateInvestmentRecommendation(results, { language: pdfConfig.language });
        if (recommendation) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            addWrappedText(`${recommendation.icon} ${labels.investmentRecommendation}:`, 11, true);
            doc.setFont('helvetica', 'normal');
            addWrappedText(recommendation.text, 10);
        }
    }
    
    // Top risk drivers from sensitivity analysis
    if (sensitivityResults && sensitivityResults.length > 0) {
        yPos += 5;
        addWrappedText(labels.topRiskDrivers + ':', 11, true);
        
        const topParams = rankInfluentialParameters(sensitivityResults, 3);
        for (let i = 0; i < topParams.length; i++) {
            const param = topParams[i];
            addWrappedText(`${i + 1}. ${param.parameter}: ${param.impactPercentage.toFixed(1)}% impact on AAL`, 10);
        }
    }
    
    // Footer on each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Generated by FAIR Risk Analysis Tool | Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
        );
        doc.text(
            'Based on OpenFAIR™ methodology. OpenFAIR™ is a trademark of The Open Group.',
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }
    
    // Return as blob
    return doc.output('blob');
}

/**
 * Downloads the PDF report directly to the user's device
 * 
 * @param {FAIRScenario} scenario - The FAIR scenario
 * @param {RiskOutput} results - Simulation results
 * @param {PDFExportConfig} [config] - PDF export configuration
 * @param {Array<{total: number}>} [rawResults] - Raw simulation results
 * @param {SensitivityResult[]} [sensitivityResults] - Sensitivity analysis results
 * @returns {Promise<boolean>} True if download was successful
 * 
 * @example
 * await downloadReportPDF(scenario, results, { filename: 'my_risk_report' });
 * 
 * **Validates: Requirements 6.1**
 */
async function downloadReportPDF(scenario, results, config = {}, rawResults = null, sensitivityResults = null) {
    try {
        // Check if jsPDF is available
        if (typeof window === 'undefined' || typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF library is not loaded. Please include jsPDF CDN.');
        }
        
        const { jsPDF } = window.jspdf;
        const filename = config.filename || `FAIR_Report_${new Date().toISOString().slice(0, 10)}`;
        
        // Generate PDF using the same logic as exportReportToPDF but save directly
        const pdfBlob = await exportReportToPDF(scenario, results, config, rawResults, sensitivityResults);
        
        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Failed to download PDF:', error);
        return false;
    }
}

/**
 * Exports report to PDF using html2canvas for chart rendering
 * 
 * This method renders the HTML report first, captures it as an image,
 * and then adds it to the PDF. This preserves chart rendering.
 * 
 * @param {HTMLElement} reportElement - The HTML element containing the report
 * @param {PDFExportConfig} [config] - PDF export configuration
 * @returns {Promise<Blob>} PDF blob
 * 
 * @example
 * const reportDiv = document.getElementById('report-container');
 * const pdfBlob = await exportHTMLReportToPDF(reportDiv, { filename: 'report' });
 * 
 * **Validates: Requirements 6.1**
 */
async function exportHTMLReportToPDF(reportElement, config = {}) {
    // Check if required libraries are available
    if (typeof window === 'undefined') {
        throw new Error('This function must be run in a browser environment');
    }
    
    if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library is not loaded');
    }
    
    if (typeof window.html2canvas === 'undefined') {
        throw new Error('html2canvas library is not loaded');
    }
    
    const { jsPDF } = window.jspdf;
    
    const pdfConfig = {
        filename: config.filename || `FAIR_Report_${new Date().toISOString().slice(0, 10)}`,
        orientation: config.orientation || 'portrait',
        format: config.format || 'a4',
        margin: config.margin || 10
    };
    
    // Capture the HTML element as canvas
    const canvas = await window.html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const doc = new jsPDF({
        orientation: pdfConfig.orientation,
        unit: 'mm',
        format: pdfConfig.format
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = pdfConfig.margin;
    
    // Calculate image dimensions to fit page
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF (may span multiple pages)
    let heightLeft = imgHeight;
    let position = margin;
    
    // First page
    doc.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        position,
        imgWidth,
        imgHeight
    );
    heightLeft -= (pageHeight - margin * 2);
    
    // Additional pages if needed
    while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        doc.addPage();
        doc.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            margin,
            position,
            imgWidth,
            imgHeight
        );
        heightLeft -= (pageHeight - margin * 2);
    }
    
    return doc.output('blob');
}

// Add PDF export functions to window.FAIRCore
if (typeof window !== 'undefined' && window.FAIRCore) {
    window.FAIRCore.exportReportToPDF = exportReportToPDF;
    window.FAIRCore.downloadReportPDF = downloadReportPDF;
    window.FAIRCore.exportHTMLReportToPDF = exportHTMLReportToPDF;
}

// Add to CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports.exportReportToPDF = exportReportToPDF;
    module.exports.downloadReportPDF = downloadReportPDF;
    module.exports.exportHTMLReportToPDF = exportHTMLReportToPDF;
}
