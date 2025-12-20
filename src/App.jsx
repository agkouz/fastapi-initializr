import { useState, useMemo } from 'react';
import { CURATED_PACKAGES, FALLBACK_DATABASE } from './config.js';
import { generateProject } from './utils/generator.js';
import './App.css';

const PROJECT_STRUCTURES = {
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

function App() {
    // Form state
    const [projectName, setProjectName] = useState('my-fastapi-project');
    const [description, setDescription] = useState('A FastAPI application');
    const [packageName, setPackageName] = useState('app');
    const [pythonVersion, setPythonVersion] = useState('3.12');
    const [packaging, setPackaging] = useState('uv');
    const [structure, setStructure] = useState('simple');
    const [database, setDatabase] = useState('none');
    
    // UI state
    const [selectedDeps, setSelectedDeps] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    
    // Data
    const [dependencies] = useState(FALLBACK_DATABASE);

    // Filter and search dependencies
    const filteredDeps = useMemo(() => {
        return dependencies.filter(dep => {
            const matchesFilter = filter === 'all' || dep.category === filter;
            const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                dep.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [dependencies, filter, searchTerm]);

    // Get selected dependency objects
    const selectedDepsArray = useMemo(() => {
        return Array.from(selectedDeps).map(id => 
            dependencies.find(d => d.id === id)
        ).filter(Boolean);
    }, [selectedDeps, dependencies]);

    const toggleDependency = (depId) => {
        setSelectedDeps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(depId)) {
                newSet.delete(depId);
            } else {
                newSet.add(depId);
            }
            return newSet;
        });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const config = {
                projectName,
                description,
                packageName,
                pythonVersion,
                packaging,
                structure,
                database,
                dependencies: selectedDepsArray.map(d => d.package)
            };

            console.log('🚀 Generating project with config:', config);
            
            await generateProject(config);
            
            alert(`✅ Project "${projectName}" generated successfully!`);
        } catch (error) {
            console.error('❌ Error generating project:', error);
            alert(`Error generating project: ${error.message}\n\nCheck the browser console for details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="grain"></div>
            
            <header>
                <h1>FastAPI Initializr</h1>
                <p className="tagline">Generate production-ready FastAPI projects in seconds</p>
            </header>

            <div className="content">
                <div className="main-panel">
                    {/* Project Metadata */}
                    <div className="section">
                        <h2 className="section-title">Project Metadata</h2>
                        <div className="form-group">
                            <label htmlFor="projectName">Project Name</label>
                            <input
                                type="text"
                                id="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="packageName">Package Name</label>
                            <input
                                type="text"
                                id="packageName"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Python Version */}
                    <div className="section">
                        <h2 className="section-title">Python Version</h2>
                        <div className="radio-group">
                            {['3.12', '3.11', '3.10', '3.9'].map(version => (
                                <div className="radio-option" key={version}>
                                    <input
                                        type="radio"
                                        id={`py${version.replace('.', '')}`}
                                        name="pythonVersion"
                                        checked={pythonVersion === version}
                                        onChange={() => setPythonVersion(version)}
                                    />
                                    <label htmlFor={`py${version.replace('.', '')}`}>{version}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Packaging */}
                    <div className="section">
                        <h2 className="section-title">Packaging</h2>
                        <div className="radio-group">
                            {[
                                { value: 'uv', label: 'UV' },
                                { value: 'poetry', label: 'Poetry' },
                                { value: 'pip', label: 'Requirements.txt' },
                                { value: 'pipenv', label: 'Pipenv' }
                            ].map(pkg => (
                                <div className="radio-option" key={pkg.value}>
                                    <input
                                        type="radio"
                                        id={pkg.value}
                                        name="packaging"
                                        checked={packaging === pkg.value}
                                        onChange={() => setPackaging(pkg.value)}
                                    />
                                    <label htmlFor={pkg.value}>{pkg.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Structure */}
                    <div className="section">
                        <h2 className="section-title">Project Structure</h2>
                        <div className="radio-group">
                            {Object.entries(PROJECT_STRUCTURES).map(([key, { title }]) => (
                                <div className="radio-option" key={key}>
                                    <input
                                        type="radio"
                                        id={key}
                                        name="structure"
                                        checked={structure === key}
                                        onChange={() => setStructure(key)}
                                    />
                                    <label htmlFor={key}>{title}</label>
                                </div>
                            ))}
                        </div>
                        <div className="structure-description">
                            {PROJECT_STRUCTURES[structure].description}
                        </div>
                    </div>

                    {/* Database */}
                    <div className="section">
                        <h2 className="section-title">Database</h2>
                        <div className="radio-group">
                            {[
                                { value: 'none', label: 'None' },
                                { value: 'postgres', label: 'PostgreSQL' },
                                { value: 'mysql', label: 'MySQL' },
                                { value: 'mongodb', label: 'MongoDB' }
                            ].map(db => (
                                <div className="radio-option" key={db.value}>
                                    <input
                                        type="radio"
                                        id={db.value}
                                        name="database"
                                        checked={database === db.value}
                                        onChange={() => setDatabase(db.value)}
                                    />
                                    <label htmlFor={db.value}>{db.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dependencies */}
                    <div className="section">
                        <h2 className="section-title">Dependencies</h2>
                        
                        <div className="form-group">
                            <input
                                type="search"
                                placeholder="Search dependencies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-buttons">
                            {['all', 'database', 'auth', 'api', 'testing', 'monitoring', 'async'].map(cat => (
                                <button
                                    key={cat}
                                    className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="dependencies-grid">
                            {filteredDeps.map(dep => (
                                <div
                                    key={dep.id}
                                    className="dependency-item"
                                    onClick={() => toggleDependency(dep.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDeps.has(dep.id)}
                                        onChange={() => toggleDependency(dep.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="dependency-info">
                                        <div className="dependency-name">{dep.name}</div>
                                        <div className="dependency-description">{dep.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview Sidebar */}
                <div className="sidebar">
                    <div className="preview-panel">
                        <h3 className="preview-title">Project Preview</h3>
                        
                        <div className="command-preview">
                            $ cd {projectName} && {packaging === 'uv' ? 'uv run' : packaging === 'poetry' ? 'poetry run' : ''} uvicorn {structure === 'structured' ? `${packageName}.` : structure === 'enterprise' ? 'app.' : ''}main:app --reload
                        </div>

                        <div className="selected-deps">
                            <div className="selected-deps-title">Selected Dependencies</div>
                            {selectedDepsArray.length === 0 ? (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    No dependencies selected
                                </span>
                            ) : (
                                selectedDepsArray.map(dep => (
                                    <span key={dep.id} className="selected-dep-tag">
                                        {dep.name}
                                    </span>
                                ))
                            )}
                        </div>

                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                                    </svg>
                                    Generate Project
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
