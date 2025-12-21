# Template Folder Structure

This document describes the reorganized Handlebars template structure for better maintainability.

## Overview

Templates are organized by project type and functionality, making it easier to locate and maintain specific template files.

## Directory Structure

```
src/templates/hbs/
├── common/
│   ├── gitignore.hbs
│   └── packaging/
│       ├── requirements.hbs
│       ├── poetry-pyproject.hbs
│       ├── uv-pyproject.hbs
│       └── pipfile.hbs
├── simple/
│   ├── app/
│   │   └── main.hbs
│   ├── config/
│   │   └── env.hbs
│   └── docs/
│       └── readme.hbs
├── structured/
│   ├── app/
│   │   ├── main.hbs
│   │   └── config.hbs
│   ├── routers/
│   │   ├── auth-router.hbs
│   │   └── health-check-router.hbs
│   ├── config/
│   │   └── env.hbs
│   └── docs/
│       └── readme.hbs
└── enterprise/
    ├── app/
    │   └── main.hbs
    ├── core/
    │   ├── config.hbs
    │   ├── database.hbs
    │   └── security.hbs
    ├── api/
    │   ├── deps.hbs
    │   ├── router.hbs
    │   └── endpoints/
    │       └── users.hbs
    ├── crud/
    │   ├── init.hbs
    │   ├── base.hbs
    │   └── user.hbs
    ├── models/
    │   ├── init.hbs
    │   └── user.hbs
    ├── schemas/
    │   ├── init.hbs
    │   └── user.hbs
    ├── alembic/
    │   ├── ini.hbs
    │   └── env.hbs
    ├── docker/
    │   ├── dockerfile.hbs
    │   └── docker-compose.hbs
    ├── tests/
    │   ├── pytest-ini.hbs
    │   └── test-users.hbs
    ├── config/
    │   ├── env.hbs
    │   ├── env-example.hbs
    │   └── gitignore-extra.hbs
    └── docs/
        └── readme.hbs
```

## Organization Principles

### 1. Common Templates
- **Location**: `common/`
- **Purpose**: Shared templates used across all project types
- **Subdirectories**:
  - `packaging/`: Package manager configurations (pip, poetry, uv, pipenv)

### 2. Simple Templates
- **Location**: `simple/`
- **Purpose**: Minimal FastAPI project structure
- **Subdirectories**:
  - `app/`: Application entry point
  - `config/`: Configuration files
  - `docs/`: Documentation

### 3. Structured Templates
- **Location**: `structured/`
- **Purpose**: Organized FastAPI project with routers
- **Subdirectories**:
  - `app/`: Main application and config
  - `routers/`: API route handlers
  - `config/`: Environment configuration
  - `docs/`: Documentation

### 4. Enterprise Templates
- **Location**: `enterprise/`
- **Purpose**: Production-ready FastAPI project with full features
- **Subdirectories**:
  - `app/`: Application entry point
  - `core/`: Core functionality (config, database, security)
  - `api/`: API layer (dependencies, routers, endpoints)
  - `crud/`: Database CRUD operations
  - `models/`: SQLAlchemy models
  - `schemas/`: Pydantic schemas
  - `alembic/`: Database migrations
  - `docker/`: Container configuration
  - `tests/`: Test files
  - `config/`: Environment and configuration files
  - `docs/`: Documentation

## Benefits of This Structure

1. **Logical Grouping**: Related templates are organized together
2. **Easy Navigation**: Folder names clearly indicate purpose
3. **Scalability**: Easy to add new templates to appropriate subdirectories
4. **Maintainability**: Changes to specific functionality are easier to locate
5. **Clear Separation**: Project types (simple/structured/enterprise) are clearly separated

## Template Path Examples

- Common gitignore: `common/gitignore.hbs`
- Poetry config: `common/packaging/poetry-pyproject.hbs`
- Simple main: `simple/app/main.hbs`
- Structured router: `structured/routers/auth-router.hbs`
- Enterprise model: `enterprise/models/user.hbs`
- Enterprise API endpoint: `enterprise/api/endpoints/users.hbs`
