function FormInput({
    label,
    error,
    ...props
}) {
    return (
        <div>
            {label && (
                <label
                    htmlFor={props.name}
                    className="block text-sm font-medium text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full rounded-lg bg-white/10 border ${
                    error ? 'border-red-500' : 'border-white/20'
                } px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600`}
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
}

export default FormInput;