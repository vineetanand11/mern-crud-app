function SelectInput({
    label,
    options,
    error,
    ...props
}){
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <select
                {...props}
                className={`w-full rounded-lg bg-white/10 border ${
                        error ? 'border-red-500' : 'border-white/20'
                    } px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 
                    [&>option]:text-gray-900 [&>option]:bg-white
                    [&>option:checked]:text-white [&>option:checked]:bg-purple-600`}
            >
                <option value="">{props.placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
}

export default SelectInput;
