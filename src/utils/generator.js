// generator.js - Project Generation Logic

import * as templates from '../templates.js';
import * as enterpriseTemplates from '../enterpriseTemplates.js';

// Main project generation function
export async function generateProject(config) {
    console.log('🚀 Starting project generation...', config);
    
    try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            alert('Error: JSZip library not loaded. Please refresh the page.');
            console.error('JSZip is not defined');
            return;
        }
        
        console.log('✓ JSZip available');
        
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
                'asyncpg'  // PostgreSQL async driver
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
            generateSimpleStructure(projectFolder, config, allDeps);
        } else if (config.structure === 'enterprise') {
            console.log('→ Generating enterprise structure...');
            generateEnterpriseStructure(projectFolder, config, allDeps);
        } else {
            console.log('→ Generating structured project...');
            generateStructuredProject(projectFolder, config, allDeps);
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
        alert(`✅ Project "${config.projectName}" generated successfully!`);
        
    } catch (error) {
        console.error('❌ Error generating project:', error);
        alert(`Error generating project: ${error.message}\n\nCheck the browser console for details.`);
    }
}

// Generate simple project structure
function generateSimpleStructure(projectFolder, config, allDeps) {
    // Create package files (poetry, pip, or pipenv)
    createPackagingFiles(projectFolder, config, allDeps);

    // Create simple main.py
    projectFolder.file('main.py', templates.generateSimpleMainPy(config));

    // Create .env file
    projectFolder.file('.env', templates.generateEnvFile(config, true));

    // Create README
    projectFolder.file('README.md', templates.generateSimpleReadme(config, allDeps));

    // Create .gitignore
    projectFolder.file('.gitignore', templates.getGitignore());
}

// Generate structured project
function generateStructuredProject(projectFolder, config, allDeps) {
    // Create package files
    createPackagingFiles(projectFolder, config, allDeps);

    // Create src package
    const srcFolder = projectFolder.folder('src');
    srcFolder.file('__init__.py', '');

    // Create config.py
    srcFolder.file('config.py', templates.generateConfigPy(config));

    // Create routers package
    const routersFolder = srcFolder.folder('routers');
    routersFolder.file('__init__.py', '');

    // Create health_check router
    routersFolder.file('health_check.py', templates.generateHealthCheckRouter());

    // Create authentication router if auth dependencies are included
    if (config.dependencies.some(dep => dep.includes('jose') || dep.includes('passlib'))) {
        routersFolder.file('authentication_router.py', templates.generateAuthRouter());
    }

    // Create main.py
    srcFolder.file('main.py', templates.generateStructuredMainPy(config));

    // Create .env file
    projectFolder.file('.env', templates.generateEnvFile(config, false));

    // Create .env.example
    projectFolder.file('.env.example', templates.generateEnvFile(config, false));

    // Create README
    projectFolder.file('README.md', templates.generateStructuredReadme(config));

    // Create .gitignore
    projectFolder.file('.gitignore', templates.getGitignore());
}

// Create packaging files based on selected package manager
function createPackagingFiles(projectFolder, config, allDeps) {
    if (config.packaging === 'uv') {
        projectFolder.file('pyproject.toml', templates.generateUvConfig(config, allDeps));
    } else if (config.packaging === 'poetry') {
        projectFolder.file('pyproject.toml', templates.generatePoetryConfig(config, allDeps));
    } else if (config.packaging === 'pip') {
        projectFolder.file('requirements.txt', templates.generateRequirementsTxt(allDeps));
    } else if (config.packaging === 'pipenv') {
        projectFolder.file('Pipfile', templates.generatePipfile(config, allDeps));
    }
}

