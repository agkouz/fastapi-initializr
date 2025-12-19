// enterprise-templates.js - Enterprise/Production Structure Templates
// Based on https://github.com/benavlabs/FastAPI-boilerplate

// Generate main.py for enterprise structure
export function generateEnterpriseMainPy() {
    return `from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.ENVIRONMENT == "local" else None,
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
`;
}

// Generate config.py for enterprise structure
export function generateEnterpriseConfigPy(config) {
    return `from typing import Any, List
from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # App Settings
    APP_NAME: str = "${config.projectName}"
    APP_DESCRIPTION: str = "${config.description}"
    APP_VERSION: str = "0.1.0"
    CONTACT_NAME: str = ""
    CONTACT_EMAIL: str = ""
    LICENSE_NAME: str = ""
    
    # Environment
    ENVIRONMENT: str = "local"  # local, staging, production
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "${config.projectName.replace(/-/g, '_')}"
    POSTGRES_PORT: int = 5432
    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str | None, info) -> Any:
        if isinstance(v, str):
            return v
        data = info.data
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=data.get("POSTGRES_USER"),
            password=data.get("POSTGRES_PASSWORD"),
            host=data.get("POSTGRES_SERVER"),
            port=data.get("POSTGRES_PORT"),
            path=f"{data.get('POSTGRES_DB') or ''}",
        )
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Redis (optional)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # First Superuser
    FIRST_SUPERUSER_EMAIL: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"


settings = Settings()
`;
}

// Generate database.py for enterprise structure
export function generateEnterpriseDatabasePy() {
    return `from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=False, future=True)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
`;
}

// Generate base CRUD operations
export function generateEnterpriseCRUDBase() {
    return `from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        """
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        result = await db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> ModelType:
        obj = await self.get(db, id=id)
        await db.delete(obj)
        await db.commit()
        return obj
`;
}

// Generate user model
export function generateEnterpriseUserModel() {
    return `from sqlalchemy import Boolean, Column, Integer, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
`;
}

// Generate user schemas
export function generateEnterpriseUserSchemas() {
    return `from pydantic import BaseModel, EmailStr


# Shared properties
class UserBase(BaseModel):
    email: EmailStr | None = None
    username: str | None = None
    is_active: bool = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    username: str
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: str | None = None


class UserInDBBase(UserBase):
    id: int | None = None

    class Config:
        from_attributes = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
`;
}

// Generate API router
export function generateEnterpriseAPIRouter() {
    return `from fastapi import APIRouter

from app.api.v1.endpoints import users

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
`;
}

// Generate users endpoint
export function generateEnterpriseUsersEndpoint() {
    return `from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api import deps
from app.core.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.User])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users.
    """
    users = await crud.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.User)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = await crud.user.create(db, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=schemas.User)
async def read_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = await crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user
`;
}

// Generate alembic.ini
export function generateEnterpriseAlembicIni() {
    return `[alembic]
script_location = alembic
prepend_sys_path = .
version_path_separator = os

[post_write_hooks]

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
`;
}

// Generate Dockerfile
export function generateEnterpriseDockerfile() {
    return `FROM python:3.12-slim

WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    postgresql-client \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY ./app /code/app
COPY ./alembic /code/alembic
COPY alembic.ini /code/alembic.ini

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
`;
}

// Generate docker-compose.yml
export function generateEnterpriseDockerCompose() {
    return `version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_DB=\${POSTGRES_DB}
    ports:
      - "5432:5432"

  web:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./app:/code/app
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db

volumes:
  postgres_data:
`;
}

// Generate pytest configuration
export function generateEnterprisePytestIni() {
    return `[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
addopts = "-v -s"
`;
}

