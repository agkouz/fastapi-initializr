// templateLoader.js - Handlebars Template Loader Utility

import Handlebars from 'handlebars';

// Import all template files statically
import gitignoreTemplate from '../templates/hbs/common/gitignore.hbs?raw';
import requirementsTemplate from '../templates/hbs/common/requirements.hbs?raw';
import poetryPyprojectTemplate from '../templates/hbs/common/poetry-pyproject.hbs?raw';
import uvPyprojectTemplate from '../templates/hbs/common/uv-pyproject.hbs?raw';
import pipfileTemplate from '../templates/hbs/common/pipfile.hbs?raw';

import simpleMainTemplate from '../templates/hbs/simple/main.hbs?raw';
import simpleEnvTemplate from '../templates/hbs/simple/env.hbs?raw';
import simpleReadmeTemplate from '../templates/hbs/simple/readme.hbs?raw';

import structuredMainTemplate from '../templates/hbs/structured/main.hbs?raw';
import structuredConfigTemplate from '../templates/hbs/structured/config.hbs?raw';
import structuredHealthCheckRouterTemplate from '../templates/hbs/structured/health-check-router.hbs?raw';
import structuredAuthRouterTemplate from '../templates/hbs/structured/auth-router.hbs?raw';
import structuredEnvTemplate from '../templates/hbs/structured/env.hbs?raw';
import structuredReadmeTemplate from '../templates/hbs/structured/readme.hbs?raw';

import enterpriseMainTemplate from '../templates/hbs/enterprise/main.hbs?raw';
import enterpriseConfigTemplate from '../templates/hbs/enterprise/config.hbs?raw';
import enterpriseDatabaseTemplate from '../templates/hbs/enterprise/database.hbs?raw';
import enterpriseSecurityTemplate from '../templates/hbs/enterprise/security.hbs?raw';
import enterpriseCrudBaseTemplate from '../templates/hbs/enterprise/crud-base.hbs?raw';
import enterpriseUserModelTemplate from '../templates/hbs/enterprise/user-model.hbs?raw';
import enterpriseUserSchemasTemplate from '../templates/hbs/enterprise/user-schemas.hbs?raw';
import enterpriseApiRouterTemplate from '../templates/hbs/enterprise/api-router.hbs?raw';
import enterpriseUsersEndpointTemplate from '../templates/hbs/enterprise/users-endpoint.hbs?raw';
import enterpriseReadmeTemplate from '../templates/hbs/enterprise/readme.hbs?raw';
import enterpriseAlembicIniTemplate from '../templates/hbs/enterprise/alembic-ini.hbs?raw';
import enterpriseDockerfileTemplate from '../templates/hbs/enterprise/dockerfile.hbs?raw';
import enterpriseDockerComposeTemplate from '../templates/hbs/enterprise/docker-compose.hbs?raw';
import enterprisePytestIniTemplate from '../templates/hbs/enterprise/pytest-ini.hbs?raw';
import enterpriseEnvTemplate from '../templates/hbs/enterprise/env.hbs?raw';
import enterpriseEnvExampleTemplate from '../templates/hbs/enterprise/env-example.hbs?raw';
import enterpriseGitignoreExtraTemplate from '../templates/hbs/enterprise/gitignore-extra.hbs?raw';

