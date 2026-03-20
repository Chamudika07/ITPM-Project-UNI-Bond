import type { ChangeEvent } from "react";

type Option = {
    value: string;
    label: string;
};

type Props = {
    id?: string;
    name?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    className?: string;
    label?: string;
};

export default function Select({ id, name, value, onChange, options, className, label }: Props) {
    return (
        <div className="mb-3">
            {label && <label htmlFor={id} className="block text-sm">{label}</label>}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={className || "border p-2 w-full rounded"}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}