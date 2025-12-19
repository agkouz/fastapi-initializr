# FastAPI Initializr - React Edition

A modern React application for generating FastAPI projects with various structures and configurations.

## 🚀 Quick Start

### Option 1: Using Python HTTP Server (Recommended)

```bash
cd fastapi-initializr-react
python -m http.server 8080
```

Then open: `http://localhost:8080/public/`

### Option 2: Using Node.js http-server

```bash
npx http-server -p 8080
```

Then open: `http://localhost:8080/public/`

## 📁 Project Structure

```
fastapi-initializr-react/
├── public/
│   ├── index.html          # Main HTML file
│   └── styles.css          # All styles
├── src/
│   ├── App.jsx             # Main React component
│   ├── config.js           # Configuration & constants
│   ├── templates.js        # Simple & Structured templates
│   ├── enterpriseTemplates.js  # Enterprise templates
│   └── utils/
│       └── generator.js    # Project generation logic
└── README.md
```

## ⚛️ React Features

- **React 18** with Hooks (useState, useEffect, useMemo)
- **No build step** - uses Babel standalone
- **ES6 Modules** - proper import/export
- **Component-based** architecture
- **Reactive state** management

## ✨ Features

### Project Configuration
- Project metadata (name, description, package name)
- Python version selection (3.9 - 3.12)
- 4 packaging options (UV, Poetry, pip, Pipenv)
- 3 project structures (Simple, Structured, Enterprise)
- Database selection

### Dependencies
- 65+ curated Python packages
- Search and filter by category
- Real-time selection
- Live preview

### Project Generation
- **Simple Structure** - Single file, perfect for learning
- **Structured Structure** - Organized package with routers
- **Enterprise Structure** - Complete production boilerplate with:
  - API versioning (/api/v1)
  - SQLAlchemy 2.0 async
  - Alembic migrations
  - JWT authentication
  - Docker setup
  - Testing framework

## 🎨 Design

- Dark theme with teal accents
- Smooth animations
- Responsive layout
- Modern glassmorphism effects

## 🔧 Technical Stack

### Frontend
- React 18 (via CDN)
- Babel Standalone (for JSX)
- ES6 Modules

### Libraries
- JSZip - Project ZIP generation

### Fonts
- Syne - Headlines
- Space Mono - Body text
- JetBrains Mono - Code

## 📦 No Dependencies!

This project runs entirely in the browser with no build step or npm install required!

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note:** Requires a local server (ES6 modules don't work with `file://` protocol)

## 🎯 Usage

1. Start local server
2. Open `http://localhost:8080/public/`
3. Configure your project
4. Select dependencies
5. Click "Generate Project"
6. Download ZIP file
7. Extract and start coding!

## 💡 Tips

- **UV** is the fastest packaging option (10-100x faster than pip)
- **Structured** is perfect for most production projects
- **Enterprise** includes everything for large-scale apps
- Use search to quickly find dependencies
- Filter by category to explore options

## 🐛 Troubleshooting

### "Module not found" errors
- Make sure you're using a local server (not `file://`)
- Check that all files are in the correct directories

### Page doesn't load
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check browser console for errors

### ZIP doesn't download
- Check pop-up blocker
- Try a different browser
- Check browser downloads settings

## 📄 License

MIT License - Feel free to use for any project!

## 🙏 Credits

- Based on Spring Initializr concept
- Enterprise structure inspired by benavlabs/FastAPI-boilerplate
- Built with ❤️ for the FastAPI community

---

**Happy coding!** 🚀
