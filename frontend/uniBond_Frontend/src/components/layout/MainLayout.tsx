import TopNavbar from "./TopNavbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}