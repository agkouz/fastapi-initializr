export default function Database({ database, setDatabase, locked = false }) {
    return (
        <div className="section">
            <h2 className="section-title">Database</h2>
            {locked && (
                <div className="locked-deps-notice">
                    Enterprise mode: PostgreSQL is required
                </div>
            )}
            <div className={`radio-group ${locked ? 'locked' : ''}`}>
                {[
                    { value: 'none', label: 'None' },
                    { value: 'postgres', label: 'PostgreSQL' },
                    { value: 'mysql', label: 'MySQL' },
                    { value: 'mongodb', label: 'MongoDB' }
                ].map(db => (
                    <div className={`radio-option ${locked ? 'locked' : ''}`} key={db.value}>
                        <input
                            type="radio"
                            id={db.value}
                            name="database"
                            checked={database === db.value}
                            onChange={() => !locked && setDatabase(db.value)}
                            disabled={locked}
                        />
                        <label htmlFor={db.value}>
                            {db.label}
                            {locked && database === db.value && <span className="locked-badge">Required</span>}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}