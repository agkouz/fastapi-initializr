export default function Database({ database, setDatabase }) {
    return (
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
    );
}