// Generate enterprise/production structure
function generateEnterpriseStructure(projectFolder, config, allDeps) {
    // Create packaging files based on selection
    createPackagingFiles(projectFolder, config, allDeps);
    
    // Create app package
    const appFolder = projectFolder.folder('app');
    appFolder.file('__init__.py', '');
    appFolder.file('main.py', enterpriseTemplates.generateEnterpriseMainPy());
    
    // Create core module
    const coreFolder = appFolder.folder('core');
    coreFolder.file('__init__.py', '');
    coreFolder.file('config.py', enterpriseTemplates.generateEnterpriseConfigPy(config));
    coreFolder.file('database.py', enterpriseTemplates.generateEnterpriseDatabasePy());
    coreFolder.file('security.py', `from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
`);
    
    // Create API module
    const apiFolder = appFolder.folder('api');
    apiFolder.file('__init__.py', '');
    apiFolder.file('deps.py', `from typing import Generator
from app.core.database import get_db

# Add authentication and other dependencies here
`);
    apiFolder.file('main.py', enterpriseTemplates.generateEnterpriseAPIRouter());
    
    // Create API v1 module
    const v1Folder = apiFolder.folder('v1');
    v1Folder.file('__init__.py', '');
    
    // Create endpoints module
    const endpointsFolder = v1Folder.folder('endpoints');
    endpointsFolder.file('__init__.py', '');
    endpointsFolder.file('users.py', enterpriseTemplates.generateEnterpriseUsersEndpoint());
    
    // Create CRUD module
    const crudFolder = appFolder.folder('crud');
    crudFolder.file('__init__.py', `from .crud_user import user

__all__ = ["user"]
`);
    crudFolder.file('base.py', enterpriseTemplates.generateEnterpriseCRUDBase());
    crudFolder.file('crud_user.py', `from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    pass

user = CRUDUser(User)
`);
    
    // Create models module
    const modelsFolder = appFolder.folder('models');
    modelsFolder.file('__init__.py', `from .user import User

__all__ = ["User"]
`);
    modelsFolder.file('user.py', enterpriseTemplates.generateEnterpriseUserModel());
    
    // Create schemas module
    const schemasFolder = appFolder.folder('schemas');
    schemasFolder.file('__init__.py', `from .user import User, UserCreate, UserUpdate

__all__ = ["User", "UserCreate", "UserUpdate"]
`);
    schemasFolder.file('user.py', enterpriseTemplates.generateEnterpriseUserSchemas());
    
    // Create alembic migrations
    const alembicFolder = projectFolder.folder('alembic');
    alembicFolder.file('env.py', `from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

from app.core.config import settings
from app.core.database import Base
from app.models import *  # noqa

config = context.config
config.set_main_option("sqlalchemy.url", str(settings.SQLALCHEMY_DATABASE_URI))

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def run_migrations_online() -> None:
    import asyncio
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
`);
    
    const versionsFolder = alembicFolder.folder('versions');
    versionsFolder.file('.gitkeep', '');
    
    // Create tests module
    const testsFolder = projectFolder.folder('tests');
    testsFolder.file('__init__.py', '');
    testsFolder.file('test_users.py', `import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "username": "testuser", "password": "testpass"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
`);
    
    // Create config files
    projectFolder.file('alembic.ini', enterpriseTemplates.generateEnterpriseAlembicIni());
    projectFolder.file('Dockerfile', enterpriseTemplates.generateEnterpriseDockerfile());
    projectFolder.file('docker-compose.yml', enterpriseTemplates.generateEnterpriseDockerCompose());
    projectFolder.file('pytest.ini', enterpriseTemplates.generateEnterprisePytestIni());
    
    // Create env files
    projectFolder.file('.env', `# App Settings
APP_NAME=${config.projectName}
APP_DESCRIPTION=${config.description}
APP_VERSION=0.1.0

# Environment
ENVIRONMENT=local

# Database
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=${config.projectName.replace(/-/g, '_')}
POSTGRES_PORT=5432

# Security
SECRET_KEY=changeme-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000,http://localhost:8000

# First Superuser
FIRST_SUPERUSER_EMAIL=admin@example.com
FIRST_SUPERUSER_PASSWORD=admin
`);
    
    projectFolder.file('.env.example', `# Copy this to .env and configure

# App Settings
APP_NAME=${config.projectName}
APP_DESCRIPTION=${config.description}
APP_VERSION=0.1.0

# Environment (local, staging, production)
ENVIRONMENT=local

# Database
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=${config.projectName.replace(/-/g, '_')}
POSTGRES_PORT=5432

# Security (generate SECRET_KEY with: openssl rand -hex 32)
SECRET_KEY=changeme
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000

# First Superuser
FIRST_SUPERUSER_EMAIL=admin@example.com
FIRST_SUPERUSER_PASSWORD=changeme
`);
    
    // Create README and .gitignore
    projectFolder.file('README.md', enterpriseTemplates.generateEnterpriseReadme(config));
    projectFolder.file('.gitignore', templates.getGitignore() + `
# Alembic
alembic/versions/*.pyc
alembic/__pycache__/

# Testing
.pytest_cache/
htmlcov/
.coverage

# Docker
.dockerignore
`);
}
