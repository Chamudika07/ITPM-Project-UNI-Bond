type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({ title, children, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-slate-100/60 p-5 sm:p-6 ${className}`}>
      <h3 className="text-[1.05rem] font-bold text-slate-800 mb-4 tracking-tight">{title}</h3>
      {children}
    </div>
  );
}