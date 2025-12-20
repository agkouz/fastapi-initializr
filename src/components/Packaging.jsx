export default function Packaging({ packaging, setPackaging }) {
    return (
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
    );
}