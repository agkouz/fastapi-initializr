// templateLoader.js - Handlebars Template Loader Utility

import Handlebars from 'handlebars';

// Import all template files statically
import gitignoreTemplate from '../templates/hbs/common/gitignore.hbs?raw';
import requirementsTemplate from '../templates/hbs/common/packaging/requirements.hbs?raw';
import poetryPyprojectTemplate from '../templates/hbs/common/packaging/poetry-pyproject.hbs?raw';
import uvPyprojectTemplate from '../templates/hbs/common/packaging/uv-pyproject.hbs?raw';
import pipfileTemplate from '../templates/hbs/common/packaging/pipfile.hbs?raw';

import simpleMainTemplate from '../templates/hbs/simple/app/main.hbs?raw';
import simpleEnvTemplate from '../templates/hbs/simple/config/env.hbs?raw';
import simpleReadmeTemplate from '../templates/hbs/simple/docs/readme.hbs?raw';

import structuredMainTemplate from '../templates/hbs/structured/app/main.hbs?raw';
import structuredConfigTemplate from '../templates/hbs/structured/app/config.hbs?raw';
import structuredHealthCheckRouterTemplate from '../templates/hbs/structured/routers/health-check-router.hbs?raw';
import structuredAuthRouterTemplate from '../templates/hbs/structured/routers/auth-router.hbs?raw';
import structuredEnvTemplate from '../templates/hbs/structured/config/env.hbs?raw';
import structuredReadmeTemplate from '../templates/hbs/structured/docs/readme.hbs?raw';

import enterpriseMainTemplate from '../templates/hbs/enterprise/app/main.hbs?raw';
import enterpriseConfigTemplate from '../templates/hbs/enterprise/core/config.hbs?raw';
import enterpriseDatabaseTemplate from '../templates/hbs/enterprise/core/database.hbs?raw';
import enterpriseSecurityTemplate from '../templates/hbs/enterprise/core/security.hbs?raw';
import enterpriseCrudBaseTemplate from '../templates/hbs/enterprise/crud/base.hbs?raw';
import enterpriseUserModelTemplate from '../templates/hbs/enterprise/models/user.hbs?raw';
import enterpriseUserSchemasTemplate from '../templates/hbs/enterprise/schemas/user.hbs?raw';
import enterpriseApiRouterTemplate from '../templates/hbs/enterprise/api/router.hbs?raw';
import enterpriseUsersEndpointTemplate from '../templates/hbs/enterprise/api/endpoints/users.hbs?raw';
import enterpriseReadmeTemplate from '../templates/hbs/enterprise/docs/readme.hbs?raw';
import enterpriseAlembicIniTemplate from '../templates/hbs/enterprise/alembic/ini.hbs?raw';
import enterpriseDockerfileTemplate from '../templates/hbs/enterprise/docker/dockerfile.hbs?raw';
import enterpriseDockerComposeTemplate from '../templates/hbs/enterprise/docker/docker-compose.hbs?raw';
import enterprisePytestIniTemplate from '../templates/hbs/enterprise/tests/pytest-ini.hbs?raw';
import enterpriseEnvTemplate from '../templates/hbs/enterprise/config/env.hbs?raw';
import enterpriseEnvExampleTemplate from '../templates/hbs/enterprise/config/env-example.hbs?raw';
import enterpriseGitignoreExtraTemplate from '../templates/hbs/enterprise/config/gitignore-extra.hbs?raw';
import enterpriseApiDepsTemplate from '../templates/hbs/enterprise/api/deps.hbs?raw';
import enterpriseCrudInitTemplate from '../templates/hbs/enterprise/crud/init.hbs?raw';
import enterpriseCrudUserTemplate from '../templates/hbs/enterprise/crud/user.hbs?raw';
import enterpriseModelsInitTemplate from '../templates/hbs/enterprise/models/init.hbs?raw';
import enterpriseSchemasInitTemplate from '../templates/hbs/enterprise/schemas/init.hbs?raw';
import enterpriseAlembicEnvTemplate from '../templates/hbs/enterprise/alembic/env.hbs?raw';
import enterpriseTestUsersTemplate from '../templates/hbs/enterprise/tests/test-users.hbs?raw';

// Template registry
const templateRegistry = {
    'common/gitignore.hbs': gitignoreTemplate,
    'common/packaging/requirements.hbs': requirementsTemplate,
    'common/packaging/poetry-pyproject.hbs': poetryPyprojectTemplate,
    'common/packaging/uv-pyproject.hbs': uvPyprojectTemplate,
    'common/packaging/pipfile.hbs': pipfileTemplate,

    'simple/app/main.hbs': simpleMainTemplate,
    'simple/config/env.hbs': simpleEnvTemplate,
    'simple/docs/readme.hbs': simpleReadmeTemplate,

    'structured/app/main.hbs': structuredMainTemplate,
    'structured/app/config.hbs': structuredConfigTemplate,
    'structured/routers/health-check-router.hbs': structuredHealthCheckRouterTemplate,
    'structured/routers/auth-router.hbs': structuredAuthRouterTemplate,
    'structured/config/env.hbs': structuredEnvTemplate,
    'structured/docs/readme.hbs': structuredReadmeTemplate,

    'enterprise/app/main.hbs': enterpriseMainTemplate,
    'enterprise/core/config.hbs': enterpriseConfigTemplate,
    'enterprise/core/database.hbs': enterpriseDatabaseTemplate,
    'enterprise/core/security.hbs': enterpriseSecurityTemplate,
    'enterprise/crud/base.hbs': enterpriseCrudBaseTemplate,
    'enterprise/models/user.hbs': enterpriseUserModelTemplate,
    'enterprise/schemas/user.hbs': enterpriseUserSchemasTemplate,
    'enterprise/api/router.hbs': enterpriseApiRouterTemplate,
    'enterprise/api/endpoints/users.hbs': enterpriseUsersEndpointTemplate,
    'enterprise/docs/readme.hbs': enterpriseReadmeTemplate,
    'enterprise/alembic/ini.hbs': enterpriseAlembicIniTemplate,
    'enterprise/docker/dockerfile.hbs': enterpriseDockerfileTemplate,
    'enterprise/docker/docker-compose.hbs': enterpriseDockerComposeTemplate,
    'enterprise/tests/pytest-ini.hbs': enterprisePytestIniTemplate,
    'enterprise/config/env.hbs': enterpriseEnvTemplate,
    'enterprise/config/env-example.hbs': enterpriseEnvExampleTemplate,
    'enterprise/config/gitignore-extra.hbs': enterpriseGitignoreExtraTemplate,
    'enterprise/api/deps.hbs': enterpriseApiDepsTemplate,
    'enterprise/crud/init.hbs': enterpriseCrudInitTemplate,
    'enterprise/crud/user.hbs': enterpriseCrudUserTemplate,
    'enterprise/models/init.hbs': enterpriseModelsInitTemplate,
    'enterprise/schemas/init.hbs': enterpriseSchemasInitTemplate,
    'enterprise/alembic/env.hbs': enterpriseAlembicEnvTemplate,
    'enterprise/tests/test-users.hbs': enterpriseTestUsersTemplate,
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
