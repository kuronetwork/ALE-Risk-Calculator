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
        validateScenario: validateScenario
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
        validateScenario
    };
}

// Export for ES6 modules
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
    validateScenario
};
