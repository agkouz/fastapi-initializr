# Testing Guide for Handlebars Templates Refactoring

## Prerequisites

Ensure you have Node.js and npm installed.

## 1. Install Dependencies

```bash
npm install
```

This will install `handlebars@^4.7.8` along with other dependencies.

## 2. Build the Project

Test that all templates compile correctly:

```bash
npm run build
```

**Expected outcome:** Build should complete successfully without errors or warnings.

## 3. Run Development Server

Start the development server to test the application:

```bash
npm run dev
```

This will start the Vite dev server (usually on http://localhost:5173).

## 4. Manual Testing Checklist

### Test 1: Simple Project Structure

1. Open the application in your browser
2. Fill in the form:
   - **Project Name:** `test-simple-project`
   - **Description:** `Testing simple structure`
   - **Structure:** Simple
   - **Packaging:** pip
   - **Python Version:** 3.12
   - **Dependencies:** Select "python-multipart"
3. Click "Generate Project"
4. Extract the downloaded ZIP file
5. **Verify:**
   - `main.py` contains FastAPI code with CORS middleware
   - `.env` file is present
   - `requirements.txt` contains dependencies
   - `.gitignore` is present
   - `README.md` has setup instructions

### Test 2: Structured Project

1. Fill in the form:
   - **Project Name:** `test-structured-project`
   - **Structure:** Structured
   - **Packaging:** poetry
   - **Database:** postgres
   - **Dependencies:** Select auth dependencies
2. Click "Generate Project"
3. **Verify:**
   - `src/main.py` exists
   - `src/config.py` has database URL configuration
   - `src/routers/health_check.py` exists
   - `src/routers/authentication_router.py` exists (if auth selected)
   - `pyproject.toml` exists
   - `.env` has DATABASE_URL

### Test 3: Enterprise Project

1. Fill in the form:
   - **Project Name:** `test-enterprise-api`
   - **Structure:** Enterprise
   - **Packaging:** uv
2. Click "Generate Project"
3. **Verify:**
   - `app/main.py` exists with proper structure
   - `app/core/config.py` has Pydantic settings
   - `app/core/database.py` has async SQLAlchemy setup
   - `app/core/security.py` has JWT functions
   - `app/models/user.py` exists
   - `app/schemas/user.py` exists
   - `app/crud/base.py` has CRUD base class
   - `app/api/v1/endpoints/users.py` exists
   - `alembic.ini` exists
   - `Dockerfile` exists
   - `docker-compose.yml` exists
   - `.env` has all environment variables

### Test 4: Different Packaging Managers

Test each packaging manager (pip, poetry, uv, pipenv) and verify:
- Correct dependency file is created
- README has correct install commands
- Dependencies are properly formatted

### Test 5: Template Helpers

Check that Handlebars helpers work correctly:

1. **`includes` helper:** Create project with and without dependencies
2. **`eq` helper:** Test different packaging managers
3. **`neq` helper:** Test database configurations
4. **`replace` helper:** Check project names with hyphens in enterprise config

## 5. Verify Template Files

Check that all template files are properly structured:

```bash
# List all template files
find src/templates/hbs -name "*.hbs" -type f

# Count should be 31 files
find src/templates/hbs -name "*.hbs" -type f | wc -l
```

## 6. Code Quality Checks

### Lint the code:

```bash
npm run lint
```

### Check for syntax errors in templates:

Manually review a few template files to ensure:
- Handlebars syntax is correct
- No unclosed tags
- Variables are properly referenced

## 7. Browser Console Check

1. Open browser DevTools (F12)
2. Go to Console tab
3. Generate a project
4. **Verify:**
   - No errors in console
   - Console logs show generation progress
   - ZIP file downloads successfully

## 8. Edge Cases to Test

### Empty/Special Characters:
- Project name with hyphens: `my-test-project`
- Project name with underscores: `my_test_project`
- Long descriptions
- No optional dependencies selected
- All optional dependencies selected

### Database Options:
- Test with `none` database
- Test with `postgres`
- Test with `mysql`
- Test with `sqlite`
- Test with `mongodb`

## 9. Compare Output with Previous Version

If you have the old version:

1. Generate same project with old version
2. Generate same project with new Handlebars version
3. Compare the generated files
4. **They should be identical** (except for formatting improvements)

## 10. Performance Check

1. Open browser DevTools > Network tab
2. Generate a project
3. Check bundle size of main JS file
4. Compare with previous version (should be slightly larger due to Handlebars library)

## Expected Results

✅ All builds complete without errors
✅ All template types (simple/structured/enterprise) generate correctly
✅ All packaging managers (pip/poetry/uv/pipenv) work
✅ All database options generate correct configurations
✅ Generated projects have correct file structure
✅ Generated code is syntactically correct
✅ No console errors during generation
✅ ZIP files download successfully

## Troubleshooting

### Build fails with "template not found"
- Check that all .hbs files are in `src/templates/hbs/`
- Verify templateLoader.js has all templates registered

### Generated files have missing content
- Check that context object is passed correctly to `renderTemplate()`
- Verify Handlebars helpers are working

### Templates not rendering
- Check browser console for errors
- Verify Handlebars is installed: `npm list handlebars`

## Automated Testing (Future Enhancement)

To add automated tests, create `src/utils/__tests__/templateLoader.test.js`:

```javascript
import { renderTemplate } from '../templateLoader';

describe('Template Loader', () => {
  test('renders simple main template', async () => {
    const result = await renderTemplate('simple/main.hbs', {
      projectName: 'test',
      description: 'test desc',
      dependencies: []
    });
    expect(result).toContain('from fastapi import FastAPI');
    expect(result).toContain('title="test"');
  });

  test('includes helper works', async () => {
    const result = await renderTemplate('simple/main.hbs', {
      projectName: 'test',
      description: 'test',
      dependencies: ['python-multipart']
    });
    expect(result).toContain('CORSMiddleware');
  });
});
```

## Success Criteria

The refactoring is successful if:
1. All existing functionality works exactly as before
2. Templates are easier to read and maintain
3. No regression in generated project quality
4. Build and runtime performance is acceptable
5. Code is cleaner and more maintainable
