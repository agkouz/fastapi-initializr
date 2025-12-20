
export default function Metadata({
    projectName,
    setProjectName,
    description,
    setDescription,
    packageName,
    setPackageName,
}) {
    return (
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
    );
}