#!/usr/bin/env node

/**
 * Comprehensive Test Script for All Project Combinations
 *
 * This script generates projects with different combinations of:
 * - Structure types (simple, structured, enterprise)
 * - Packaging managers (pip, poetry, uv, pipenv)
 * - Databases (none, postgres, mysql, sqlite, mongodb)
 * - Dependencies (various combinations)
 *
 * It validates that each generated project contains the expected files.
 */

import JSZip from 'jszip';
import { generateProject } from './src/utils/generator.js';
import fs from 'fs/promises';
import path from 'path';

const OUTPUT_DIR = './test-output';
const RESULTS_FILE = './test-results.json';

// Test configurations
const testCombinations = [
  // Simple structure tests
  {
    name: 'simple-pip-no-deps',
    config: {
      projectName: 'simple-pip',
      description: 'Simple project with pip',
      structure: 'simple',
      packaging: 'pip',
      pythonVersion: '3.12',
      database: 'none',
      dependencies: []
    },
    expectedFiles: ['main.py', 'requirements.txt', '.gitignore', 'README.md', '.env']
  },
  {
    name: 'simple-poetry-cors',
    config: {
      projectName: 'simple-poetry',
      description: 'Simple project with poetry and CORS',
      structure: 'simple',
      packaging: 'poetry',
      pythonVersion: '3.11',
      database: 'none',
      dependencies: ['python-multipart']
    },
    expectedFiles: ['main.py', 'pyproject.toml', '.gitignore', 'README.md', '.env']
  },
  {
    name: 'simple-uv',
    config: {
      projectName: 'simple-uv',
      description: 'Simple project with uv',
      structure: 'simple',
      packaging: 'uv',
      pythonVersion: '3.12',
      database: 'none',
      dependencies: []
    },
    expectedFiles: ['main.py', 'pyproject.toml', '.gitignore', 'README.md', '.env']
  },
  {
    name: 'simple-pipenv',
    config: {
      projectName: 'simple-pipenv',
      description: 'Simple project with pipenv',
      structure: 'simple',
      packaging: 'pipenv',
      pythonVersion: '3.10',
      database: 'none',
      dependencies: []
    },
    expectedFiles: ['main.py', 'Pipfile', '.gitignore', 'README.md', '.env']
  },

  // Structured tests
  {
    name: 'structured-pip-postgres',
    config: {
      projectName: 'structured-postgres',
      description: 'Structured project with PostgreSQL',
      structure: 'structured',
      packaging: 'pip',
      pythonVersion: '3.12',
      database: 'postgres',
      dependencies: []
    },
    expectedFiles: [
      'src/main.py',
      'src/config.py',
      'src/__init__.py',
      'src/routers/__init__.py',
      'src/routers/health_check.py',
      'requirements.txt',
      '.env',
      '.env.example',
      '.gitignore',
      'README.md'
    ]
  },
  {
    name: 'structured-poetry-auth',
    config: {
      projectName: 'structured-auth',
      description: 'Structured with authentication',
      structure: 'structured',
      packaging: 'poetry',
      pythonVersion: '3.12',
      database: 'sqlite',
      dependencies: ['python-jose[cryptography]', 'passlib[bcrypt]']
    },
    expectedFiles: [
      'src/main.py',
      'src/config.py',
      'src/routers/health_check.py',
      'src/routers/authentication_router.py',
      'pyproject.toml',
      '.env',
      '.env.example',
      '.gitignore',
      'README.md'
    ]
  },
  {
    name: 'structured-uv-mysql',
    config: {
      projectName: 'structured-mysql',
      description: 'Structured with MySQL',
      structure: 'structured',
      packaging: 'uv',
      pythonVersion: '3.11',
      database: 'mysql',
      dependencies: []
    },
    expectedFiles: [
      'src/main.py',
      'src/config.py',
      'src/routers/health_check.py',
      'pyproject.toml',
      '.env',
      '.gitignore'
    ]
  },

  // Enterprise tests
  {
    name: 'enterprise-pip',
    config: {
      projectName: 'enterprise-pip',
      description: 'Enterprise project with pip',
      structure: 'enterprise',
      packaging: 'pip',
      pythonVersion: '3.12',
      database: 'postgres',
      dependencies: []
    },
    expectedFiles: [
      'app/main.py',
      'app/__init__.py',
      'app/core/config.py',
      'app/core/database.py',
      'app/core/security.py',
      'app/api/main.py',
      'app/api/v1/endpoints/users.py',
      'app/models/user.py',
      'app/schemas/user.py',
      'app/crud/base.py',
      'alembic/env.py',
      'alembic.ini',
      'Dockerfile',
      'docker-compose.yml',
      'pytest.ini',
      'requirements.txt',
      '.env',
      '.env.example',
      '.gitignore',
      'README.md'
    ]
  },
  {
    name: 'enterprise-poetry',
    config: {
      projectName: 'enterprise-poetry',
      description: 'Enterprise with poetry',
      structure: 'enterprise',
      packaging: 'poetry',
      pythonVersion: '3.12',
      database: 'postgres',
      dependencies: []
    },
    expectedFiles: [
      'app/main.py',
      'app/core/config.py',
      'app/core/database.py',
      'pyproject.toml',
      'alembic.ini',
      'Dockerfile',
      'docker-compose.yml',
      '.env',
      'README.md'
    ]
  },
  {
    name: 'enterprise-uv',
    config: {
      projectName: 'enterprise-uv',
      description: 'Enterprise with uv',
      structure: 'enterprise',
      packaging: 'uv',
      pythonVersion: '3.12',
      database: 'postgres',
      dependencies: []
    },
    expectedFiles: [
      'app/main.py',
      'app/core/config.py',
      'pyproject.toml',
      'alembic.ini',
      '.env'
    ]
  }
];

