/**
 * FAIR Risk Calculator - Web Worker
 * Handles Monte Carlo simulations for risk analysis
 * 
 * Enhanced with FAIR decomposition support:
 * - TEF = CF × PoA (Contact Frequency × Probability of Action)
 * - Vulnerability = Susceptibility × (1 - Control Effectiveness)
 * - Secondary Loss with category breakdown
 */

// ============================================================================
// FAIR Decomposition Functions (from fair-core.js)
// These are duplicated here because Web Workers cannot import ES6 modules
// ============================================================================

/**
 * Calculates Threat Event Frequency (TEF) from Contact Frequency and Probability of Action
 * TEF = CF × (PoA / 100)
 * 
 * @param {number} cf - Contact Frequency (events per year, must be >= 0)
 * @param {number} poa - Probability of Action (percentage 0-100)
 * @returns {number} Calculated TEF value (events per year)
 */
function calculateTEF(cf, poa) {
    if (typeof cf !== 'number' || isNaN(cf) || cf < 0) {
        return 0;
    }
    if (typeof poa !== 'number' || isNaN(poa) || poa < 0 || poa > 100) {
        return 0;
    }
    return cf * (poa / 100);
}

/**
 * Calculates Susceptibility from Threat Capability and Resistance Strength
 * Uses a linear model where equal TC and RS gives 50% susceptibility
 * 
 * @param {number} threatCapability - Threat Capability (1-10 scale)
 * @param {number} resistanceStrength - Resistance Strength (1-10 scale)
 * @returns {number} Susceptibility as a probability (0.0 to 1.0)
 */
function calculateSusceptibility(threatCapability, resistanceStrength) {
    if (typeof threatCapability !== 'number' || isNaN(threatCapability) || 
        threatCapability < 1 || threatCapability > 10) {
        return 0.5; // Default to 50% if invalid
    }
    if (typeof resistanceStrength !== 'number' || isNaN(resistanceStrength) || 
        resistanceStrength < 1 || resistanceStrength > 10) {
        return 0.5; // Default to 50% if invalid
    }
    
    if (threatCapability <= resistanceStrength) {
        return (threatCapability / resistanceStrength) * 0.5;
    } else {
        const excess = threatCapability - resistanceStrength;
        const maxExcess = 10 - resistanceStrength;
        return 0.5 + (excess / maxExcess) * 0.5;
    }
}

/**
 * Calculates Vulnerability from Susceptibility and Control Effectiveness
 * Vulnerability = Susceptibility × (1 - Control_Effectiveness / 100)
 * 
 * @param {number} susceptibility - Susceptibility as probability (0.0 to 1.0)
 * @param {number} controlEffectiveness - Control effectiveness percentage (0-100)
 * @returns {number} Vulnerability as probability (0.0 to 1.0)
 */
function calculateVulnerabilityFromSusceptibility(susceptibility, controlEffectiveness) {
    if (typeof susceptibility !== 'number' || isNaN(susceptibility) || 
        susceptibility < 0 || susceptibility > 1) {
        return 0.5;
    }
    if (typeof controlEffectiveness !== 'number' || isNaN(controlEffectiveness) || 
        controlEffectiveness < 0 || controlEffectiveness > 100) {
        controlEffectiveness = 0;
    }
    return susceptibility * (1 - controlEffectiveness / 100);
}

/**
 * Calculates expected Secondary Loss from SLEF and SLM
 * Expected Secondary Loss = (SLEF / 100) × SLM
 * 
 * @param {number} slef - Secondary Loss Event Frequency (percentage 0-100)
 * @param {number} slm - Secondary Loss Magnitude (monetary value)
 * @returns {number} Expected secondary loss value
 */
function calculateSecondaryLoss(slef, slm) {
    if (typeof slef !== 'number' || isNaN(slef) || slef < 0 || slef > 100) {
        return 0;
    }
    if (typeof slm !== 'number' || isNaN(slm) || slm < 0) {
        return 0;
    }
    return (slef / 100) * slm;
}

/**
 * Aggregates multiple secondary loss categories
 * 
 * @param {Array} categories - Array of secondary loss categories
 * @returns {Object} Aggregated PERT values { min, mostLikely, max }
 */
function aggregateSecondaryLossCategories(categories) {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return { min: 0, mostLikely: 0, max: 0, probability: 0 };
    }
    
    let totalMin = 0;
    let totalMostLikely = 0;
    let totalMax = 0;
    let maxProbability = 0;
    
    for (const category of categories) {
        if (!category || !category.magnitude) continue;
        
        const probability = category.probability || 0;
        if (probability <= 0 || probability > 100) continue;
        
        const mag = category.magnitude;
        if (typeof mag.min === 'number') totalMin += calculateSecondaryLoss(probability, mag.min);
        if (typeof mag.mostLikely === 'number') totalMostLikely += calculateSecondaryLoss(probability, mag.mostLikely);
        if (typeof mag.max === 'number') totalMax += calculateSecondaryLoss(probability, mag.max);
        
        // Track max probability for event triggering
        if (probability > maxProbability) maxProbability = probability;
    }
    
    return { 
        min: totalMin, 
        mostLikely: totalMostLikely, 
        max: totalMax,
        probability: maxProbability
    };
}

