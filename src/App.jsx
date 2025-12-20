import { useState, useMemo } from 'react';
import { CURATED_PACKAGES, FALLBACK_DATABASE } from './config.js';
import { generateProject } from './utils/generator.js';

// components
import Metadata from './components/Metadata.jsx';
import PythonVersion from './components/PythonVersion.jsx';
import Packaging from './components/Packaging.jsx';
import Structure from './components/Structure.jsx';
import Database from './components/Database.jsx';
import Dependencies from './components/Dependencies.jsx';
import Preview from './components/Preview.jsx';

import './App.css';

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
                    <Metadata
                        projectName={projectName}
                        setProjectName={setProjectName}
                        description={description}
                        setDescription={setDescription}
                        packageName={packageName}
                        setPackageName={setPackageName}
                    /> 

                    {/* Python Version */}
                    <PythonVersion
                        pythonVersion={pythonVersion}
                        setPythonVersion={setPythonVersion}
                    />  

                    {/* Packaging */}
                    <Packaging
                        packaging={packaging}
                        setPackaging={setPackaging}
                    />

                    {/* Project Structure */}
                    <Structure
                        structure={structure}
                        setStructure={setStructure}
                    />           

                    {/* Database */}
                    <Database
                        database={database}
                        setDatabase={setDatabase}
                    />

                    {/* Dependencies */}
                    <Dependencies 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        filter={filter} 
                        setFilter={setFilter} 
                        selectedDeps={selectedDeps} 
                        toggleDependency={toggleDependency} 
                        filteredDeps={filteredDeps} 
                    />
                </div>

                {/* Preview Sidebar */}
                <div className="sidebar">
                    <Preview 
                        projectName={projectName}
                        packaging={packaging}
                        structure={structure}
                        packageName={packageName}
                        selectedDepsArray={selectedDepsArray}
                        loading={loading}
                        handleGenerate={handleGenerate}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
