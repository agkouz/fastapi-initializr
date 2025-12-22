import JSZip from "jszip";
// generator.js - Project Generation Logic

import * as templates from '../templates/templates.js';
import * as enterpriseTemplates from '../templates/enterpriseTemplates.js';

// Main project generation function
export async function generateProject(config) {
    console.log('🚀 Starting project generation...', config);
    
    try {
        
        const zip = new JSZip();
        const projectFolder = zip.folder(config.projectName);
        console.log('✓ ZIP folder created:', config.projectName);

        // Generate dependencies list
        const allDeps = ['fastapi', 'uvicorn[standard]', ...config.dependencies];
        
        // Add python-dotenv if structured
        if (config.structure === 'structured' && !allDeps.includes('python-dotenv')) {
            allDeps.push('python-dotenv');
        }
        
        // Add enterprise dependencies if enterprise structure
        if (config.structure === 'enterprise') {
            const enterpriseDeps = [
                'sqlalchemy[asyncio]',
                'alembic',
                'pydantic-settings',
                'python-jose[cryptography]',
                'passlib[bcrypt]',
                'python-multipart',
                'email-validator',
                'asyncpg',  // PostgreSQL async driver
                'loguru'   // Logging
            ];
            enterpriseDeps.forEach(dep => {
                if (!allDeps.includes(dep)) {
                    allDeps.push(dep);
                }
            });
        }
        
        // Add database driver if needed
        const dbDrivers = {
            'postgres': 'psycopg2-binary',
            'mysql': 'pymysql',
            'mongodb': 'motor'
        };
        if (config.database !== 'none' && dbDrivers[config.database]) {
            allDeps.push(dbDrivers[config.database]);
        }

        console.log('✓ Dependencies prepared:', allDeps.length, 'packages');

        // Create package structure based on selection
        if (config.structure === 'simple') {
            console.log('→ Generating simple structure...');
            await generateSimpleStructure(projectFolder, config, allDeps);
        } else if (config.structure === 'enterprise') {
            console.log('→ Generating enterprise structure...');
            await generateEnterpriseStructure(projectFolder, config, allDeps);
        } else {
            console.log('→ Generating structured project...');
            await generateStructuredProject(projectFolder, config, allDeps);
        }
        
        console.log('✓ Project structure created');

        // Generate and download zip
        console.log('→ Generating ZIP file...');
        const content = await zip.generateAsync({ type: 'blob' });
        console.log('✓ ZIP generated:', content.size, 'bytes');
        
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.projectName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Project generated successfully!');
        
    } catch (error) {
        console.error('❌ Error generating project:', error);
        alert(`Error generating project: ${error.message}\n\nCheck the browser console for details.`);
    }
}

// Generate simple project structure
async function generateSimpleStructure(projectFolder, config, allDeps) {
    // Create package files (poetry, pip, or pipenv)
    await createPackagingFiles(projectFolder, config, allDeps);

    // Create simple main.py
    projectFolder.file('main.py', await templates.generateSimpleMainPy(config));

    // Create .env file
    projectFolder.file('.env', await templates.generateEnvFile(config, true));

    // Create README
    projectFolder.file('README.md', await templates.generateSimpleReadme(config, allDeps));

    // Create .gitignore
    projectFolder.file('.gitignore', await templates.getGitignore());
}

// Generate structured project
async function generateStructuredProject(projectFolder, config, allDeps) {
    // Create package files
    await createPackagingFiles(projectFolder, config, allDeps);

    // Create src package
    const srcFolder = projectFolder.folder('src');
    srcFolder.file('__init__.py', '');

    // Create config.py
    srcFolder.file('config.py', await templates.generateConfigPy(config));

    // Create routers package
    const routersFolder = srcFolder.folder('routers');
    routersFolder.file('__init__.py', '');

    // Create health_check router
    routersFolder.file('health_check.py', await templates.generateHealthCheckRouter());

    // Create authentication router if auth dependencies are included
    if (config.dependencies.some(dep => dep.includes('jose') || dep.includes('passlib'))) {
        routersFolder.file('authentication_router.py', await templates.generateAuthRouter());
    }

    // Create main.py
    srcFolder.file('main.py', await templates.generateStructuredMainPy(config));

    // Create .env file
    projectFolder.file('.env', await templates.generateEnvFile(config, false));

    // Create .env.example
    projectFolder.file('.env.example', await templates.generateEnvFile(config, false));

    // Create README
    projectFolder.file('README.md', await templates.generateStructuredReadme(config));

    // Create .gitignore
    projectFolder.file('.gitignore', await templates.getGitignore());
}

