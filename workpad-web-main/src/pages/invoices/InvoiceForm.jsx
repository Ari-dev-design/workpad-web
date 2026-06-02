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
  getAllInvoices,
  supabase,
} from "../../services/api";

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
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

    loadData();
  }, [id, setValue]);

  const selectedProjectId = watch("project_id");
  const selectedDate = watch("date");

  useEffect(() => {
    const generateNumber = async () => {
      // Auto-generar tanto en "Nueva Factura" como al Editar
      if (projects.length === 0) return;

      if (!selectedProjectId && !selectedDate) {
        setValue("number", "", { shouldValidate: true });
        return;
      }

      // Fallback a "XXXX" si no hay proyecto
      let prefixText = "XXXX";
      if (selectedProjectId) {
        const project = projects.find((p) => p.id == selectedProjectId);
        if (project && project.title) {
          const letters = project.title.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase();
          prefixText = letters.length > 0 ? letters : "PROY";
        }
      }

      // Fallback a hoy si no hay fecha seleccionada
      const targetDate = selectedDate || new Date().toISOString().split('T')[0];
      const dateParts = targetDate.split('-');
      
      let yy = "00";
      let month = "00";
      if (dateParts.length === 3) {
        const [year, m] = dateParts;
        yy = year.substring(2, 4);
        month = m;
      }
      
      const prefix = `${prefixText}-${month}${yy}-`;

      // 3. Consultar las facturas existentes para hallar la numeración secuencial
      const allInvoices = await getAllInvoices();
      const matchingInvoices = allInvoices.filter((inv) => inv.number?.startsWith(prefix));
      
      let nextNumber = 1;
      if (matchingInvoices.length > 0) {
        const sequences = matchingInvoices.map((inv) => {
          const parts = inv.number.split('-');
          return parseInt(parts[parts.length - 1], 10) || 0;
        });
        nextNumber = Math.max(...sequences) + 1;
      }

      // Format as 3 digits (Ej: 001)
      const formattedSeq = nextNumber.toString().padStart(3, '0');
      setValue("number", `${prefix}${formattedSeq}`, { shouldValidate: true });
    };

    generateNumber();
  }, [id, selectedProjectId, selectedDate, projects, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Preparar datos con user_id
    const invoiceData = { ...data, user_id: user.id };

    let result;
    if (id) {
      result = await updateInvoice(id, invoiceData);
    } else {
      result = await insertInvoice(invoiceData);
    }

    if (result.success) {
      navigate("/invoices");
    } else {
      alert("Error al guardar la factura: " + (result.error || "Desconocido"));
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
                Número Factura (Auto-generado)
              </label>
              <input
                readOnly
                {...register("number", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary bg-gray-50 text-gray-500 font-medium"
                placeholder="Rellena un Proyecto o Fecha..."
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
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagada</option>
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
