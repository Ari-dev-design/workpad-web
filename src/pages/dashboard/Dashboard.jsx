import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getClients, getAllProjects, getAllInvoices } from "../../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    income: 0,
    clients: 0,
    projects: 0,
    totalProjects: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    const [clientsData, projectsData, invoicesData] = await Promise.all([
      getClients(),
      getAllProjects(),
      getAllInvoices(),
    ]);

    const totalIncome = invoicesData
      .filter((inv) => inv.status === "Paid" || inv.status === "Pagada")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const activeProjects = projectsData.filter(
      (p) => p.status === "En Progreso" || p.status === "In Progress",
    ).length;

    setStats({
      income: totalIncome,
      clients: clientsData.length,
      projects: activeProjects,
      totalProjects: projectsData.length,
    });

    setRecentProjects(projectsData.slice(0, 3));
    setLoading(false);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500">
          Bienvenido de nuevo, aquí tienes el resumen de tu negocio.
        </p>
      </div>

      {/* Grid Responsive: 1 columna en móvil, 3 en escritorio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Ingresos Totales
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : `${stats.income.toLocaleString()} €`}
            </h3>
          </div>
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Proyectos en Marcha
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : stats.projects}
            </h3>
            <span className="text-xs text-gray-400">
              De {stats.totalProjects} proyectos totales
            </span>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <FolderOpen size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Clientes Totales
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : stats.clients}
            </h3>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Proyectos Recientes</h3>
          <Link
            to="/projects"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando datos...</div>
        ) : recentProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No hay actividad reciente.
          </div>
        ) : (
          <div>
            {recentProjects.map((project) => (
              <div
                key={project.id}
                // CAMBIO RESPONSIVE AQUÍ: flex-col en móvil, flex-row en escritorio
                className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4 sm:gap-0"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  <p className="text-sm text-gray-500">
                    {project.description || "Sin descripción"}
                  </p>
                </div>

                {/* Contenedor de estado y precio: Ajustado para móvil */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      project.status === "Pagado"
                        ? "bg-green-100 text-green-700"
                        : project.status === "En Progreso"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="font-bold text-gray-700">
                    {project.price} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
