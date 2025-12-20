# FastAPI Initializr - React Edition

A modern React application for generating FastAPI projects with various structures and configurations. Built with Vite, React 18, and proper npm tooling.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or 20+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Clone or extract the project
cd fastapi-initializr-react

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
fastapi-initializr-react/
├── public/                     # Static assets
├── src/
│   ├── components/             # React components (future)
│   ├── templates/              # FastAPI project templates
│   │   ├── templates.js        # Simple & Structured templates
│   │   └── enterpriseTemplates.js  # Enterprise templates
│   ├── utils/                  # Utility functions
│   │   └── generator.js        # Project generation logic
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # Component styles
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   └── config.js               # App configuration
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── eslint.config.js            # ESLint configuration
└── README.md                   # This file
```

## ✨ Features

### Project Configuration
- **Project Metadata**: Name, description, package name
- **Python Version**: 3.9, 3.10, 3.11, 3.12
- **Packaging**: UV, Poetry, pip, Pipenv
- **Project Structures**: Simple, Structured, Enterprise
- **Database**: PostgreSQL, MySQL, MongoDB, or None

### Dependencies
- 65+ curated Python packages
- Search and filter by category
- Categories: database, auth, api, testing, monitoring, async
- Real-time dependency selection
- Live preview of selected dependencies

### Project Generation
Three project structures available:

#### 1. Simple Structure
Perfect for learning and prototypes
- Single `main.py` file
- Basic FastAPI setup
- Health check endpoint
- README with setup instructions

#### 2. Structured Structure
Production-ready for most projects
- Organized package structure
- Separate routers
- Configuration management
- Environment variables
- Scalable architecture

#### 3. Enterprise Structure
Complete production boilerplate
- API versioning (/api/v1)
- SQLAlchemy 2.0 async ORM
- Alembic database migrations
- JWT authentication
- CRUD operations
- Docker configuration
- Testing framework
- Based on [benavlabs/FastAPI-boilerplate](https://github.com/benavlabs/FastAPI-boilerplate)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **JSZip** - Client-side ZIP generation

### Development Tools
- **ESLint** - Code linting
- **React DevTools** compatible

### Styling
- Custom CSS with CSS variables
- Dark theme design
- Responsive layout
- Smooth animations

## 📦 Dependencies

### Production
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "jszip": "^3.10.1"
}
```

### Development
```json
{
  "@vitejs/plugin-react": "^4.3.4",
  "vite": "^6.0.1",
  "eslint": "^9.15.0",
  "eslint-plugin-react": "^7.37.2"
}
```

## 🎯 Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Configure your project**
   - Enter project details
   - Select Python version
   - Choose packaging tool
   - Pick project structure
   - Select dependencies

3. **Generate project**
   - Click "Generate Project"
   - ZIP file downloads automatically

4. **Use the generated project**
   ```bash
   unzip my-project.zip
   cd my-project
   
   # With UV (recommended)
   uv sync
   uv run uvicorn main:app --reload
   
   # With Poetry
   poetry install
   poetry run uvicorn main:app --reload
   
   # With pip
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## 🔧 Development

### Project Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Environment

The development server runs on port 3000 by default. You can change this in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000,  // Change this
    open: true   // Auto-open browser
  }
})
```

## 🎨 Customization

### Adding New Dependencies

Edit `src/config.js`:

```javascript
export const FALLBACK_DATABASE = [
  {
    id: 'new_package',
    name: 'New Package',
    package: 'new-package',
    description: 'Description here',
    category: 'category_name'
  },
  // ... existing packages
];
```

### Creating New Templates

Add templates in `src/templates/`:

```javascript
export function generateMyTemplate(config) {
  return `
# Your template content
Project: ${config.projectName}
  `;
}
```

### Styling

Global styles: `src/index.css`
Component styles: `src/App.css`

CSS variables are defined in `index.css`:
```css
:root {
  --primary: #009688;
  --background: #0a0e27;
  --text: #e0e6ed;
  /* ... more variables */
}
```

## 📝 Code Quality

### Linting

```bash
npm run lint
```

ESLint is configured with:
- React recommended rules
- React Hooks rules
- JSX runtime rules

### Best Practices

- ✅ React Hooks (useState, useMemo)
- ✅ Functional components
- ✅ Proper prop types (via ESLint)
- ✅ ES6+ syntax
- ✅ Module imports/exports

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Serve Production Build

```bash
npm run preview
```

### Deploy to Hosting

The `dist/` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting

#### Example: Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Example: Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🐛 Troubleshooting

### Port already in use

Change port in `vite.config.js` or kill the process:

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Dependencies not installing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [UV Documentation](https://docs.astral.sh/uv/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for anything!

## 🙏 Credits

- FastAPI - Amazing Python framework
- Spring Initializr - Inspiration for this project
- benavlabs/FastAPI-boilerplate - Enterprise structure reference
- Vite team - Fantastic build tool
- React team - Revolutionary UI library

---

**Happy coding!** 🚀
