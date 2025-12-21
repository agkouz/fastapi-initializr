import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../utils/templateLoader.js';

describe('Template Loader', () => {
  describe('Common Templates', () => {
    it('should render gitignore template', async () => {
      const result = await renderTemplate('common/gitignore.hbs');
      expect(result).toContain('__pycache__/');
      expect(result).toContain('*.py[cod]');
      expect(result).toContain('.env');
    });

    it('should render requirements template', async () => {
      const result = await renderTemplate('common/requirements.hbs', {
        dependencies: ['fastapi', 'uvicorn', 'pytest']
      });
      expect(result).toContain('fastapi');
      expect(result).toContain('uvicorn');
      expect(result).toContain('pytest');
    });

    it('should render poetry pyproject template', async () => {
      const result = await renderTemplate('common/poetry-pyproject.hbs', {
        projectName: 'test-project',
        description: 'Test description',
        pythonVersion: '3.12',
        dependencies: ['fastapi', 'uvicorn']
      });
      expect(result).toContain('name = "test-project"');
      expect(result).toContain('description = "Test description"');
      expect(result).toContain('python = "^3.12"');
      expect(result).toContain('fastapi = "*"');
    });
  });

  describe('Simple Templates', () => {
    it('should render simple main.py without CORS', async () => {
      const result = await renderTemplate('simple/main.hbs', {
        projectName: 'my-api',
        description: 'My API',
        dependencies: []
      });
      expect(result).toContain('from fastapi import FastAPI');
      expect(result).toContain('title="my-api"');
      expect(result).not.toContain('CORSMiddleware');
    });

    it('should render simple main.py with CORS', async () => {
      const result = await renderTemplate('simple/main.hbs', {
        projectName: 'my-api',
        description: 'My API',
        dependencies: ['python-multipart']
      });
      expect(result).toContain('from fastapi import FastAPI');
      expect(result).toContain('from fastapi.middleware.cors import CORSMiddleware');
      expect(result).toContain('CORSMiddleware');
    });

    it('should render simple env file', async () => {
      const result = await renderTemplate('simple/env.hbs', {
        projectName: 'test-api'
      });
      expect(result).toContain('APP_NAME=test-api');
      expect(result).toContain('DEBUG=FALSE');
    });

    it('should render simple readme', async () => {
      const result = await renderTemplate('simple/readme.hbs', {
        projectName: 'test-api',
        description: 'Test API',
        packaging: 'pip'
      });
      expect(result).toContain('# test-api');
      expect(result).toContain('Test API');
      expect(result).toContain('pip install -r requirements.txt');
    });
  });

  describe('Structured Templates', () => {
    it('should render structured main.py without auth', async () => {
      const result = await renderTemplate('structured/main.hbs', {
        dependencies: []
      });
      expect(result).toContain('from fastapi import FastAPI');
      expect(result).toContain('from src.config import config');
      expect(result).not.toContain('authentication_router');
    });

    it('should render structured main.py with auth', async () => {
      const result = await renderTemplate('structured/main.hbs', {
        dependencies: ['python-jose[cryptography]', 'passlib[bcrypt]']
      });
      expect(result).toContain('from src.routers import authentication_router');
      expect(result).toContain('authentication_router.router');
    });

    it('should render structured config with database', async () => {
      const result = await renderTemplate('structured/config.hbs', {
        projectName: 'test-api',
        database: 'postgres',
        databaseUrl: 'postgresql://localhost/test'
      });
      expect(result).toContain('app_name = os.getenv("APP_NAME", "test-api")');
      expect(result).toContain('database_url');
    });

    it('should render structured config without database', async () => {
      const result = await renderTemplate('structured/config.hbs', {
        projectName: 'test-api',
        database: 'none'
      });
      expect(result).not.toContain('database_url');
    });
  });

  describe('Enterprise Templates', () => {
    it('should render enterprise main.py', async () => {
      const result = await renderTemplate('enterprise/main.hbs');
      expect(result).toContain('from fastapi import FastAPI');
      expect(result).toContain('from app.api.main import api_router');
      expect(result).toContain('from app.core.config import settings');
    });

    it('should render enterprise config', async () => {
      const result = await renderTemplate('enterprise/config.hbs', {
        projectName: 'enterprise-api',
        description: 'Enterprise API'
      });
      expect(result).toContain('APP_NAME: str = "enterprise-api"');
      expect(result).toContain('APP_DESCRIPTION: str = "Enterprise API"');
    });

    it('should render enterprise database', async () => {
      const result = await renderTemplate('enterprise/database.hbs');
      expect(result).toContain('from sqlalchemy.ext.asyncio import AsyncSession');
      expect(result).toContain('async def get_db()');
    });
  });

  describe('Handlebars Helpers', () => {
    it('should use includes helper correctly', async () => {
      const result = await renderTemplate('simple/main.hbs', {
        projectName: 'test',
        description: 'test',
        dependencies: ['python-multipart']
      });
      expect(result).toContain('CORSMiddleware');
    });

    it('should use eq helper for packaging', async () => {
      const resultPip = await renderTemplate('simple/readme.hbs', {
        projectName: 'test',
        description: 'test',
        packaging: 'pip'
      });
      expect(resultPip).toContain('pip install -r requirements.txt');

      const resultPoetry = await renderTemplate('simple/readme.hbs', {
        projectName: 'test',
        description: 'test',
        packaging: 'poetry'
      });
      expect(resultPoetry).toContain('poetry install');
    });

    it('should use neq helper for database', async () => {
      const withDb = await renderTemplate('structured/config.hbs', {
        projectName: 'test',
        database: 'postgres',
        databaseUrl: 'postgresql://localhost/db'
      });
      expect(withDb).toContain('database_url');

      const withoutDb = await renderTemplate('structured/config.hbs', {
        projectName: 'test',
        database: 'none'
      });
      expect(withoutDb).not.toContain('database_url');
    });
  });
});
