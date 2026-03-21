type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({ title, children, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}