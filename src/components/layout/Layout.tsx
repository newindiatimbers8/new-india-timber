
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer className="hidden md:block" />
      <BottomNavigation />
    </div>
  );
};

export default Layout;
