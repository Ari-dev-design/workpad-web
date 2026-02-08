import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, FileText, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Layout from "../../components/layout/Layout";
import {
  getAllInvoices,
  deleteInvoice,
  getAllProjects,
} from "../../services/api";
import { InvoiceDocument } from "../../components/pdf/InvoiceDocument";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [invoicesData, projectsData] = await Promise.all([
      getAllInvoices(),
      getAllProjects(),
    ]);
    setInvoices(invoicesData);
    setProjects(projectsData);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Borrar esta factura?")) {
      await deleteInvoice(id);
      loadData();
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.title : "Sin proyecto";
  };

  return (
    <Layout>
      {/* RESPONSIVE: Cabecera flexible */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-800">Facturas</h1>
        <Link
          to="/invoices/new"
          className="bg-primary hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nueva Factura</span>
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Cargando...</p>}

      {!loading && invoices.length === 0 && (
        <div className="text-center p-10 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No hay facturas creadas.</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            // RESPONSIVE: flex-col en móvil para apilar elementos, flex-row en PC
            className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4 sm:gap-0"
          >
            {/* Bloque Izquierdo: Icono e Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div
                className={`p-3 rounded-lg ${
                  invoice.status === "Paid" || invoice.status === "Pagada"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  Factura #{invoice.number}
                </h3>
                <p className="text-sm text-gray-500">
                  {getProjectName(invoice.project_id)}
                </p>
              </div>
            </div>

            {/* Bloque Derecho: Precio, Fecha y Acciones */}
            {/* En móvil se pone debajo y ocupa todo el ancho con justify-between */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
              <div className="text-left sm:text-right">
                <p className="font-bold text-lg">{invoice.amount} €</p>
                <p className="text-xs text-gray-400">{invoice.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "Paid" || invoice.status === "Pagada"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {invoice.status === "Paid" || invoice.status === "Pagada"
                    ? "Pagada"
                    : "Pendiente"}
                </span>

                <PDFDownloadLink
                  document={
                    <InvoiceDocument
                      invoice={invoice}
                      projectName={getProjectName(invoice.project_id)}
                    />
                  }
                  fileName={`factura_${invoice.number}.pdf`}
                  className="text-gray-400 hover:text-blue-500 p-2 transition-colors"
                >
                  {({ loading }) => (loading ? "..." : <Download size={18} />)}
                </PDFDownloadLink>

                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