// Create packaging files based on selected package manager
async function createPackagingFiles(projectFolder, config, allDeps) {
    if (config.packaging === 'uv') {
        projectFolder.file('pyproject.toml', await templates.generateUvConfig(config, allDeps));
    } else if (config.packaging === 'poetry') {
        projectFolder.file('pyproject.toml', await templates.generatePoetryConfig(config, allDeps));
    } else if (config.packaging === 'pip') {
        projectFolder.file('requirements.txt', await templates.generateRequirementsTxt(allDeps));
    } else if (config.packaging === 'pipenv') {
        projectFolder.file('Pipfile', await templates.generatePipfile(config, allDeps));
    }
}

// Generate enterprise/production structure
async function generateEnterpriseStructure(projectFolder, config, allDeps) {
    // Create packaging files based on selection
    await createPackagingFiles(projectFolder, config, allDeps);
    
    // Create app package
    const appFolder = projectFolder.folder('app');
    appFolder.file('__init__.py', '');
    appFolder.file('main.py', await enterpriseTemplates.generateEnterpriseMainPy());
    
    // Create core module
    const coreFolder = appFolder.folder('core');
    coreFolder.file('__init__.py', '');
    coreFolder.file('config.py', await enterpriseTemplates.generateEnterpriseConfigPy(config));
    coreFolder.file('database.py', await enterpriseTemplates.generateEnterpriseDatabasePy());
    coreFolder.file('security.py', await enterpriseTemplates.generateEnterpriseSecurityPy());
    coreFolder.file('logger.py', await enterpriseTemplates.generateEnterpriseLogger());
    coreFolder.file('setup.py', await enterpriseTemplates.generateEnterpriseSetup());

    // Create API module
    const apiFolder = appFolder.folder('api');
    apiFolder.file('__init__.py', '');
    apiFolder.file('dependencies.py', await enterpriseTemplates.generateEnterpriseApiDependencies());

    // Create API v1 module
    const v1Folder = apiFolder.folder('v1');
    v1Folder.file('__init__.py', '');
    v1Folder.file('users.py', await enterpriseTemplates.generateEnterpriseUsersEndpoint());
    
    // Create CRUD module
    const crudFolder = appFolder.folder('crud');
    crudFolder.file('__init__.py', await enterpriseTemplates.generateEnterpriseCrudInit());
    crudFolder.file('base.py', await enterpriseTemplates.generateEnterpriseCRUDBase());
    crudFolder.file('crud_user.py', await enterpriseTemplates.generateEnterpriseCrudUser());
    
    // Create models module
    const modelsFolder = appFolder.folder('models');
    modelsFolder.file('__init__.py', await enterpriseTemplates.generateEnterpriseModelsInit());
    modelsFolder.file('user.py', await enterpriseTemplates.generateEnterpriseUserModel());
    
    // Create schemas module
    const schemasFolder = appFolder.folder('schemas');
    schemasFolder.file('__init__.py', await enterpriseTemplates.generateEnterpriseSchemasInit());
    schemasFolder.file('user.py', await enterpriseTemplates.generateEnterpriseUserSchemas());
    
    // Create alembic migrations
    const alembicFolder = projectFolder.folder('alembic');
    alembicFolder.file('env.py', await enterpriseTemplates.generateEnterpriseAlembicEnv());
    
    const versionsFolder = alembicFolder.folder('versions');
    versionsFolder.file('.gitkeep', '');
    
    // Create tests module
    const testsFolder = projectFolder.folder('tests');
    testsFolder.file('__init__.py', '');
    testsFolder.file('test_users.py', await enterpriseTemplates.generateEnterpriseTestUsers());
    
    // Create config files
    projectFolder.file('alembic.ini', await enterpriseTemplates.generateEnterpriseAlembicIni());
    projectFolder.file('Dockerfile', await enterpriseTemplates.generateEnterpriseDockerfile());
    projectFolder.file('docker-compose.yml', await enterpriseTemplates.generateEnterpriseDockerCompose());
    projectFolder.file('pytest.ini', await enterpriseTemplates.generateEnterprisePytestIni());
    
    // Create env files
    projectFolder.file('.env', await enterpriseTemplates.generateEnterpriseEnv(config));
    projectFolder.file('.env.example', await enterpriseTemplates.generateEnterpriseEnvExample(config));
    
    // Create README and .gitignore
    projectFolder.file('README.md', await enterpriseTemplates.generateEnterpriseReadme(config));
    projectFolder.file('.gitignore', await templates.getGitignore() + await enterpriseTemplates.generateEnterpriseGitignoreExtra());
}
