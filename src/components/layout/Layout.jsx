import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 md:ml-64 p-4 md:p-8">{children}</div>
    </div>
  );
}
