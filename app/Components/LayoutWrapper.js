"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { SidebarProvider } from "../Common/Context/SidebarContext";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/" || pathname === "/Common/pages/login";

  if (hideLayout) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <SidebarProvider>
      <Header />
      <main className="flex-1 md:ml-56">{children}</main>
      <Footer />
    </SidebarProvider>
  );
}