// Template registry
const templateRegistry = {
    'common/gitignore.hbs': gitignoreTemplate,
    'common/requirements.hbs': requirementsTemplate,
    'common/poetry-pyproject.hbs': poetryPyprojectTemplate,
    'common/uv-pyproject.hbs': uvPyprojectTemplate,
    'common/pipfile.hbs': pipfileTemplate,

    'simple/main.hbs': simpleMainTemplate,
    'simple/env.hbs': simpleEnvTemplate,
    'simple/readme.hbs': simpleReadmeTemplate,

    'structured/main.hbs': structuredMainTemplate,
    'structured/config.hbs': structuredConfigTemplate,
    'structured/health-check-router.hbs': structuredHealthCheckRouterTemplate,
    'structured/auth-router.hbs': structuredAuthRouterTemplate,
    'structured/env.hbs': structuredEnvTemplate,
    'structured/readme.hbs': structuredReadmeTemplate,

    'enterprise/main.hbs': enterpriseMainTemplate,
    'enterprise/config.hbs': enterpriseConfigTemplate,
    'enterprise/database.hbs': enterpriseDatabaseTemplate,
    'enterprise/security.hbs': enterpriseSecurityTemplate,
    'enterprise/crud-base.hbs': enterpriseCrudBaseTemplate,
    'enterprise/user-model.hbs': enterpriseUserModelTemplate,
    'enterprise/user-schemas.hbs': enterpriseUserSchemasTemplate,
    'enterprise/api-router.hbs': enterpriseApiRouterTemplate,
    'enterprise/users-endpoint.hbs': enterpriseUsersEndpointTemplate,
    'enterprise/readme.hbs': enterpriseReadmeTemplate,
    'enterprise/alembic-ini.hbs': enterpriseAlembicIniTemplate,
    'enterprise/dockerfile.hbs': enterpriseDockerfileTemplate,
    'enterprise/docker-compose.hbs': enterpriseDockerComposeTemplate,
    'enterprise/pytest-ini.hbs': enterprisePytestIniTemplate,
    'enterprise/env.hbs': enterpriseEnvTemplate,
    'enterprise/env-example.hbs': enterpriseEnvExampleTemplate,
    'enterprise/gitignore-extra.hbs': enterpriseGitignoreExtraTemplate,
};

// Cache for compiled templates
const templateCache = new Map();

/**
 * Register custom Handlebars helpers
 */
function registerHelpers() {
    // Helper to check if array includes a value
    Handlebars.registerHelper('includes', function(array, value) {
        return array && array.includes(value);
    });

    // Helper to check if array includes any value from another array
    Handlebars.registerHelper('includesAny', function(array, values) {
        return array && values && array.some(dep => values.some(val => dep.includes(val)));
    });

    // Helper for equality check
    Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
    });

    // Helper for inequality check
    Handlebars.registerHelper('neq', function(a, b) {
        return a !== b;
    });

    // Helper to join array with newline
    Handlebars.registerHelper('joinLines', function(array) {
        return array ? array.join('\n') : '';
    });

    // Helper to map array and join
    Handlebars.registerHelper('mapJoin', function(array, prefix, suffix, separator) {
        if (!array) return '';
        return array.map(item => `${prefix}${item}${suffix}`).join(separator);
    });

    // Helper to replace string
    Handlebars.registerHelper('replace', function(str, search, replace) {
        if (!str) return '';
        return str.replace(new RegExp(search, 'g'), replace);
    });
}

// Register helpers on module load
registerHelpers();

/**
 * Load and compile a Handlebars template
 * @param {string} templatePath - Path to the template file (relative to src/templates/hbs/)
 * @returns {Function} Compiled Handlebars template function
 */
export async function loadTemplate(templatePath) {
    // Check cache first
    if (templateCache.has(templatePath)) {
        return templateCache.get(templatePath);
    }

    try {
        // Get template source from registry
        const templateSource = templateRegistry[templatePath];

        if (!templateSource) {
            throw new Error(`Template not found in registry: ${templatePath}`);
        }

        // Compile the template
        const compiledTemplate = Handlebars.compile(templateSource);

        // Cache it
        templateCache.set(templatePath, compiledTemplate);

        return compiledTemplate;
    } catch (error) {
        console.error(`Error loading template ${templatePath}:`, error);
        throw new Error(`Failed to load template: ${templatePath}`);
    }
}

/**
 * Render a template with given context
 * @param {string} templatePath - Path to the template file
 * @param {Object} context - Data to pass to the template
 * @returns {Promise<string>} Rendered template string
 */
export async function renderTemplate(templatePath, context = {}) {
    const template = await loadTemplate(templatePath);
    return template(context);
}

/**
 * Clear the template cache (useful for development/testing)
 */
export function clearTemplateCache() {
    templateCache.clear();
}
