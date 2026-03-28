type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({ title, children, className = "" }: Props) {
  return (
    <div className={`bg-gray-300 border border-gray-400/40 rounded-2xl shadow-sm p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
      {children}
    </div>
  );
}