// Mock browser APIs for Node.js environment
class MockBlob {
  constructor(parts, options) {
    this.parts = parts;
    this.type = options?.type || '';
  }
}

global.Blob = MockBlob;
global.URL = {
  createObjectURL: () => 'mock-url',
  revokeObjectURL: () => {}
};
global.document = {
  createElement: () => ({
    click: () => {},
    href: '',
    download: ''
  }),
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

async function validateZipContents(zipBlob, expectedFiles, testName) {
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipBlob.parts[0]);

  const errors = [];
  const foundFiles = [];

  // Get all files in the ZIP
  Object.keys(contents.files).forEach(filename => {
    if (!contents.files[filename].dir) {
      // Remove project name prefix from path
      const relativePath = filename.split('/').slice(1).join('/');
      if (relativePath) {
        foundFiles.push(relativePath);
      }
    }
  });

  // Check if all expected files are present
  for (const expectedFile of expectedFiles) {
    if (!foundFiles.includes(expectedFile)) {
      errors.push(`Missing file: ${expectedFile}`);
    }
  }

  // Check file contents for key files
  for (const file of foundFiles) {
    const fileObj = contents.files[Object.keys(contents.files).find(f => f.endsWith(file))];
    if (fileObj) {
      const content = await fileObj.async('string');

      // Basic content validation
      if (file.endsWith('main.py')) {
        if (!content.includes('from fastapi import FastAPI')) {
          errors.push(`${file}: Missing FastAPI import`);
        }
      }

      if (file.endsWith('README.md')) {
        if (!content.includes('##')) {
          errors.push(`${file}: Missing markdown headers`);
        }
      }

      if (file.endsWith('.gitignore')) {
        if (!content.includes('__pycache__')) {
          errors.push(`${file}: Missing Python cache patterns`);
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    foundFiles: foundFiles.length,
    expectedFiles: expectedFiles.length
  };
}

async function runTest(testCase) {
  console.log(`\n📦 Testing: ${testCase.name}`);
  console.log(`   Structure: ${testCase.config.structure}`);
  console.log(`   Packaging: ${testCase.config.packaging}`);
  console.log(`   Database: ${testCase.config.database}`);

  try {
    // Capture the generated ZIP blob
    let generatedBlob = null;
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = (blob) => {
      generatedBlob = blob;
      return 'mock-url';
    };

    // Generate the project
    await generateProject(testCase.config);

    // Restore original function
    global.URL.createObjectURL = originalCreateObjectURL;

    if (!generatedBlob) {
      throw new Error('No ZIP blob was generated');
    }

    // Validate ZIP contents
    const validation = await validateZipContents(
      generatedBlob,
      testCase.expectedFiles,
      testCase.name
    );

    if (validation.success) {
      console.log(`   ✅ PASSED - Found ${validation.foundFiles} files`);
      results.passed++;
      results.tests.push({
        name: testCase.name,
        status: 'passed',
        foundFiles: validation.foundFiles,
        expectedFiles: validation.expectedFiles
      });
    } else {
      console.log(`   ❌ FAILED`);
      validation.errors.forEach(err => console.log(`      - ${err}`));
      results.failed++;
      results.tests.push({
        name: testCase.name,
        status: 'failed',
        errors: validation.errors,
        foundFiles: validation.foundFiles,
        expectedFiles: validation.expectedFiles
      });
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    results.failed++;
    results.tests.push({
      name: testCase.name,
      status: 'error',
      error: error.message
    });
  }

  results.total++;
}

async function main() {
  console.log('==========================================');
  console.log('Testing All Project Combinations');
  console.log('==========================================');
  console.log(`Total test cases: ${testCombinations.length}\n`);

  // Create output directory
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }

  // Run all tests
  for (const testCase of testCombinations) {
    await runTest(testCase);
  }

  // Print summary
  console.log('\n==========================================');
  console.log('Test Summary');
  console.log('==========================================');
  console.log(`Total: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  // Save results to file
  await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${RESULTS_FILE}`);

  // Exit with error code if any tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
