import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { insertClient, getClientById, updateClient } from "../../services/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Reparar iconos de marcadores en react-leaflet con Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setValue }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setValue("lat", e.latlng.lat, { shouldValidate: true });
      setValue("lng", e.latlng.lng, { shouldValidate: true });
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

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
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await getClientById(id);
      if (data) {
        setValue("name", data.nombre);
        setValue("email", data.email);
        setValue("phone", data.telefono);
        setValue("lat", data.lat);
        setValue("lng", data.lng);
        if (data.lat && data.lng) setMapPosition({ lat: data.lat, lng: data.lng });
        if (data.logo_url) setPreview(data.logo_url);
      }
    };

    if (id) {
      cargarDatos();
    }
  }, [id, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("¡Error! Solo se permiten imágenes en formato PNG o JPG.");
        e.target.value = ''; // Limpiar el input
        return;
      }
      
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

    let result;
    if (id) {
      result = await updateClient(id, clientData);
    } else {
      result = await insertClient(clientData);
    }

    if (result.success) {
      navigate("/clients");
    } else {
      alert("Error al guardar el cliente: " + (result.error || "Desconocido"));
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
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">Añada el logo del cliente (JPG/PNG)</p>
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
                maxLength="9"
                {...register("phone", { 
                  pattern: { value: /^[0-9]{9}$/, message: "Debe contener exactamente 9 dígitos numéricos" }
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Ej: 600123456"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación del Cliente (Toca para fijar el mapa)
              </label>
              <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 z-0 relative">
                <MapContainer
                  center={mapPosition || [40.4168, -3.7038]} // Madrid por defecto
                  zoom={5}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationMarker
                    position={mapPosition}
                    setPosition={setMapPosition}
                    setValue={setValue}
                  />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Lat: {mapPosition?.lat?.toFixed(4) || "Ninguna"} / Lng: {mapPosition?.lng?.toFixed(4) || "Ninguna"}
              </p>
              
              {/* Campos ocultos para enviar al hook de react-form */}
              <input type="hidden" {...register("lat")} />
              <input type="hidden" {...register("lng")} />
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
