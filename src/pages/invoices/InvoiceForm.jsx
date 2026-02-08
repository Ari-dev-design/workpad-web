import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import Layout from "../../components/layout/Layout";
import {
  insertInvoice,
  getInvoiceById,
  updateInvoice,
  getAllProjects,
  supabase,
} from "../../services/api";

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const projectsData = await getAllProjects();
    setProjects(projectsData);

    if (id) {
      const invoice = await getInvoiceById(id);
      if (invoice) {
        setValue("number", invoice.number);
        setValue("amount", invoice.amount);
        setValue("date", invoice.date);
        setValue("status", invoice.status);
        setValue("project_id", invoice.project_id);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Preparar datos con user_id
    const invoiceData = { ...data, user_id: user.id };

    let success;
    if (id) {
      success = await updateInvoice(id, invoiceData);
    } else {
      success = await insertInvoice(invoiceData);
    }

    if (success) {
      navigate("/invoices");
    } else {
      alert("Error al guardar la factura");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/invoices")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? "Editar Factura" : "Nueva Factura"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto *
              </label>
              <select
                {...register("project_id", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:border-primary"
              >
                <option value="">Selecciona un proyecto...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número Factura
              </label>
              <input
                {...register("number", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary"
                placeholder="FV-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importe (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("amount", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Emisión
              </label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                {...register("status")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:border-primary"
              >
                <option value="Pending">Pendiente</option>
                <option value="Paid">Pagada</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 mt-6"
          >
            <Save size={20} />
            {loading ? "Guardando..." : "Guardar Factura"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