// ============================================================================
// Distribution Classes
// ============================================================================

// Beta-PERT Distribution Generator
class PertDistribution {
    constructor(min, mostLikely, max, lambda = 4) {
        // Validation: Ensure order is correct (Min <= Likely <= Max)
        // If user inputs are mixed up, we sort them to prevent math errors
        const values = [min, mostLikely, max].sort((a, b) => a - b);
        this.min = values[0];
        this.mostLikely = values[1];
        this.max = values[2];
        this.lambda = lambda;
        this.range = this.max - this.min;

        // Edge case: Point Estimate (Min == Max)
        if (this.range === 0) {
            this.alpha = 0;
            this.beta = 0;
            return;
        }

        // Calculate Beta parameters (alpha, beta) from PERT formula
        const mean = (this.min + lambda * this.mostLikely + this.max) / (lambda + 2);

        // Safety check to prevent division by zero or negative alpha/beta
        const numAlpha = (mean - this.min) * (2 * this.mostLikely - this.min - this.max);
        const denAlpha = (this.mostLikely - mean) * (this.max - this.min);

        // If denAlpha is 0 (mean == mode), we use standard Beta parameters or fallback
        if (Math.abs(denAlpha) < 1e-9) {
            this.alpha = 4; // Default symmetric shape
            this.beta = 4;
        } else {
            this.alpha = numAlpha / denAlpha;
            this.beta = (this.alpha * (this.max - mean)) / (mean - this.min);
        }

        // Hard Clamp: Alpha and Beta must be positive for standard Gamma generation
        // If inputs are skewed such that alpha/beta < 0, we clamp to a small positive
        this.alpha = Math.max(0.1, this.alpha);
        this.beta = Math.max(0.1, this.beta);
    }

    // Sample a value using Beta distribution via transformation
    sample() {
        if (this.range === 0) return this.min;

        // Sample from Beta(alpha, beta)
        const betaVal = this.sampleBeta();
        return this.min + this.range * betaVal;
    }

    sampleBeta() {
        // Robust generation: X ~ Gamma(alpha, 1), Y ~ Gamma(beta, 1)
        // Beta = X / (X + Y)
        const x = this.gamma(this.alpha);
        const y = this.gamma(this.beta);

        // Safety for zero sum
        if (x + y === 0) return 0.5; // Fail safe

        return x / (x + y);
    }

    gamma(shape) {
        // Iterative Stack-Safe approach or guarded recursion
        // Marsaglia and Tsang's Method requires d >= 1/3 (shape >= 1)

        // Case: shape < 1
        // Gamma(s) = Gamma(s+1) * U^(1/s)
        // We can just loop this transformation until shape >= 1 to avoid recursion
        let s = shape;
        let multiplier = 1;

        while (s < 1) {
            multiplier *= Math.pow(Math.random(), 1 / s);
            s += 1;
        }

        // Now s >= 1, we use Marsaglia & Tsang
        const d = s - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);
        let v, x;

        while (true) {
            do {
                x = this.randn();
                v = 1 + c * x;
            } while (v <= 0);

            v = v * v * v;
            const u = Math.random();

            if (u < 1 - 0.0331 * x * x * x * x) return multiplier * d * v;
            if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return multiplier * d * v;
        }
    }

    randn() {
        // Box-Muller standard normal
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}

// Poisson Distribution Generator
class PoissonDistribution {
    constructor(lambda) {
        this.lambda = lambda;
    }

    sample() {
        // Knuth's algorithm for small lambda, Normal approximation for large
        if (this.lambda > 30) {
            // Normal approximation
            const x = this.randn() * Math.sqrt(this.lambda) + this.lambda;
            return Math.max(0, Math.round(x));
        } else {
            const L = Math.exp(-this.lambda);
            let k = 0;
            let p = 1;
            do {
                k++;
                p *= Math.random();
            } while (p > L);
            return k - 1;
        }
    }

