import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorLogin, setErrorLogin] = useState(null);
  const [cargando, setCargando] = useState(false);

  const onSubmit = async (data) => {
    setCargando(true);
    setErrorLogin(null);

    const resultado = await login(data.email, data.password);

    if (resultado.success) {
      navigate("/dashboard");
    } else {
      setErrorLogin(resultado.error);
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">WorkPad</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus trabajos y clientes de forma fácil y rápida
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              {...register("email", { required: true })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                El email es obligatorio
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password", { required: true })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                La contraseña es obligatoria
              </span>
            )}
          </div>

          {errorLogin && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
              {errorLogin}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 w-full bg-primary hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-colors opacity-90 hover:opacity-100 disabled:opacity-50"
          >
            {cargando ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
