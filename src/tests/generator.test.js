import { describe, it, expect, vi } from 'vitest';
import { generateProject } from '../utils/generator.js';
import JSZip from 'jszip';

// Mock DOM APIs
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();
global.document = {
  createElement: vi.fn(() => ({
    click: vi.fn(),
  })),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
};

describe('Project Generator', () => {
  describe('Simple Structure', () => {
    it('should generate simple project with pip', async () => {
      const config = {
        projectName: 'test-simple-pip',
        description: 'Test simple project with pip',
        structure: 'simple',
        packaging: 'pip',
        pythonVersion: '3.12',
        database: 'none',
        dependencies: []
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith('a');
    });

    it('should generate simple project with poetry', async () => {
      const config = {
        projectName: 'test-simple-poetry',
        description: 'Test simple project with poetry',
        structure: 'simple',
        packaging: 'poetry',
        pythonVersion: '3.11',
        database: 'none',
        dependencies: ['python-multipart']
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should generate simple project with uv', async () => {
      const config = {
        projectName: 'test-simple-uv',
        description: 'Test simple project with uv',
        structure: 'simple',
        packaging: 'uv',
        pythonVersion: '3.12',
        database: 'none',
        dependencies: []
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Structured Projects', () => {
    it('should generate structured project with postgres', async () => {
      const config = {
        projectName: 'test-structured-postgres',
        description: 'Test structured project',
        structure: 'structured',
        packaging: 'poetry',
        pythonVersion: '3.12',
        database: 'postgres',
        dependencies: []
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should generate structured project with auth', async () => {
      const config = {
        projectName: 'test-structured-auth',
        description: 'Test with authentication',
        structure: 'structured',
        packaging: 'pip',
        pythonVersion: '3.12',
        database: 'sqlite',
        dependencies: ['python-jose[cryptography]', 'passlib[bcrypt]']
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Enterprise Projects', () => {
    it('should generate enterprise project', async () => {
      const config = {
        projectName: 'test-enterprise',
        description: 'Test enterprise project',
        structure: 'enterprise',
        packaging: 'uv',
        pythonVersion: '3.12',
        database: 'postgres',
        dependencies: []
      };

      await generateProject(config);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
