// templates.js - Project File Templates

// Get .gitignore content
export function getGitignore() {
    return `__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.venv
.pytest_cache/
.ruff_cache/
*.db
.DS_Store
`;
}

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

// Generate simple main.py
export function generateSimpleMainPy(config) {
    return `from fastapi import FastAPI
${config.dependencies.includes('python-multipart') ? 'from fastapi.middleware.cors import CORSMiddleware\n' : ''}
app = FastAPI(
    title="${config.projectName}",
    description="${config.description}",
    version="0.1.0"
)

${config.dependencies.includes('python-multipart') ? `# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

` : ''}@app.get("/")
async def root():
    return {"message": "Welcome to ${config.projectName}"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;
}

// Generate structured main.py
export function generateStructuredMainPy(config) {
    return `from fastapi import FastAPI
from src.config import config
from src.routers import health_check
${config.dependencies.some(dep => dep.includes('jose') || dep.includes('passlib')) ? 'from src.routers import authentication_router\n' : ''}
app = FastAPI(
    title=config.app_name,
    version=config.version
)

// Include routers
app.include_router(health_check.router, tags=["health"])
${config.dependencies.some(dep => dep.includes('jose') || dep.includes('passlib')) ? `app.include_router(
    authentication_router.router,
    prefix="/api/v1/auth",
    tags=["authentication"]
)\n` : ''}
@app.get("/")
async def root():
    return {
        "message": f"Welcome to {config.app_name}",
        "version": config.version
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=config.debug
    )
`;
}

// Generate config.py for structured projects
export function generateConfigPy(config) {
    return `import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class AppConfig:
    def __init__(self):
        # App-wide settings
        self.debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE"
        self.app_name = os.getenv("APP_NAME", "${config.projectName}")
        self.version = os.getenv("VERSION", "0.1.0")
        
        # CORS settings
        self.cors_allow_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            os.getenv("CORS_ALLOW_ORIGINS", "")
        ]
        self.cors_allow_origins = [origin for origin in self.cors_allow_origins if origin]
        
${config.database !== 'none' ? `        # Database config
        self.database_url = os.getenv("DATABASE_URL", "${getDatabaseUrl(config.database)}")
` : ''}
# Create a global config instance
config = AppConfig()
`;
}

// Generate health check router
export function generateHealthCheckRouter() {
    return `from fastapi import APIRouter
from src.config import config

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "app_name": config.app_name,
        "version": config.version
    }
`;
}

// Generate authentication router
export function generateAuthRouter() {
    return `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # TODO: Implement authentication logic
    return {"access_token": "token", "token_type": "bearer"}

@router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    # TODO: Implement user retrieval logic
    return {"username": "current_user"}
`;
}

// Generate .env file
export function generateEnvFile(config, isSimple = false) {
    if (isSimple) {
        return `DEBUG=FALSE
APP_NAME=${config.projectName}
VERSION=0.1.0
CORS_ALLOW_ORIGINS=http://localhost:3000
`;
    }
    
    return `DEBUG=TRUE
APP_NAME=${config.projectName}
VERSION=0.1.0
CORS_ALLOW_ORIGINS=http://localhost:3000
${config.database !== 'none' ? `DATABASE_URL=${getDatabaseUrl(config.database)}\n` : ''}`;
}

// Generate README for simple structure
export function generateSimpleReadme(config, allDeps) {
    const getInstallCmd = () => {
        switch(config.packaging) {
            case 'uv': return 'uv sync';
            case 'poetry': return 'poetry install';
            case 'pipenv': return 'pipenv install';
            default: return 'pip install -r requirements.txt';
        }
    };
    
    const getRunCmd = () => {
        switch(config.packaging) {
            case 'uv': return 'uv run uvicorn main:app --reload';
            case 'poetry': return 'poetry run uvicorn main:app --reload';
            case 'pipenv': return 'pipenv run uvicorn main:app --reload';
            default: return 'uvicorn main:app --reload';
        }
    };
    
    return `# ${config.projectName}

${config.description}

## Setup

\`\`\`bash
# Install dependencies
${getInstallCmd()}

# Run the application
${getRunCmd()}
\`\`\`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
`;
}


