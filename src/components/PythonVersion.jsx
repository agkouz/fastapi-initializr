export default function PythonVersion({pythonVersion, setPythonVersion}) {
    return (
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
    );
}