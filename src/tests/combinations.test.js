import { describe, it, expect } from 'vitest';
import * as templates from '../templates/templates.js';

/**
 * Test all meaningful combinations of project configurations
 */
describe('Project Combinations', () => {
  const structures = ['simple', 'structured', 'enterprise'];
  const packagingManagers = ['pip', 'poetry', 'uv', 'pipenv'];
  const databases = ['none', 'postgres', 'mysql', 'sqlite', 'mongodb'];
  const pythonVersions = ['3.10', '3.11', '3.12'];

  describe('Simple Structure Combinations', () => {
    packagingManagers.forEach(packaging => {
      it(`should generate simple project with ${packaging}`, async () => {
        const config = {
          projectName: `test-simple-${packaging}`,
          description: 'Test project',
          packaging,
          pythonVersion: '3.12',
          dependencies: []
        };

        const result = await templates.generateSimpleMainPy(config);
        expect(result).toContain('from fastapi import FastAPI');
        expect(result).toContain(`title="${config.projectName}"`);
      });
    });

    it('should generate simple project with CORS dependency', async () => {
      const config = {
        projectName: 'test-cors',
        description: 'Test with CORS',
        dependencies: ['python-multipart']
      };

      const result = await templates.generateSimpleMainPy(config);
      expect(result).toContain('CORSMiddleware');
    });
  });

  describe('Structured Structure Combinations', () => {
    packagingManagers.forEach(packaging => {
      databases.forEach(database => {
        it(`should generate structured project with ${packaging} and ${database}`, async () => {
          const config = {
            projectName: `test-${packaging}-${database}`,
            description: 'Test project',
            packaging,
            database,
            pythonVersion: '3.12',
            dependencies: []
          };

          const configPy = await templates.generateConfigPy(config);
          expect(configPy).toContain('class AppConfig');

          if (database !== 'none') {
            expect(configPy).toContain('database_url');
          }
        });
      });
    });

    it('should generate structured project with authentication', async () => {
      const config = {
        projectName: 'test-auth',
        description: 'Test with auth',
        dependencies: ['python-jose[cryptography]', 'passlib[bcrypt]']
      };

      const mainPy = await templates.generateStructuredMainPy(config);
      expect(mainPy).toContain('authentication_router');
    });
  });

  describe('Packaging Manager Combinations', () => {
    const testDeps = ['fastapi', 'uvicorn[standard]', 'pytest'];

    it('should generate Poetry config', async () => {
      const config = {
        projectName: 'test-poetry',
        description: 'Test project',
        pythonVersion: '3.12',
        dependencies: testDeps
      };

      const result = await templates.generatePoetryConfig(config, testDeps);
      expect(result).toContain('[tool.poetry]');
      expect(result).toContain('name = "test-poetry"');
      expect(result).toContain('python = "^3.12"');
      testDeps.forEach(dep => {
        expect(result).toContain(`${dep} = "*"`);
      });
    });

    it('should generate UV config', async () => {
      const config = {
        projectName: 'test-uv',
        description: 'Test project',
        pythonVersion: '3.12',
        dependencies: testDeps
      };

      const result = await templates.generateUvConfig(config, testDeps);
      expect(result).toContain('[project]');
      expect(result).toContain('name = "test-uv"');
      expect(result).toContain('requires-python = ">=3.12"');
      testDeps.forEach(dep => {
        expect(result).toContain(`"${dep}",`);
      });
    });

    it('should generate Pipfile', async () => {
      const config = {
        projectName: 'test-pipenv',
        description: 'Test project',
        pythonVersion: '3.12',
        dependencies: testDeps
      };

      const result = await templates.generatePipfile(config, testDeps);
      expect(result).toContain('[packages]');
      expect(result).toContain('python_version = "3.12"');
      testDeps.forEach(dep => {
        expect(result).toContain(`${dep} = "*"`);
      });
    });

    it('should generate requirements.txt', async () => {
      const result = await templates.generateRequirementsTxt(testDeps);
      testDeps.forEach(dep => {
        expect(result).toContain(dep);
      });
    });
  });

  describe('README Combinations', () => {
    packagingManagers.forEach(packaging => {
      it(`should generate simple README with ${packaging} commands`, async () => {
        const config = {
          projectName: 'test-readme',
          description: 'Test project',
          packaging
        };

        const result = await templates.generateSimpleReadme(config, ['fastapi']);
        expect(result).toContain('# test-readme');
        expect(result).toContain('Test project');

        // Check for correct install command
        const installCommands = {
          'pip': 'pip install -r requirements.txt',
          'poetry': 'poetry install',
          'uv': 'uv sync',
          'pipenv': 'pipenv install'
        };
        expect(result).toContain(installCommands[packaging]);
      });

      it(`should generate structured README with ${packaging} commands`, async () => {
        const config = {
          projectName: 'test-structured-readme',
          description: 'Test structured project',
          packaging,
          dependencies: []
        };

        const result = await templates.generateStructuredReadme(config);
        expect(result).toContain('# test-structured-readme');
        expect(result).toContain('## Project Structure');
      });
    });
  });

  describe('Database Combinations', () => {
    databases.forEach(database => {
      if (database !== 'none') {
        it(`should generate config with ${database} database URL`, async () => {
          const config = {
            projectName: 'test-db',
            database
          };

          const dbUrl = templates.getDatabaseUrl(database);
          expect(dbUrl).toBeTruthy();
          expect(dbUrl.length).toBeGreaterThan(0);

          const configPy = await templates.generateConfigPy({
            ...config,
            databaseUrl: dbUrl
          });
          expect(configPy).toContain('database_url');
        });
      }
    });
  });

  describe('Python Version Combinations', () => {
    pythonVersions.forEach(version => {
      it(`should support Python ${version}`, async () => {
        const config = {
          projectName: `test-py${version}`,
          description: 'Test project',
          pythonVersion: version,
          dependencies: ['fastapi']
        };

        const poetryConfig = await templates.generatePoetryConfig(config, ['fastapi']);
        expect(poetryConfig).toContain(`python = "^${version}"`);

        const uvConfig = await templates.generateUvConfig(config, ['fastapi']);
        expect(uvConfig).toContain(`requires-python = ">=${version}"`);

        const pipfile = await templates.generatePipfile(config, ['fastapi']);
        expect(pipfile).toContain(`python_version = "${version}"`);
      });
    });
  });

  describe('Dependency Combinations', () => {
    const dependencySets = [
      { name: 'minimal', deps: [] },
      { name: 'with-cors', deps: ['python-multipart'] },
      { name: 'with-auth', deps: ['python-jose[cryptography]', 'passlib[bcrypt]'] },
      { name: 'with-testing', deps: ['pytest', 'pytest-asyncio'] },
      { name: 'full-stack', deps: ['python-multipart', 'python-jose[cryptography]', 'passlib[bcrypt]', 'pytest'] },
    ];

    dependencySets.forEach(({ name, deps }) => {
      it(`should generate project with ${name} dependencies`, async () => {
        const config = {
          projectName: `test-${name}`,
          description: 'Test project',
          dependencies: deps
        };

        const mainPy = await templates.generateSimpleMainPy(config);
        expect(mainPy).toContain('from fastapi import FastAPI');

        if (deps.includes('python-multipart')) {
          expect(mainPy).toContain('CORSMiddleware');
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle project name with hyphens', async () => {
      const config = {
        projectName: 'my-test-project',
        description: 'Test',
        dependencies: []
      };

      const result = await templates.generateSimpleMainPy(config);
      expect(result).toContain('title="my-test-project"');
    });

    it('should handle project name with underscores', async () => {
      const config = {
        projectName: 'my_test_project',
        description: 'Test',
        dependencies: []
      };

      const result = await templates.generateSimpleMainPy(config);
      expect(result).toContain('title="my_test_project"');
    });

    it('should handle special characters in description', async () => {
      const config = {
        projectName: 'test',
        description: 'Test with "quotes" and \'apostrophes\'',
        dependencies: []
      };

      const result = await templates.generateSimpleMainPy(config);
      expect(result).toContain('from fastapi import FastAPI');
    });

    it('should handle empty dependencies array', async () => {
      const config = {
        projectName: 'test',
        description: 'Test',
        dependencies: []
      };

      const result = await templates.generateSimpleMainPy(config);
      expect(result).not.toContain('CORSMiddleware');
    });
  });
});