// Generate README for structured project
export function generateStructuredReadme(config) {
    const getPackagingFile = () => {
        switch(config.packaging) {
            case 'uv':
            case 'poetry': return '└── pyproject.toml';
            case 'pipenv': return '└── Pipfile';
            default: return '└── requirements.txt';
        }
    };
    
    const getInstallCmd = () => {
        switch(config.packaging) {
            case 'uv': return 'uv sync';
            case 'poetry': return 'poetry install';
            case 'pipenv': return 'pipenv install';
            default: return 'pip install -r requirements.txt';
        }
    };
    
    const getRunCmd = () => {
        switch(config.packaging) {
            case 'uv': return 'uv run python -m src.main';
            case 'poetry': return 'poetry run python -m src.main';
            case 'pipenv': return 'pipenv run python -m src.main';
            default: return 'python -m src.main';
        }
    };
    
    const getUvicornCmd = () => {
        switch(config.packaging) {
            case 'uv': return 'uv run uvicorn src.main:app --reload';
            case 'poetry': return 'poetry run uvicorn src.main:app --reload';
            case 'pipenv': return 'pipenv run uvicorn src.main:app --reload';
            default: return 'uvicorn src.main:app --reload';
        }
    };
    
    return `# ${config.projectName}

${config.description}

## Project Structure

\`\`\`
${config.projectName}/
├── src/
│   ├── __init__.py
│   ├── main.py           # Application entry point
│   ├── config.py         # Configuration management
│   └── routers/          # API routes
│       ├── __init__.py
│       ├── health_check.py
${config.dependencies.some(dep => dep.includes('jose') || dep.includes('passlib')) ? '│       └── authentication_router.py\n' : ''}├── .env                  # Environment variables
├── .env.example          # Example environment file
├── .gitignore
${getPackagingFile()}
\`\`\`

## Setup

1. Clone the repository
2. Copy \`.env.example\` to \`.env\` and configure
3. Install dependencies:

\`\`\`bash
${getInstallCmd()}
\`\`\`

4. Run the application:

\`\`\`bash
${getRunCmd()}

# Or with uvicorn directly:
${getUvicornCmd()}
\`\`\`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Configuration

All configuration is managed through environment variables in the \`.env\` file.
See \`.env.example\` for all available options.
`;
}

// Generate Poetry pyproject.toml
export function generatePoetryConfig(config, allDeps) {
    return `[tool.poetry]
name = "${config.projectName}"
version = "0.1.0"
description = "${config.description}"
authors = ["Your Name <you@example.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^${config.pythonVersion}"
${allDeps.map(dep => `${dep} = "*"`).join('\n')}

[tool.poetry.group.dev.dependencies]
${config.dependencies.includes('pytest') ? '' : 'pytest = "*"\npytest-asyncio = "*"\n'}black = "*"
ruff = "*"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
`;
}

// Generate UV pyproject.toml
export function generateUvConfig(config, allDeps) {
    return `[project]
name = "${config.projectName}"
version = "0.1.0"
description = "${config.description}"
readme = "README.md"
requires-python = ">=${config.pythonVersion}"
dependencies = [
${allDeps.map(dep => `    "${dep}",`).join('\n')}
]

[project.optional-dependencies]
dev = [
${config.dependencies.includes('pytest') ? '' : '    "pytest",\n    "pytest-asyncio",\n'}    "black",
    "ruff",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.uv]
dev-dependencies = [
${config.dependencies.includes('pytest') ? '' : '    "pytest>=7.4.0",\n    "pytest-asyncio>=0.21.0",\n'}    "black>=23.0.0",
    "ruff>=0.1.0",
]
`;
}

// Generate Pipfile
export function generatePipfile(config, allDeps) {
    return `[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
${allDeps.map(dep => `${dep} = "*"`).join('\n')}

[dev-packages]
${config.dependencies.includes('pytest') ? '' : 'pytest = "*"\npytest-asyncio = "*"\n'}black = "*"
ruff = "*"

[requires]
python_version = "${config.pythonVersion}"
`;
}

// Generate requirements.txt
export function generateRequirementsTxt(allDeps) {
    return allDeps.join('\n');
}
