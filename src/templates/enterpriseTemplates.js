// enterprise-templates.js - Enterprise/Production Structure Templates (Handlebars-based)
// Based on https://github.com/benavlabs/FastAPI-boilerplate

import { renderTemplate } from '../utils/templateLoader.js';

// Generate main.py for enterprise structure
export async function generateEnterpriseMainPy() {
    return await renderTemplate('enterprise/app/main.hbs');
}

// Generate config.py for enterprise structure
export async function generateEnterpriseConfigPy(config) {
    return await renderTemplate('enterprise/core/config.hbs', config);
}

// Generate database.py for enterprise structure
export async function generateEnterpriseDatabasePy() {
    return await renderTemplate('enterprise/core/database.hbs');
}

// Generate base CRUD operations
export async function generateEnterpriseCRUDBase() {
    return await renderTemplate('enterprise/crud/base.hbs');
}

// Generate user model
export async function generateEnterpriseUserModel() {
    return await renderTemplate('enterprise/models/user.hbs');
}

// Generate user schemas
export async function generateEnterpriseUserSchemas() {
    return await renderTemplate('enterprise/schemas/user.hbs');
}

// Generate API router
export async function generateEnterpriseAPIRouter() {
    return await renderTemplate('enterprise/api/router.hbs');
}

// Generate users endpoint
export async function generateEnterpriseUsersEndpoint() {
    return await renderTemplate('enterprise/api/endpoints/users.hbs');
}

// Generate alembic.ini
export async function generateEnterpriseAlembicIni() {
    return await renderTemplate('enterprise/alembic/ini.hbs');
}

// Generate Dockerfile
export async function generateEnterpriseDockerfile() {
    return await renderTemplate('enterprise/docker/dockerfile.hbs');
}

// Generate docker-compose.yml
export async function generateEnterpriseDockerCompose() {
    return await renderTemplate('enterprise/docker/docker-compose.hbs');
}

// Generate pytest configuration
export async function generateEnterprisePytestIni() {
    return await renderTemplate('enterprise/tests/pytest-ini.hbs');
}

// Generate enterprise README
export async function generateEnterpriseReadme(config) {
    return await renderTemplate('enterprise/docs/readme.hbs', config);
}

// Generate security.py for enterprise structure
export async function generateEnterpriseSecurityPy() {
    return await renderTemplate('enterprise/core/security.hbs');
}

// Generate enterprise .env file
export async function generateEnterpriseEnv(config) {
    return await renderTemplate('enterprise/config/env.hbs', config);
}

// Generate enterprise .env.example file
export async function generateEnterpriseEnvExample(config) {
    return await renderTemplate('enterprise/config/env-example.hbs', config);
}

// Generate enterprise gitignore extra content
export async function generateEnterpriseGitignoreExtra() {
    return await renderTemplate('enterprise/config/gitignore-extra.hbs');
}

// Generate API deps.py
export async function generateEnterpriseApiDeps() {
    return await renderTemplate('enterprise/api/deps.hbs');
}

// Generate CRUD __init__.py
export async function generateEnterpriseCrudInit() {
    return await renderTemplate('enterprise/crud/init.hbs');
}

// Generate crud_user.py
export async function generateEnterpriseCrudUser() {
    return await renderTemplate('enterprise/crud/user.hbs');
}

// Generate models __init__.py
export async function generateEnterpriseModelsInit() {
    return await renderTemplate('enterprise/models/init.hbs');
}

// Generate schemas __init__.py
export async function generateEnterpriseSchemasInit() {
    return await renderTemplate('enterprise/schemas/init.hbs');
}

// Generate alembic env.py
export async function generateEnterpriseAlembicEnv() {
    return await renderTemplate('enterprise/alembic/env.hbs');
}

// Generate test_users.py
export async function generateEnterpriseTestUsers() {
    return await renderTemplate('enterprise/tests/test-users.hbs');
}