// Generate enterprise README
export function generateEnterpriseReadme(config) {
    return `# ${config.projectName}

${config.description}

## Enterprise FastAPI Boilerplate

This project is based on the production-ready FastAPI boilerplate structure from [benavlabs/FastAPI-boilerplate](https://github.com/benavlabs/FastAPI-boilerplate).

## Features

- ⚡️ **FastAPI** - Modern, fast web framework
- 🗄️ **SQLAlchemy 2.0** - Async ORM
- 🐘 **PostgreSQL** - Production database
- 🔐 **JWT Authentication** - Secure authentication
- 📝 **Alembic** - Database migrations
- 🐳 **Docker** - Containerization ready
- 🧪 **Pytest** - Testing framework
- 📊 **Pydantic V2** - Data validation
- 🎯 **CRUD Operations** - Pre-built patterns
- 📁 **Organized Structure** - Scalable architecture

## Project Structure

\`\`\`
${config.projectName}/
├── app/
│   ├── __init__.py
│   ├── main.py              # Application entry point
│   ├── api/                 # API endpoints
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies
│   │   ├── main.py          # API router
│   │   └── v1/              # API version 1
│   │       ├── __init__.py
│   │       └── endpoints/   # Endpoint modules
│   │           ├── __init__.py
│   │           └── users.py
│   ├── core/                # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── security.py      # Security utilities
│   ├── crud/                # CRUD operations
│   │   ├── __init__.py
│   │   ├── base.py          # Base CRUD
│   │   └── crud_user.py     # User CRUD
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── user.py
│   └── schemas/             # Pydantic schemas
│       ├── __init__.py
│       └── user.py
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── tests/                   # Test files
│   ├── __init__.py
│   └── test_users.py
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore
├── alembic.ini              # Alembic configuration
├── docker-compose.yml       # Docker Compose
├── Dockerfile               # Docker image
├── ${config.packaging === 'uv' || config.packaging === 'poetry' ? 'pyproject.toml' : config.packaging === 'pipenv' ? 'Pipfile' : 'requirements.txt'}         # Python dependencies
└── README.md                # This file
\`\`\`

## Quick Start

### 1. Set up environment variables

Copy the example env file:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and configure your settings.

### 2. Run with Docker (Recommended)

\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Run locally

Install dependencies:
\`\`\`bash
${config.packaging === 'uv' ? 'uv sync' : config.packaging === 'poetry' ? 'poetry install' : config.packaging === 'pipenv' ? 'pipenv install' : 'pip install -r requirements.txt'}
\`\`\`

Run database migrations:
\`\`\`bash
${config.packaging === 'uv' ? 'uv run alembic upgrade head' : config.packaging === 'poetry' ? 'poetry run alembic upgrade head' : config.packaging === 'pipenv' ? 'pipenv run alembic upgrade head' : 'alembic upgrade head'}
\`\`\`

Start the application:
\`\`\`bash
${config.packaging === 'uv' ? 'uv run uvicorn app.main:app --reload' : config.packaging === 'poetry' ? 'poetry run uvicorn app.main:app --reload' : config.packaging === 'pipenv' ? 'pipenv run uvicorn app.main:app --reload' : 'uvicorn app.main:app --reload'}
\`\`\`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc

## Database Migrations

Create a new migration:
\`\`\`bash
${config.packaging === 'uv' ? 'uv run alembic revision --autogenerate -m "Description"' : config.packaging === 'poetry' ? 'poetry run alembic revision --autogenerate -m "Description"' : config.packaging === 'pipenv' ? 'pipenv run alembic revision --autogenerate -m "Description"' : 'alembic revision --autogenerate -m "Description"'}
\`\`\`

Apply migrations:
\`\`\`bash
${config.packaging === 'uv' ? 'uv run alembic upgrade head' : config.packaging === 'poetry' ? 'poetry run alembic upgrade head' : config.packaging === 'pipenv' ? 'pipenv run alembic upgrade head' : 'alembic upgrade head'}
\`\`\`

Rollback migration:
\`\`\`bash
alembic downgrade -1
\`\`\`

## Testing

Run tests:
\`\`\`bash
pytest
\`\`\`

Run with coverage:
\`\`\`bash
pytest --cov=app tests/
\`\`\`

## Development

The application uses:
- **FastAPI** for the API framework
- **SQLAlchemy 2.0** with async support
- **Pydantic V2** for data validation
- **Alembic** for database migrations
- **PostgreSQL** as the database

## Adding New Endpoints

1. Create a new endpoint file in \`app/api/v1/endpoints/\`
2. Define your routes using FastAPI router
3. Add CRUD operations in \`app/crud/\`
4. Define models in \`app/models/\`
5. Define schemas in \`app/schemas/\`
6. Include router in \`app/api/v1/__init__.py\`

## Production Deployment

For production, consider:
- Using Gunicorn with Uvicorn workers
- Setting up NGINX as reverse proxy
- Configuring proper CORS origins
- Using environment variables for secrets
- Setting up monitoring and logging
- Implementing rate limiting
- Adding Redis for caching

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Pydantic V2 Documentation](https://docs.pydantic.dev/latest/)
- [Original Boilerplate](https://github.com/benavlabs/FastAPI-boilerplate)

## License

This project structure is based on the FastAPI boilerplate by benavlabs.
`;
}
