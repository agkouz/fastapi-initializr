export default function Dependencies({
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    selectedDeps,
    toggleDependency,
    filteredDeps,
    lockedDeps = new Set()
}) {
    const hasLockedDeps = lockedDeps.size > 0;

    return (
        <div className="section">
            <h2 className="section-title">Dependencies</h2>

            {hasLockedDeps && (
                <div className="locked-deps-notice">
                    Enterprise mode: core dependencies are locked
                </div>
            )}

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
                {filteredDeps.map(dep => {
                    const isLocked = lockedDeps.has(dep.id);
                    return (
                        <div
                            key={dep.id}
                            className={`dependency-item ${isLocked ? 'locked' : ''}`}
                        >
                            <input
                                type="checkbox"
                                id={`dep-${dep.id}`}
                                checked={selectedDeps.has(dep.id)}
                                onChange={() => toggleDependency(dep.id)}
                                disabled={isLocked}
                            />
                            <label htmlFor={`dep-${dep.id}`}>
                                <div className="dependency-name">
                                    {dep.name}
                                    {isLocked && <span className="locked-badge">Required</span>}
                                </div>
                                <div className="dependency-description">{dep.description}</div>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}