import { FC, ReactNode } from "react";
import { Sidebar, Navbar } from "./common";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen font-franklin">
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>
      <div className="w-4/5 flex flex-col h-full">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
