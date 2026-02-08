import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import Layout from "../../components/layout/Layout";
import {
  insertProject,
  getProjectById,
  updateProject,
  getClients,
} from "../../services/api";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    // 1. Cargar la lista de clientes para el desplegable
    const clientsData = await getClients();
    setClients(clientsData);

    // 2. Si estamos editando, cargar los datos del proyecto
    if (id) {
      const project = await getProjectById(id);
      if (project) {
        setValue("title", project.title);
        setValue("description", project.description);
        setValue("price", project.price);
        setValue("deadline", project.deadline);
        setValue("status", project.status);
        setValue("client_id", project.client_id);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    let success;
    if (id) {
      success = await updateProject(id, data);
    } else {
      success = await insertProject(data);
    }

    if (success) {
      navigate("/projects");
    } else {
      alert("Error al guardar el proyecto");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Proyecto *
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Ej: Rediseño Web Corporativa"
              />
              {errors.title && (
                <span className="text-xs text-red-500">Campo obligatorio</span>
              )}
            </div>

            {/* Selector de Cliente */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <select
                {...register("client_id", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none bg-white"
              >
                <option value="">Selecciona un cliente...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nombre}
                  </option>
                ))}
              </select>
              {errors.client_id && (
                <span className="text-xs text-red-500">
                  Debes elegir un cliente
                </span>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Fecha Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Entrega
              </label>
              <input
                type="date"
                {...register("deadline")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
            </div>

            {/* Estado */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                {...register("status")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none bg-white"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Pagado">Pagado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                {...register("description")}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none resize-none"
                placeholder="Detalles del proyecto..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={20} />
                  Guardar Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
