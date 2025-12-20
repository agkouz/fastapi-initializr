export default function Dependencies({ 
    searchTerm, 
    setSearchTerm, 
    filter, 
    setFilter, 
    selectedDeps, 
    toggleDependency, 
    filteredDeps 
}) {
    return (
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
                    >
                        <input
                            type="checkbox"
                            id={`dep-${dep.id}`}
                            checked={selectedDeps.has(dep.id)}
                            onChange={() => toggleDependency(dep.id)}
                        />
                        <label htmlFor={`dep-${dep.id}`}>
                            <div className="dependency-name">{dep.name}</div>
                            <div className="dependency-description">{dep.description}</div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}