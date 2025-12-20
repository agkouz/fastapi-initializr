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

export default function Structure({ structure, setStructure }) {
    return (
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
    )
}