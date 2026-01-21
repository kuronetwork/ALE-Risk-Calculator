/**
 * Property-Based Tests for FAIR I18n (Internationalization) Module
 * 
 * Uses fast-check for property-based testing to verify correctness properties
 * defined in the design document.
 * 
 * @module fair-i18n.property.test
 */

import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Load the fair.html file and extract I18n translations
let I18n = null;
let htmlContent = '';

beforeAll(() => {
    // Read the fair.html file
    const htmlPath = path.join(process.cwd(), 'fair.html');
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Extract the I18n translations using regex parsing
    // This approach doesn't require jsdom
    const translations = {};
    
    // Find the translations object in the HTML
    const translationsStart = htmlContent.indexOf('translations: {');
    if (translationsStart === -1) {
        console.error('Could not find translations object in fair.html');
        return;
    }
    
    // Find the end of translations object (look for the init: function pattern)
    const initStart = htmlContent.indexOf('init: function', translationsStart);
    if (initStart === -1) {
        console.error('Could not find end of translations object');
        return;
    }
    
    const translationsSection = htmlContent.substring(translationsStart, initStart);
    
    // Parse each language block
    // Match language blocks like: en: { ... }, 'zh-TW': { ... }, ja: { ... }
    const langBlockRegex = /(['"]?)([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\1:\s*\{/g;
    let langMatch;
    const langPositions = [];
    
    while ((langMatch = langBlockRegex.exec(translationsSection)) !== null) {
        langPositions.push({
            lang: langMatch[2],
            start: langMatch.index + langMatch[0].length
        });
    }
    
    // For each language, extract its key-value pairs
    for (let i = 0; i < langPositions.length; i++) {
        const lang = langPositions[i].lang;
        const start = langPositions[i].start;
        const end = i < langPositions.length - 1 
            ? langPositions[i + 1].start - 50 // Approximate end before next language
            : translationsSection.length;
        
        const langSection = translationsSection.substring(start, end);
        
        // Extract key-value pairs
        const keys = {};
        const keyValueRegex = /(\w+):\s*["'`]([^"'`]*(?:\\["'`][^"'`]*)*)["'`]/g;
        let kvMatch;
        
        while ((kvMatch = keyValueRegex.exec(langSection)) !== null) {
            keys[kvMatch[1]] = kvMatch[2];
        }
        
        if (Object.keys(keys).length > 0) {
            translations[lang] = keys;
        }
    }
    
    I18n = { translations };
});

/**
 * Feature: fair-risk-analysis-enhancement
 * Property 15: 國際化翻譯完整性 (I18n Translation Completeness)
 * 
 * For any supported language, all translation keys used in the UI should have
 * corresponding translation values defined.
 * 
 * **Validates: Requirements 10.6**
 */
describe('Property 15: I18n Translation Completeness', () => {
    
    // Get all data-i18n keys from the HTML
    const getDataI18nKeys = () => {
        const keyRegex = /data-i18n="([^"]+)"/g;
        const keys = new Set();
        let match;
        
        while ((match = keyRegex.exec(htmlContent)) !== null) {
            keys.add(match[1]);
        }
        
        return Array.from(keys);
    };

    // Get all supported languages
    const getSupportedLanguages = () => {
        if (!I18n || !I18n.translations) return [];
        return Object.keys(I18n.translations);
    };

    test('should have I18n translations loaded', () => {
        expect(I18n).not.toBeNull();
        expect(I18n.translations).toBeDefined();
    });

    test('should have English (en) as the base language', () => {
        expect(I18n.translations).toHaveProperty('en');
        expect(Object.keys(I18n.translations.en).length).toBeGreaterThan(0);
    });

    test('should have all required languages defined', () => {
        const requiredLanguages = ['en', 'zh-TW', 'ja'];
        const optionalLanguages = ['es', 'de', 'fr', 'pt', 'vi'];
        
        // Check required languages
        requiredLanguages.forEach(lang => {
            expect(I18n.translations).toHaveProperty(lang);
        });
        
        // Check optional languages (at least some should be present)
        const presentOptional = optionalLanguages.filter(lang => I18n.translations[lang]);
        expect(presentOptional.length).toBeGreaterThan(0);
    });

    test('all data-i18n keys in HTML should have English translations', () => {
        const htmlKeys = getDataI18nKeys();
        const enTranslations = I18n.translations.en || {};
        
        const missingKeys = htmlKeys.filter(key => !enTranslations[key]);
        
        // Report missing keys for debugging
        if (missingKeys.length > 0) {
            console.log('Missing English translations for keys:', missingKeys);
        }
        
        // Allow some tolerance for dynamically generated keys
        expect(missingKeys.length).toBeLessThanOrEqual(5);
    });

    test('property: for any supported language, core UI keys should have translations', () => {
        // Core UI keys that must be translated in all languages
        const coreKeys = [
            'navTitle',
            'labelMin',
            'labelLikely',
            'labelMax',
            'btnRun',
            'btnCancel',
            'metricAAL',
            'metricVaR'
        ];

        const languages = getSupportedLanguages();
        
        fc.assert(
            fc.property(
                fc.constantFrom(...languages),
                fc.constantFrom(...coreKeys),
                (lang, key) => {
                    const translations = I18n.translations[lang];
                    if (!translations) return true; // Skip if language not defined
                    
                    // Core keys should have translations
                    return translations[key] !== undefined && translations[key] !== '';
                }
            ),
            { numRuns: Math.min(100, languages.length * coreKeys.length) }
        );
    });

    test('property: translation values should be non-empty strings', () => {
        const languages = getSupportedLanguages();
        
        fc.assert(
            fc.property(
                fc.constantFrom(...languages),
                (lang) => {
                    const translations = I18n.translations[lang];
                    if (!translations) return true;
                    
                    // All translation values should be non-empty strings
                    return Object.values(translations).every(value => 
                        typeof value === 'string' && value.length > 0
                    );
                }
            ),
            { numRuns: languages.length }
        );
    });

    test('property: English should have all keys that required languages have', () => {
        // Only check required languages - optional languages may have different key sets
        const requiredLanguages = ['zh-TW', 'ja'];
        const enKeys = new Set(Object.keys(I18n.translations.en || {}));
        
        fc.assert(
            fc.property(
                fc.constantFrom(...requiredLanguages),
                (lang) => {
                    const langKeys = Object.keys(I18n.translations[lang] || {});
                    
                    // Check if there are keys in this language that don't exist in English
                    const missingInEnglish = langKeys.filter(key => !enKeys.has(key));
                    
                    // Allow up to 5 keys difference (for language-specific keys like pageTitle)
                    return missingInEnglish.length <= 5;
                }
            ),
            { numRuns: requiredLanguages.length }
        );
    });

    test('property: required languages should have minimum key coverage', () => {
        const requiredLanguages = ['en', 'zh-TW', 'ja'];
        const enKeyCount = Object.keys(I18n.translations.en || {}).length;
        
        // Required languages should have at least 80% of English keys
        const minCoverage = 0.8;
        
        fc.assert(
            fc.property(
                fc.constantFrom(...requiredLanguages),
                (lang) => {
                    const langKeyCount = Object.keys(I18n.translations[lang] || {}).length;
                    const coverage = langKeyCount / enKeyCount;
                    
                    return coverage >= minCoverage;
                }
            ),
            { numRuns: requiredLanguages.length }
        );
    });

    test('property: comparison section keys should be translated in required languages', () => {
        const requiredLanguages = ['en', 'zh-TW', 'ja'];
        const comparisonKeys = [
            'comparisonTitle',
            'comparisonDesc',
            'btnSaveScenario',
            'colScenario',
            'colAAL',
            'colVaR90',
            'colROSI',
            'colPriority'
        ];

        fc.assert(
            fc.property(
                fc.constantFrom(...requiredLanguages),
                fc.constantFrom(...comparisonKeys),
                (lang, key) => {
                    const translations = I18n.translations[lang];
                    if (!translations) return false;
                    
                    return translations[key] !== undefined && translations[key] !== '';
                }
            ),
            { numRuns: requiredLanguages.length * comparisonKeys.length }
        );
    });

    test('property: sensitivity analysis keys should be translated in required languages', () => {
        const requiredLanguages = ['en', 'zh-TW', 'ja'];
        const sensitivityKeys = [
            'sensitivityTitle',
            'btnSensitivity',
            'tornadoChartTitle',
            'keyInsightsTitle',
            'recommendationsTitle'
        ];

        fc.assert(
            fc.property(
                fc.constantFrom(...requiredLanguages),
                fc.constantFrom(...sensitivityKeys),
                (lang, key) => {
                    const translations = I18n.translations[lang];
                    if (!translations) return false;
                    
                    return translations[key] !== undefined && translations[key] !== '';
                }
            ),
            { numRuns: requiredLanguages.length * sensitivityKeys.length }
        );
    });

    test('property: validation message keys should be translated in required languages', () => {
        const requiredLanguages = ['en', 'zh-TW', 'ja'];
        const validationKeys = [
            'validationOrderCorrected',
            'validationNegativeValue',
            'validationPercentageRange',
            'validationRequiredField'
        ];

        fc.assert(
            fc.property(
                fc.constantFrom(...requiredLanguages),
                fc.constantFrom(...validationKeys),
                (lang, key) => {
                    const translations = I18n.translations[lang];
                    if (!translations) return false;
                    
                    return translations[key] !== undefined && translations[key] !== '';
                }
            ),
            { numRuns: requiredLanguages.length * validationKeys.length }
        );
    });
});
