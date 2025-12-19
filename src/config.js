// config.js - Configuration and Constants

export const CURATED_PACKAGES = {
    database: ['sqlalchemy', 'alembic', 'tortoise-orm', 'sqlmodel', 'databases', 'motor', 'redis', 'pymongo', 'psycopg2-binary', 'asyncpg', 'aiomysql'],
    auth: ['python-jose[cryptography]', 'passlib[bcrypt]', 'authlib', 'pyjwt', 'python-multipart'],
    api: ['httpx', 'requests', 'aiohttp', 'websockets', 'graphene', 'strawberry-graphql', 'email-validator', 'python-slugify'],
    testing: ['pytest', 'pytest-asyncio', 'pytest-cov', 'faker', 'factory-boy', 'hypothesis'],
    monitoring: ['prometheus-client', 'sentry-sdk', 'structlog', 'loguru', 'opentelemetry-api'],
    async: ['celery', 'arq', 'dramatiq', 'rq'],
    config: ['pydantic-settings', 'python-decouple', 'dynaconf'],
    templates: ['jinja2', 'aiofiles', 'pillow'],
    validation: ['marshmallow'],
    utils: ['arrow', 'python-dateutil', 'click', 'typer', 'rich']
};

export const FALLBACK_DATABASE = [
    { id: 'sqlalchemy', name: 'SQLAlchemy', package: 'sqlalchemy', description: 'SQL toolkit and ORM', category: 'database' },
    { id: 'alembic', name: 'Alembic', package: 'alembic', description: 'Database migration tool', category: 'database' },
    { id: 'tortoise_orm', name: 'Tortoise ORM', package: 'tortoise-orm', description: 'Async ORM inspired by Django', category: 'database' },
    { id: 'sqlmodel', name: 'SQLModel', package: 'sqlmodel', description: 'SQL databases with Python types', category: 'database' },
    { id: 'databases', name: 'Databases', package: 'databases', description: 'Async database support', category: 'database' },
    { id: 'motor', name: 'Motor', package: 'motor', description: 'Async MongoDB driver', category: 'database' },
    { id: 'redis', name: 'Redis', package: 'redis', description: 'Redis client for caching', category: 'database' },
    { id: 'pymongo', name: 'PyMongo', package: 'pymongo', description: 'MongoDB driver', category: 'database' },
    { id: 'psycopg2_binary', name: 'Psycopg2', package: 'psycopg2-binary', description: 'PostgreSQL adapter', category: 'database' },
    { id: 'asyncpg', name: 'AsyncPG', package: 'asyncpg', description: 'Fast PostgreSQL driver', category: 'database' },
    { id: 'aiomysql', name: 'AioMySQL', package: 'aiomysql', description: 'Async MySQL driver', category: 'database' },
    
    { id: 'python_jose', name: 'JWT Auth', package: 'python-jose[cryptography]', description: 'JSON Web Token authentication', category: 'auth' },
    { id: 'passlib', name: 'Passlib', package: 'passlib[bcrypt]', description: 'Secure password hashing', category: 'auth' },
    { id: 'authlib', name: 'Authlib', package: 'authlib', description: 'OAuth and OpenID Connect', category: 'auth' },
    { id: 'pyjwt', name: 'PyJWT', package: 'pyjwt', description: 'JWT implementation', category: 'auth' },
    { id: 'python_multipart', name: 'Multipart', package: 'python-multipart', description: 'Form data parsing', category: 'auth' },
    
    { id: 'httpx', name: 'HTTPX', package: 'httpx', description: 'Async HTTP client', category: 'api' },
    { id: 'requests', name: 'Requests', package: 'requests', description: 'HTTP library', category: 'api' },
    { id: 'aiohttp', name: 'Aiohttp', package: 'aiohttp', description: 'Async HTTP client/server', category: 'api' },
    { id: 'websockets', name: 'WebSockets', package: 'websockets', description: 'WebSocket support', category: 'api' },
    { id: 'graphene', name: 'Graphene', package: 'graphene', description: 'GraphQL framework', category: 'api' },
    { id: 'strawberry_graphql', name: 'Strawberry', package: 'strawberry-graphql', description: 'Type-safe GraphQL', category: 'api' },
    { id: 'email_validator', name: 'Email Validator', package: 'email-validator', description: 'Email validation', category: 'api' },
    { id: 'python_slugify', name: 'Slugify', package: 'python-slugify', description: 'Slug generation', category: 'api' },
    
    { id: 'pytest', name: 'Pytest', package: 'pytest', description: 'Testing framework', category: 'testing' },
    { id: 'pytest_asyncio', name: 'Pytest Asyncio', package: 'pytest-asyncio', description: 'Async testing support', category: 'testing' },
    { id: 'pytest_cov', name: 'Pytest Coverage', package: 'pytest-cov', description: 'Code coverage plugin', category: 'testing' },
    { id: 'faker', name: 'Faker', package: 'faker', description: 'Test data generation', category: 'testing' },
    { id: 'factory_boy', name: 'Factory Boy', package: 'factory-boy', description: 'Test fixtures', category: 'testing' },
    { id: 'hypothesis', name: 'Hypothesis', package: 'hypothesis', description: 'Property-based testing', category: 'testing' },
    
    { id: 'prometheus_client', name: 'Prometheus', package: 'prometheus-client', description: 'Metrics and monitoring', category: 'monitoring' },
    { id: 'sentry_sdk', name: 'Sentry', package: 'sentry-sdk', description: 'Error tracking', category: 'monitoring' },
    { id: 'structlog', name: 'Structlog', package: 'structlog', description: 'Structured logging', category: 'monitoring' },
    { id: 'loguru', name: 'Loguru', package: 'loguru', description: 'Easy logging', category: 'monitoring' },
    { id: 'opentelemetry_api', name: 'OpenTelemetry', package: 'opentelemetry-api', description: 'Observability framework', category: 'monitoring' },
    
    { id: 'celery', name: 'Celery', package: 'celery', description: 'Distributed task queue', category: 'async' },
    { id: 'arq', name: 'ARQ', package: 'arq', description: 'Fast async job queues', category: 'async' },
    { id: 'dramatiq', name: 'Dramatiq', package: 'dramatiq', description: 'Task processing', category: 'async' },
    { id: 'rq', name: 'RQ', package: 'rq', description: 'Simple job queues', category: 'async' },
    
    { id: 'pydantic_settings', name: 'Pydantic Settings', package: 'pydantic-settings', description: 'Settings management', category: 'config' },
    { id: 'python_decouple', name: 'Python Decouple', package: 'python-decouple', description: 'Settings from env', category: 'config' },
    { id: 'dynaconf', name: 'Dynaconf', package: 'dynaconf', description: 'Dynamic configuration', category: 'config' },
    
    { id: 'jinja2', name: 'Jinja2', package: 'jinja2', description: 'Templating engine', category: 'templates' },
    { id: 'aiofiles', name: 'Aiofiles', package: 'aiofiles', description: 'Async file operations', category: 'templates' },
    { id: 'pillow', name: 'Pillow', package: 'pillow', description: 'Image processing', category: 'templates' },
    
    { id: 'marshmallow', name: 'Marshmallow', package: 'marshmallow', description: 'Object serialization', category: 'validation' },
    
    { id: 'arrow', name: 'Arrow', package: 'arrow', description: 'Better dates and times', category: 'utils' },
    { id: 'python_dateutil', name: 'Dateutil', package: 'python-dateutil', description: 'Date/time utilities', category: 'utils' },
    { id: 'click', name: 'Click', package: 'click', description: 'CLI creation', category: 'utils' },
    { id: 'typer', name: 'Typer', package: 'typer', description: 'Modern CLI framework', category: 'utils' },
    { id: 'rich', name: 'Rich', package: 'rich', description: 'Rich text and formatting', category: 'utils' }
];

export const PROJECT_STRUCTURES = {
    simple: {
        title: 'Simple',
        description: 'Single file structure - Perfect for learning, prototypes, and simple APIs'
    },
    structured: {
        title: 'Structured',
        description: 'Organized package structure with routers and config - Production-ready for most projects'
    },
    enterprise: {
        title: 'Enterprise',
        description: 'Complete production boilerplate with API versioning, CRUD, migrations, testing, Docker - based on benavlabs/FastAPI-boilerplate'
    }
};
