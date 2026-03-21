type Props = {
    label: string;
    name: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ label, name, type = "text", onChange }: Props) {
    return (
        <div className="mb-3">
            <label className="block text-sm">{label}</label>
            <input
                placeholder={label}
                name={name}
                type={type}
                onChange={onChange}
                className="border p-2 w-full rounded"
            />
        </div>
    );
}