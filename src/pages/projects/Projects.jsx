import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, Edit, Calendar, User } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { getAllProjects, deleteProject, getClients } from "../../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Cargamos proyectos y clientes a la vez para ir rápido
    const [projectsData, clientsData] = await Promise.all([
      getAllProjects(),
      getClients(),
    ]);
    setProjects(projectsData);
    setClients(clientsData);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Borrar este proyecto?")) {
      await deleteProject(id);
      loadData();
    }
  };

  // Buscar el nombre del cliente usando su ID
  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nombre : "Sin cliente";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pagado":
        return "bg-green-100 text-green-700";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "En Progreso":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
        <Link
          to="/projects/new"
          className="bg-primary hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Proyecto</span>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar proyecto..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-gray-500">Cargando...</p>}

      {!loading && projects.length === 0 && (
        <div className="text-center p-10 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No hay proyectos. ¡Crea el primero!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {project.price} €
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {project.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <User size={14} />
                <span className="font-medium text-primary">
                  {getClientName(project.client_id)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description || "Sin descripción"}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Calendar size={14} />
                <span>Entrega: {project.deadline || "Pendiente"}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <Link
                to={`/projects/edit/${project.id}`}
                className="flex-1 text-center py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-200"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
