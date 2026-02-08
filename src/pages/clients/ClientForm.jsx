import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { insertClient, getClientById, updateClient } from "../../services/api";

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    const data = await getClientById(id);
    if (data) {
      setValue("name", data.nombre);
      setValue("email", data.email);
      setValue("phone", data.telefono);
      setValue("lat", data.lat);
      setValue("lng", data.lng);
      if (data.logo_url) setPreview(data.logo_url);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const clientData = {
      ...data,
      logo: logoFile || preview,
    };

    let success;
    if (id) {
      success = await updateClient(id, clientData);
    } else {
      success = await insertClient(clientData);
    }

    if (success) {
      navigate("/clients");
    } else {
      alert("Error al guardar el cliente");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/clients")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="text-gray-400" size={30} />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">Click para subir logo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Empresa *
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Ej: Tech Solutions SL"
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="contacto@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="+34 600..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitud
              </label>
              <input
                type="number"
                step="any"
                {...register("lat")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Ej: 40.416"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitud
              </label>
              <input
                type="number"
                step="any"
                {...register("lng")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Ej: -3.703"
              />
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
                  Guardar Cliente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