    randn() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
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
 * Calculates convergence metrics for Monte Carlo simulation results
 * 
 * Standard Error of Mean (SEM) = Standard Deviation / sqrt(n)
 * For VaR, we use bootstrap-like estimation based on order statistics
 * 
 * @param {Array} results - Array of simulation results with 'total' property
 * @param {number} aal - Calculated Average Annual Loss
 * @param {number} var90 - Calculated Value at Risk at 90th percentile
 * @returns {Object} Convergence metrics object
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
            var90RelativeError: 0
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
    // Using asymptotic formula for quantile standard error:
    // SE(quantile_p) ≈ sqrt(p * (1-p) / n) * (1 / f(quantile_p))
    // where f is the probability density function
    // For simplicity, we estimate using local density around the percentile
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
 * @param {Array} sortedLosses - Array of loss values (will be sorted internally)
 * @param {number} p - Percentile as decimal (e.g., 0.90 for 90th percentile)
 * @param {number} n - Number of samples
 * @returns {number} Standard error of the quantile estimate
 */
function calculateQuantileStdError(losses, p, n) {
    // Sort losses for percentile calculation
    const sorted = [...losses].sort((a, b) => a - b);
    
    // Get the quantile index
    const idx = Math.floor(n * p);
    const quantile = sorted[Math.min(idx, n - 1)];
    
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
    // This is the asymptotic formula for quantile standard error
    if (density === 0) {
        return 0;
    }
    
    const se = Math.sqrt(p * (1 - p) / n) / density;
    
    return se;
}

// ============================================================================
// Simulation State Management
// ============================================================================

/**
 * Flag to track if simulation cancellation was requested
 * @type {boolean}
 */
let isCancellationRequested = false;

/**
 * Flag to track if a simulation is currently running
 * @type {boolean}
 */
let isSimulationRunning = false;

/**
 * Resets the cancellation state before starting a new simulation
 */
function resetCancellationState() {
    isCancellationRequested = false;
}

/**
 * Requests cancellation of the current simulation
 */
function requestCancellation() {
    isCancellationRequested = true;
}

/**
 * Checks if cancellation has been requested
 * @returns {boolean} True if cancellation was requested
 */
function shouldCancel() {
    return isCancellationRequested;
}

// ============================================================================
// Simulation Run Count Validation Constants
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
 * @param {number} runs - Number of simulation runs to validate
 * @returns {Object} Validation result with isValid, value, and error message
 */
function validateSimulationRuns(runs) {
    // Check if runs is provided
    if (runs === undefined || runs === null) {
        return {
            isValid: false,
            value: null,
            error: 'Simulation runs is required'
        };
    }
    
    // Check if runs is a valid number
    if (typeof runs !== 'number' || isNaN(runs)) {
        return {
            isValid: false,
            value: null,
            error: 'Simulation runs must be a valid number'
        };
    }
    
    // Check if runs is an integer
    if (!Number.isInteger(runs)) {
        return {
            isValid: false,
            value: null,
            error: 'Simulation runs must be an integer'
        };
    }
    
    // Check if runs is within valid range
    if (runs < MIN_SIMULATION_RUNS || runs > MAX_SIMULATION_RUNS) {
        return {
            isValid: false,
            value: runs,
            error: `Simulation runs must be between ${MIN_SIMULATION_RUNS.toLocaleString()} and ${MAX_SIMULATION_RUNS.toLocaleString()} (got ${runs.toLocaleString()})`
        };
    }
    
    return {
        isValid: true,
        value: runs,
        error: null
    };
}

// ============================================================================
// Sensitivity Analysis Functions
// ============================================================================

/**
 * Sensitivity variation percentage (±20%)
 * @constant {number}
 */
const SENSITIVITY_VARIATION = 0.20;

/**
 * Parameters to analyze for sensitivity
 * Each parameter has a name, path to access values, and type
 */
const SENSITIVITY_PARAMETERS = [
    { name: 'TEF', keys: ['tefMin', 'tefLike', 'tefMax'], type: 'pert' },
    { name: 'Vulnerability', keys: ['vulnMin', 'vulnLike', 'vulnMax'], type: 'pert' },
    { name: 'Primary Loss', keys: ['primaryLossMin', 'primaryLossLike', 'primaryLossMax'], type: 'pert' },
    { name: 'Secondary Loss Probability', keys: ['secondaryLossProb'], type: 'single' },
    { name: 'Secondary Loss Magnitude', keys: ['secondaryLossMin', 'secondaryLossLike', 'secondaryLossMax'], type: 'pert' }
];

/**
 * Applies a variation multiplier to parameter values
 * 
 * @param {Object} params - Original simulation parameters
 * @param {Object} paramDef - Parameter definition with keys and type
 * @param {number} multiplier - Variation multiplier (e.g., 0.8 for -20%, 1.2 for +20%)
 * @returns {Object} Modified parameters with variation applied
 */
function applyParameterVariation(params, paramDef, multiplier) {
    const modified = { ...params };
    
    for (const key of paramDef.keys) {
        if (modified[key] !== undefined && modified[key] !== null) {
            modified[key] = modified[key] * multiplier;
            
            // Ensure percentage values stay within bounds
            if (key.includes('Prob') || key.includes('vuln') || key.includes('poa')) {
                modified[key] = Math.min(100, Math.max(0, modified[key]));
            }
            // Ensure non-negative values
            if (modified[key] < 0) {
                modified[key] = 0;
            }
        }
    }
    
    return modified;
}

/**
 * Runs a quick simulation for sensitivity analysis
 * Uses fewer runs for faster execution while maintaining statistical validity
 * 
 * @param {Object} params - Simulation parameters
 * @returns {number} Average Annual Loss (AAL) from simulation
 */
function runQuickSimulation(params) {
    const {
        simulationRuns,
        tefMin, tefLike, tefMax,
        vulnMin, vulnLike, vulnMax,
        primaryLossMin, primaryLossLike, primaryLossMax,
        secondaryLossProb,
        secondaryLossMin, secondaryLossLike, secondaryLossMax
    } = params;
    
    // Use reduced runs for sensitivity analysis (10% of original, min 100)
    const quickRuns = Math.max(100, Math.min(1000, Math.floor(simulationRuns * 0.1)));
    
    // Initialize distributions
    const tefDist = new PertDistribution(tefMin, tefLike, tefMax);
    const vulnDist = new PertDistribution(vulnMin, vulnLike, vulnMax);
    const plmDist = new PertDistribution(primaryLossMin, primaryLossLike, primaryLossMax);
    const slmDist = new PertDistribution(secondaryLossMin, secondaryLossLike, secondaryLossMax);
    
    let totalLoss = 0;
    
    for (let i = 0; i < quickRuns; i++) {
        let annualLoss = 0;
        
        // Calculate LEF
        const yearTEF = Math.max(0, tefDist.sample());
        const yearVuln = Math.max(0, Math.min(100, vulnDist.sample())) / 100;
        const lambda = yearTEF * yearVuln;
        
        // Sample number of events
        const poisson = new PoissonDistribution(lambda);
        const numEvents = poisson.sample();
        
        // Calculate losses for each event
        if (numEvents > 0) {
            for (let k = 0; k < numEvents; k++) {
                const pl = Math.max(0, plmDist.sample());
                annualLoss += pl;
                
                // Secondary loss
                if (Math.random() < (secondaryLossProb / 100)) {
                    const sl = Math.max(0, slmDist.sample());
                    annualLoss += sl;
                }
            }
        }
        
        totalLoss += annualLoss;
    }
    
    return totalLoss / quickRuns;
}

/**
 * Performs sensitivity analysis by varying each parameter ±20%
 * 
 * @param {Object} baseParams - Baseline simulation parameters
 * @param {number} baselineAAL - Baseline Average Annual Loss
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Array} Array of sensitivity results for each parameter
 */
function performSensitivityAnalysis(baseParams, baselineAAL, progressCallback) {
    const results = [];
    const totalParams = SENSITIVITY_PARAMETERS.length;
    
    for (let i = 0; i < totalParams; i++) {
        const paramDef = SENSITIVITY_PARAMETERS[i];
        
        // Check if parameter has valid values
        const hasValidValues = paramDef.keys.some(key => 
            baseParams[key] !== undefined && 
            baseParams[key] !== null && 
            baseParams[key] > 0
        );
        
        if (!hasValidValues) {
            // Skip parameters with no valid values
            continue;
        }
        
        // Apply -20% variation
        const lowParams = applyParameterVariation(baseParams, paramDef, 1 - SENSITIVITY_VARIATION);
        const lowAAL = runQuickSimulation(lowParams);
        
        // Apply +20% variation
        const highParams = applyParameterVariation(baseParams, paramDef, 1 + SENSITIVITY_VARIATION);
        const highAAL = runQuickSimulation(highParams);
        
        // Calculate sensitivity
        // Sensitivity = (highAAL - lowAAL) / baselineAAL
        const sensitivity = baselineAAL > 0 ? (highAAL - lowAAL) / baselineAAL : 0;
        
        results.push({
            parameter: paramDef.name,
            baselineAAL: baselineAAL,
            lowAAL: lowAAL,
            highAAL: highAAL,
            sensitivity: sensitivity,
            absoluteImpact: Math.abs(highAAL - lowAAL),
            lowVariation: -SENSITIVITY_VARIATION * 100,
            highVariation: SENSITIVITY_VARIATION * 100
        });
        
        // Report progress
        if (progressCallback) {
            progressCallback((i + 1) / totalParams * 100);
        }
    }
    
    // Sort by absolute sensitivity (most impactful first)
    results.sort((a, b) => Math.abs(b.sensitivity) - Math.abs(a.sensitivity));
    
    return results;
}

/**
 * Gets the top N most influential parameters from sensitivity results
 * 
 * @param {Array} sensitivityResults - Array of sensitivity analysis results
 * @param {number} topN - Number of top parameters to return (default: 3)
 * @returns {Array} Top N most influential parameters
 */
function getTopInfluentialParameters(sensitivityResults, topN = 3) {
    // Results are already sorted by absolute sensitivity
    return sensitivityResults.slice(0, topN).map((result, index) => ({
        rank: index + 1,
        parameter: result.parameter,
        sensitivity: result.sensitivity,
        absoluteImpact: result.absoluteImpact,
        impactPercentage: Math.abs(result.sensitivity) * 100
    }));
}

self.onmessage = function (e) {
    // Handle sensitivity analysis request
    if (e.data && e.data.type === 'RUN_SENSITIVITY') {
        try {
            const params = e.data.payload || e.data;
            
            // First run baseline simulation to get baselineAAL
            self.postMessage({ type: 'progress', progress: 0 });
            
            // Extract parameters for quick simulation
            const baseParams = {
                simulationRuns: params.simulationRuns || 10000,
                tefMin: params.tefMin,
                tefLike: params.tefLike,
                tefMax: params.tefMax,
                vulnMin: params.vulnMin,
                vulnLike: params.vulnLike,
                vulnMax: params.vulnMax,
                primaryLossMin: params.primaryLossMin,
                primaryLossLike: params.primaryLossLike,
                primaryLossMax: params.primaryLossMax,
                secondaryLossProb: params.secondaryLossProb || 0,
                secondaryLossMin: params.secondaryLossMin || 0,
                secondaryLossLike: params.secondaryLossLike || 0,
                secondaryLossMax: params.secondaryLossMax || 0
            };
            
            // Calculate baseline AAL
            const baselineAAL = runQuickSimulation(baseParams);
            
            self.postMessage({ type: 'progress', progress: 10 });
            
            // Perform sensitivity analysis
            const sensitivityResults = performSensitivityAnalysis(
                baseParams, 
                baselineAAL,
                (progress) => {
                    // Scale progress from 10% to 90%
                    self.postMessage({ type: 'progress', progress: 10 + progress * 0.8 });
                }
            );
            
            // Get top 3 influential parameters
            const topParameters = getTopInfluentialParameters(sensitivityResults, 3);
            
            self.postMessage({ type: 'progress', progress: 100 });
            
            // Send results
            self.postMessage({
                type: 'sensitivity_complete',
                data: {
                    baselineAAL: baselineAAL,
                    results: sensitivityResults,
                    topParameters: topParameters,
                    variationPercentage: SENSITIVITY_VARIATION * 100
                }
            });
            
        } catch (error) {
            self.postMessage({ type: 'error', message: 'Sensitivity analysis failed: ' + error.message });
        }
        return;
    }
    
    // Handle cancellation request
    if (e.data && e.data.type === 'CANCEL_SIMULATION') {
        if (isSimulationRunning) {
            requestCancellation();
            // Note: The actual cancellation response will be sent from the simulation loop
        } else {
            // No simulation running, just acknowledge
            self.postMessage({ type: 'cancelled', data: null });
        }
        return;
    }

    const {
        simulationRuns,
        // TEF inputs (simple mode)
        tefMin, tefLike, tefMax,
        // TEF decomposition inputs (advanced mode: CF × PoA)
        cfMin, cfLike, cfMax,
        poaMin, poaLike, poaMax,
        useTEFDecomposition,
        // Vulnerability inputs (simple mode)
        vulnMin, vulnLike, vulnMax,
        // Vulnerability decomposition inputs (advanced mode: TC vs RS)
        tcMin, tcLike, tcMax,
        rsMin, rsLike, rsMax,
        useVulnDecomposition,
        // Primary Loss
        primaryLossMin, primaryLossLike, primaryLossMax,
        // Secondary Loss (simple mode)
        secondaryLossProb,
        secondaryLossMin, secondaryLossLike, secondaryLossMax,
        // Secondary Loss Categories (advanced mode)
        secondaryLossCategories,
        useSecondaryLossCategories,
        // Control
        controlCost,
        controlEffectiveness
    } = e.data;

    try {
        // Reset cancellation state and mark simulation as running
        resetCancellationState();
        isSimulationRunning = true;

        // Validate simulation runs before starting
        const runsValidation = validateSimulationRuns(simulationRuns);
        if (!runsValidation.isValid) {
            isSimulationRunning = false;
            self.postMessage({ type: 'error', message: runsValidation.error });
            return;
        }
        // Check if control is configured
        const hasControl = controlCost > 0 && controlEffectiveness > 0;

        // Calculate effective TEF values based on mode
        let effectiveTefMin, effectiveTefLike, effectiveTefMax;
        if (useTEFDecomposition && cfMin !== undefined && poaMin !== undefined) {
            // Advanced mode: TEF = CF × PoA
            effectiveTefMin = calculateTEF(cfMin, poaMin);
            effectiveTefLike = calculateTEF(cfLike, poaLike);
            effectiveTefMax = calculateTEF(cfMax, poaMax);
        } else {
            // Simple mode: use direct TEF values
            effectiveTefMin = tefMin;
            effectiveTefLike = tefLike;
            effectiveTefMax = tefMax;
        }

        // Calculate effective Vulnerability values based on mode
        let effectiveVulnMin, effectiveVulnLike, effectiveVulnMax;
        if (useVulnDecomposition && tcMin !== undefined && rsMin !== undefined) {
            // Advanced mode: Vulnerability from TC vs RS
            // Calculate susceptibility for each PERT point
            const suscMin = calculateSusceptibility(tcMin, rsMax);      // Min TC vs Max RS = lowest
            const suscLike = calculateSusceptibility(tcLike, rsLike);
            const suscMax = calculateSusceptibility(tcMax, rsMin);      // Max TC vs Min RS = highest
            
            // Apply control effectiveness to get vulnerability (as percentage 0-100)
            const ctrlEff = hasControl ? controlEffectiveness : 0;
            effectiveVulnMin = calculateVulnerabilityFromSusceptibility(suscMin, ctrlEff) * 100;
            effectiveVulnLike = calculateVulnerabilityFromSusceptibility(suscLike, ctrlEff) * 100;
            effectiveVulnMax = calculateVulnerabilityFromSusceptibility(suscMax, ctrlEff) * 100;
        } else {
            // Simple mode: use direct Vulnerability values
            effectiveVulnMin = vulnMin;
            effectiveVulnLike = vulnLike;
            effectiveVulnMax = vulnMax;
        }

        // Calculate effective Secondary Loss values based on mode
        let effectiveSlProb, effectiveSlMin, effectiveSlLike, effectiveSlMax;
        if (useSecondaryLossCategories && secondaryLossCategories && secondaryLossCategories.length > 0) {
            // Advanced mode: aggregate categories
            const aggregated = aggregateSecondaryLossCategories(secondaryLossCategories);
            // For category mode, we use the aggregated expected values directly
            // The probability is handled within the aggregation
            effectiveSlProb = aggregated.probability || 100; // Use max probability for event triggering
            effectiveSlMin = aggregated.min;
            effectiveSlLike = aggregated.mostLikely;
            effectiveSlMax = aggregated.max;
        } else {
            // Simple mode: use direct secondary loss values
            effectiveSlProb = secondaryLossProb;
            effectiveSlMin = secondaryLossMin;
            effectiveSlLike = secondaryLossLike;
            effectiveSlMax = secondaryLossMax;
        }

        // Helper function to run simulation with given vulnerability values
        // Returns an object with results and a 'cancelled' flag if simulation was interrupted
        function runSimulation(vMin, vLike, vMax, slProb, slMin, slLike, slMax, progressOffset = 0, progressMultiplier = 100) {
            const results = [];
            let totalLoss = 0;
            let maxLoss = 0;
            let minLoss = Number.MAX_VALUE;
            let completedRuns = 0;

            // Initialize Distributions
            const tefDist = new PertDistribution(effectiveTefMin, effectiveTefLike, effectiveTefMax);
            const vulnDist = new PertDistribution(vMin, vLike, vMax);
            const plmDist = new PertDistribution(primaryLossMin, primaryLossLike, primaryLossMax);
            const slmDist = new PertDistribution(slMin, slLike, slMax);

            // Simulation Loop
            for (let i = 0; i < simulationRuns; i++) {
                // Check for cancellation every 100 iterations for responsiveness
                if (i % 100 === 0 && shouldCancel()) {
                    // Return partial results
                    return buildPartialResults(results, completedRuns, totalLoss, minLoss, maxLoss, true);
                }

                let annualLoss = 0;

                // 1. Determine LEF (Loss Event Frequency) for this year
                const yearTEF = Math.max(0, tefDist.sample());
                const yearVuln = Math.max(0, Math.min(100, vulnDist.sample())) / 100;

                // Expected Loss Events = TEF * Vuln
                const lambda = yearTEF * yearVuln;
                const poisson = new PoissonDistribution(lambda);
                const numEvents = poisson.sample();

                // 2. Calculate Loss for each event
                let primSum = 0;
                let secSum = 0;

                if (numEvents > 0) {
                    for (let k = 0; k < numEvents; k++) {
                        const pl = Math.max(0, plmDist.sample());
                        primSum += pl;

                        // Secondary loss handling
                        if (useSecondaryLossCategories && secondaryLossCategories && secondaryLossCategories.length > 0) {
                            // Category mode: each category has its own probability
                            // Sample from the aggregated distribution when any category triggers
                            if (Math.random() < (slProb / 100)) {
                                const sl = Math.max(0, slmDist.sample());
                                secSum += sl;
                            }
                        } else {
                            // Simple mode: use single probability
                            if (Math.random() < (slProb / 100)) {
                                const sl = Math.max(0, slmDist.sample());
                                secSum += sl;
                            }
                        }
                    }
                }
                annualLoss = primSum + secSum;

                results.push({
                    year: i + 1,
                    events: numEvents,
                    primary: primSum,
                    secondary: secSum,
                    total: annualLoss
                });

                totalLoss += annualLoss;
                completedRuns++;
                if (annualLoss > maxLoss) maxLoss = annualLoss;
                if (annualLoss < minLoss) minLoss = annualLoss;

                // Progress update
                if (i % 2000 === 0 && i > 0) {
                    const progress = progressOffset + (i / simulationRuns) * progressMultiplier;
                    self.postMessage({ type: 'progress', progress: progress });
                }
            }

            // Return complete results
            return buildPartialResults(results, completedRuns, totalLoss, minLoss, maxLoss, false);
        }

        // Helper function to build results (partial or complete)
        function buildPartialResults(results, completedRuns, totalLoss, minLoss, maxLoss, cancelled) {
            if (completedRuns === 0) {
                return {
                    aal: 0,
                    var90: 0,
                    var95: 0,
                    minLoss: 0,
                    maxLoss: 0,
                    results: [],
                    curveData: [],
                    cancelled: cancelled,
                    completedRuns: 0,
                    totalRuns: simulationRuns,
                    convergenceMetrics: {
                        aalStdError: 0,
                        var90StdError: 0,
                        isConverged: false,
                        recommendedRuns: MIN_RUNS_FOR_CONVERGENCE,
                        aalRelativeError: 0,
                        var90RelativeError: 0,
                        stdDev: 0
                    }
                };
            }

            // Sort for percentile calculations
            const sortedResults = [...results].sort((a, b) => a.total - b.total);

            // AAL (Average Annual Loss)
            const aal = totalLoss / completedRuns;

            // VaR (Value at Risk) - Percentiles (based on completed runs)
            const idx90 = Math.floor(completedRuns * 0.90);
            const idx95 = Math.floor(completedRuns * 0.95);
            const var90 = sortedResults[Math.min(idx90, sortedResults.length - 1)].total;
            const var95 = sortedResults[Math.min(idx95, sortedResults.length - 1)].total;

            // Calculate convergence metrics
            const convergenceMetrics = calculateConvergenceMetrics(results, aal, var90);

            // Loss Exceedance Curve Data
            const curveData = [];
            const step = Math.max(1, Math.floor(completedRuns / 20));
            for (let j = 0; j < completedRuns; j += step) {
                const loss = sortedResults[j].total;
                const exceedanceProb = ((completedRuns - j) / completedRuns) * 100;
                if (loss > 0) {
                    curveData.push({ x: exceedanceProb, y: loss });
                }
            }

            return {
                aal,
                var90,
                var95,
                minLoss: minLoss === Number.MAX_VALUE ? 0 : minLoss,
                maxLoss,
                results,
                curveData,
                cancelled: cancelled,
                completedRuns: completedRuns,
                totalRuns: simulationRuns,
                convergenceMetrics
            };
        }

        // Run baseline simulation (without control applied to vulnerability in simple mode)
        const progressMult = hasControl ? 50 : 100;
        const baselineResults = runSimulation(
            effectiveVulnMin, effectiveVulnLike, effectiveVulnMax,
            effectiveSlProb, effectiveSlMin, effectiveSlLike, effectiveSlMax,
            0, progressMult
        );

        // Check if baseline simulation was cancelled
        if (baselineResults.cancelled) {
            isSimulationRunning = false;
            self.postMessage({
                type: 'cancelled',
                data: {
                    partial: true,
                    completedRuns: baselineResults.completedRuns,
                    totalRuns: baselineResults.totalRuns,
                    aal: baselineResults.aal,
                    var90: baselineResults.var90,
                    var95: baselineResults.var95,
                    minLoss: baselineResults.minLoss,
                    maxLoss: baselineResults.maxLoss,
                    curveData: baselineResults.curveData,
                    convergenceMetrics: baselineResults.convergenceMetrics,
                    message: `Simulation cancelled after ${baselineResults.completedRuns.toLocaleString()} of ${baselineResults.totalRuns.toLocaleString()} runs`
                }
            });
            return;
        }

        // ROSI calculation variables
        let aalAfterControl = 0;
        let riskReduction = 0;
        let rosi = 0;
        let curveDataAfterControl = [];
        let var90AfterControl = 0;
        let controlResultsCancelled = false;

        if (hasControl) {
            let reducedVulnMin, reducedVulnLike, reducedVulnMax;
            
            if (useVulnDecomposition && tcMin !== undefined && rsMin !== undefined) {
                // Advanced mode: control effectiveness already applied in vulnerability calculation
                // For "after control" scenario, we use the same values (already reduced)
                reducedVulnMin = effectiveVulnMin;
                reducedVulnLike = effectiveVulnLike;
                reducedVulnMax = effectiveVulnMax;
            } else {
                // Simple mode: apply control effectiveness as reduction multiplier
                const effectivenessMultiplier = 1 - (controlEffectiveness / 100);
                reducedVulnMin = vulnMin * effectivenessMultiplier;
                reducedVulnLike = vulnLike * effectivenessMultiplier;
                reducedVulnMax = vulnMax * effectivenessMultiplier;
            }

            // Run simulation with reduced vulnerability (progress starts at 50%)
            const controlResults = runSimulation(
                reducedVulnMin, reducedVulnLike, reducedVulnMax,
                effectiveSlProb, effectiveSlMin, effectiveSlLike, effectiveSlMax,
                50, 50
            );

            // Check if control simulation was cancelled
            if (controlResults.cancelled) {
                controlResultsCancelled = true;
                isSimulationRunning = false;
                // Return partial results with baseline complete but control incomplete
                self.postMessage({
                    type: 'cancelled',
                    data: {
                        partial: true,
                        completedRuns: baselineResults.completedRuns + controlResults.completedRuns,
                        totalRuns: baselineResults.totalRuns * 2,
                        aal: baselineResults.aal,
                        var90: baselineResults.var90,
                        var95: baselineResults.var95,
                        minLoss: baselineResults.minLoss,
                        maxLoss: baselineResults.maxLoss,
                        curveData: baselineResults.curveData,
                        convergenceMetrics: baselineResults.convergenceMetrics,
                        // Partial ROSI data
                        hasControl: true,
                        controlCost,
                        aalAfterControl: controlResults.aal,
                        riskReduction: baselineResults.aal - controlResults.aal,
                        rosi: controlCost > 0 ? ((baselineResults.aal - controlResults.aal - controlCost) / controlCost) * 100 : 0,
                        curveDataAfterControl: controlResults.curveData,
                        var90AfterControl: controlResults.var90,
                        convergenceMetricsAfterControl: controlResults.convergenceMetrics,
                        message: `Simulation cancelled during control analysis after ${(baselineResults.completedRuns + controlResults.completedRuns).toLocaleString()} of ${(baselineResults.totalRuns * 2).toLocaleString()} total runs`
                    }
                });
                return;
            }

            aalAfterControl = controlResults.aal;
            curveDataAfterControl = controlResults.curveData;
            var90AfterControl = controlResults.var90;

            // Calculate ROSI
            riskReduction = baselineResults.aal - aalAfterControl;
            if (controlCost > 0) {
                rosi = ((riskReduction - controlCost) / controlCost) * 100;
            }
        }

        // Mark simulation as complete
        isSimulationRunning = false;

        // Send results back
        self.postMessage({
            type: 'complete',
            data: {
                aal: baselineResults.aal,
                var90: baselineResults.var90,
                var95: baselineResults.var95,
                minLoss: baselineResults.minLoss,
                maxLoss: baselineResults.maxLoss,
                results: baselineResults.results,
                curveData: baselineResults.curveData,
                // ROSI data
                hasControl,
                controlCost,
                aalAfterControl,
                riskReduction,
                rosi,
                // New: curve data after control for comparison chart
                curveDataAfterControl,
                var90AfterControl,
                // Completion info
                completedRuns: baselineResults.completedRuns,
                totalRuns: baselineResults.totalRuns,
                // Convergence metrics
                convergenceMetrics: baselineResults.convergenceMetrics,
                // Decomposition info for debugging/display
                decomposition: {
                    useTEFDecomposition: useTEFDecomposition || false,
                    useVulnDecomposition: useVulnDecomposition || false,
                    useSecondaryLossCategories: useSecondaryLossCategories || false,
                    effectiveTEF: { min: effectiveTefMin, mostLikely: effectiveTefLike, max: effectiveTefMax },
                    effectiveVuln: { min: effectiveVulnMin, mostLikely: effectiveVulnLike, max: effectiveVulnMax },
                    effectiveSecondaryLoss: { 
                        probability: effectiveSlProb, 
                        min: effectiveSlMin, 
                        mostLikely: effectiveSlLike, 
                        max: effectiveSlMax 
                    }
                }
            }
        });

    } catch (error) {
        isSimulationRunning = false;
        self.postMessage({ type: 'error', message: error.message });
    }
};
