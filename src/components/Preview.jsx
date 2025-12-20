export default function Preview({ projectName, packaging, structure, packageName, selectedDepsArray, loading, handleGenerate }) {
    return (
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
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        Generate Project
                    </>
                )}
            </button>
        </div>
    );
}