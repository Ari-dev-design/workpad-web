import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, Edit, Phone, Mail, MapPin } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { getClients, deleteClient } from "../../services/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // cargar clientes al entrar
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const data = await getClients();
    setClients(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de borrar este cliente?")) {
      await deleteClient(id);
      loadClients(); // recargamos la lista
    }
  };

  // filtro para el buscador
  const filteredClients = clients.filter((client) =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      {/* RESPONSIVE: Cabecera flexible (columna en móvil, fila en PC) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <Link
          to="/clients/new"
          className="bg-primary hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </Link>
      </div>

      {/* buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* estado de carga */}
      {loading && (
        <p className="text-center text-gray-500">Cargando clientes...</p>
      )}

      {/* se muestra si no hay clientes */}
      {!loading && clients.length === 0 && (
        <div className="text-center p-10 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No tienes clientes todavía.</p>
        </div>
      )}

      {/* grid de tarjetas (Ya es responsive: 1 col en móvil, 2 en tablet, 3 en PC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* si tiene logo lo mostramos, si no una letra */}
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt="Logo"
                    className="w-12 h-12 rounded-full object-cover bg-gray-50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-primary font-bold text-xl">
                    {client.nombre.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{client.nombre}</h3>
                  <p className="text-xs text-gray-500">Agregado hace poco</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {client.email}
                </div>
              )}
              {client.telefono && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {client.telefono}
                </div>
              )}
              {client.lat && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-xs">Ubicación registrada</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <Link
                to={`/clients/edit/${client.id}`}
                className="flex-1 text-center py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-200"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(client.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
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
