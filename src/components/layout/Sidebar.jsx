import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeClass = (path) =>
    location.pathname === path
      ? "bg-purple-50 text-primary border-r-4 border-primary"
      : "text-gray-500 hover:bg-gray-50";

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* logo */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-primary p-2 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">WorkPad</span>
      </div>

      {/* enlaces */}
      <nav className="flex-1 py-6 flex flex-col gap-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-6 py-3 transition-all ${activeClass("/dashboard")}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Resumen</span>
        </Link>

        <Link
          to="/clients"
          className={`flex items-center gap-3 px-6 py-3 transition-all ${activeClass("/clients")}`}
        >
          <Users size={20} />
          <span className="font-medium">Clientes</span>
        </Link>

        <Link
          to="/projects"
          className={`flex items-center gap-3 px-6 py-3 transition-all ${activeClass("/projects")}`}
        >
          <FolderOpen size={20} />
          <span className="font-medium">Proyectos</span>
        </Link>

        <Link
          to="/invoices"
          className={`flex items-center gap-3 px-6 py-3 transition-all ${activeClass("/invoices")}`}
        >
          <FileText size={20} />
          <span className="font-medium">Facturas</span>
        </Link>
      </nav>

      {/* boton salir */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
