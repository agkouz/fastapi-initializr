// templates.js - Project File Templates (Handlebars-based)

import { renderTemplate } from '../utils/templateLoader.js';

// Get database URL based on database type
export function getDatabaseUrl(database) {
    const urls = {
        'postgres': 'postgresql://user:password@localhost:5432/dbname',
        'mysql': 'mysql://user:password@localhost:3306/dbname',
        'sqlite': 'sqlite:///./app.db',
        'mongodb': 'mongodb://localhost:27017/dbname'
    };
    return urls[database] || '';
}

// Get .gitignore content
export async function getGitignore() {
    return await renderTemplate('common/gitignore.hbs');
}

// Generate simple main.py
export async function generateSimpleMainPy(config) {
    return await renderTemplate('simple/main.hbs', config);
}

// Generate structured main.py
export async function generateStructuredMainPy(config) {
    return await renderTemplate('structured/main.hbs', config);
}

// Generate config.py for structured projects
export async function generateConfigPy(config) {
    const context = {
        ...config,
        databaseUrl: getDatabaseUrl(config.database)
    };
    return await renderTemplate('structured/config.hbs', context);
}

// Generate health check router
export async function generateHealthCheckRouter() {
    return await renderTemplate('structured/health-check-router.hbs');
}

// Generate authentication router
export async function generateAuthRouter() {
    return await renderTemplate('structured/auth-router.hbs');
}

// Generate .env file
export async function generateEnvFile(config, isSimple = false) {
    if (isSimple) {
        return await renderTemplate('simple/env.hbs', config);
    }

    const context = {
        ...config,
        databaseUrl: getDatabaseUrl(config.database)
    };
    return await renderTemplate('structured/env.hbs', context);
}

// Generate README for simple structure
export async function generateSimpleReadme(config, allDeps) {
    const context = {
        ...config,
        dependencies: allDeps
    };
    return await renderTemplate('simple/readme.hbs', context);
}

// Generate README for structured project
export async function generateStructuredReadme(config) {
    return await renderTemplate('structured/readme.hbs', config);
}

// Generate Poetry pyproject.toml
export async function generatePoetryConfig(config, allDeps) {
    const context = {
        ...config,
        dependencies: allDeps
    };
    return await renderTemplate('common/poetry-pyproject.hbs', context);
}

// Generate UV pyproject.toml
export async function generateUvConfig(config, allDeps) {
    const context = {
        ...config,
        dependencies: allDeps
    };
    return await renderTemplate('common/uv-pyproject.hbs', context);
}

// Generate Pipfile
export async function generatePipfile(config, allDeps) {
    const context = {
        ...config,
        dependencies: allDeps
    };
    return await renderTemplate('common/pipfile.hbs', context);
}

// Generate requirements.txt
export async function generateRequirementsTxt(allDeps) {
    return await renderTemplate('common/requirements.hbs', { dependencies: allDeps });
}
