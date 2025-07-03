import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { authService } from "../../../services/api.service";

const ForgotPasswordView = () => {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(identifier);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "¡Solicitud enviada!",
          text: response.message,
          confirmButtonColor: "#2563eb",
          timer: 3000,
          showConfirmButton: false,
        });
        setIdentifier("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "No se pudo procesar tu solicitud.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            TITAN MOTORS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-300"
          >
            Recupera tu contraseña
          </motion.p>
        </div>

        {/* Forgot Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Instructions */}
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm">
                Ingresa tu correo electrónico o nombre de usuario y te
                enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {/* Identifier Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Correo Electrónico o Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="admin@titanmotors.mx o usuario"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center">
                  Enviar enlace de recuperación
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center justify-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordView;
