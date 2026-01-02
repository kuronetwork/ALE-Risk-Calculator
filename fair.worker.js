/**
 * FAIR Risk Calculator - Web Worker
 * Handles Monte Carlo simulations for risk analysis
 */

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

self.onmessage = function (e) {
    const {
        simulationRuns,
        tefMin, tefLike, tefMax,
        vulnMin, vulnLike, vulnMax,
        primaryLossMin, primaryLossLike, primaryLossMax,
        secondaryLossProb, // 0-100
        secondaryLossMin, secondaryLossLike, secondaryLossMax
    } = e.data;

    try {
        const results = [];
        let totalLoss = 0;
        let maxLoss = 0;
        let minLoss = Number.MAX_VALUE;
        const lossCounts = new Map(); // For histogram

        // Initialize Distributions
        // TEF: Threat Event Frequency
        const tefDist = new PertDistribution(tefMin, tefLike, tefMax);

        // Vuln: Vulnerability (Probability of Loss given Threat)
        const vulnDist = new PertDistribution(vulnMin, vulnLike, vulnMax);

        // Primary Loss Magnitude
        const plmDist = new PertDistribution(primaryLossMin, primaryLossLike, primaryLossMax);

        // Secondary Loss Magnitude
        const slmDist = new PertDistribution(secondaryLossMin, secondaryLossLike, secondaryLossMax);

        // Simulation Loop
        for (let i = 0; i < simulationRuns; i++) {
            let annualLoss = 0;

            // 1. Determine LEF (Loss Event Frequency) for this year
            // FAIR Method: LEF is derived from TEF and Vuln
            // We sample TEF and Vuln for the year
            const yearTEF = Math.max(0, tefDist.sample());
            const yearVuln = Math.max(0, Math.min(100, vulnDist.sample())) / 100;

            // Expected Loss Events = TEF * Vuln
            // Use Poisson to determine integer number of actual events
            const lambda = yearTEF * yearVuln;
            const poisson = new PoissonDistribution(lambda);
            const numEvents = poisson.sample();

            // 2. Calculate Loss (Logic moved to recording phase for detailed tracking)


            // 3. Record Annual Result
            // We store detailed object for richer CSV analysis
            const record = {
                year: i + 1,
                events: numEvents,
                primaryLoss: annualLoss - ((numEvents > 0) ? 0 : 0), // Simplifying for now, technically we didn't track prim/sec separately in 'annualLoss' variable above. Let's fix that.
                secondaryLoss: 0,
                total: annualLoss
            };

            // Re-calculating split for accuracy in record
            // Limitation: The previous loop mixed them. 
            // Let's refactor the loop slightly to track prim/sec separately.

            // REFACTORING LOOP INSIDE THIS BLOCK PROPERLY:
            let primSum = 0;
            let secSum = 0;

            if (numEvents > 0) {
                for (let k = 0; k < numEvents; k++) {
                    const pl = Math.max(0, plmDist.sample());
                    primSum += pl;

                    if (Math.random() < (secondaryLossProb / 100)) {
                        const sl = Math.max(0, slmDist.sample());
                        secSum += sl;
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
            if (annualLoss > maxLoss) maxLoss = annualLoss;
            if (annualLoss < minLoss) minLoss = annualLoss;

            // Progress update
            if (i % 2000 === 0 && i > 0) {
                self.postMessage({ type: 'progress', progress: (i / simulationRuns) * 100 });
            }
        }

        // 4. Analysis
        // We need to sort by TOTAL loss for the VaR calculation
        const sortedResults = [...results].sort((a, b) => a.total - b.total);

        // AAL (Average Annual Loss)
        const aal = totalLoss / simulationRuns;

        // VaR (Value at Risk) - Percentiles
        const idx90 = Math.floor(simulationRuns * 0.90);
        const idx95 = Math.floor(simulationRuns * 0.95);
        const var90 = sortedResults[idx90].total;
        const var95 = sortedResults[idx95].total;

        // Loss Exceedance Curve Data
        const curveData = [];
        const step = Math.floor(simulationRuns / 20);
        for (let i = 0; i < simulationRuns; i += step) {
            const loss = sortedResults[i].total;
            const exceedanceProb = ((simulationRuns - i) / simulationRuns) * 100;
            if (loss > 0) {
                curveData.push({ x: exceedanceProb, y: loss });
            }
        }

        // Send results back
        self.postMessage({
            type: 'complete',
            data: {
                aal,
                var90,
                var95,
                minLoss: minLoss === Number.MAX_VALUE ? 0 : minLoss,
                maxLoss,
                results: results, // Return the full array of objects
                curveData
            }
        });

    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};
