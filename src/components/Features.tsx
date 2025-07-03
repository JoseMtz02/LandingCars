import { motion } from "framer-motion";
import {
  CheckCircle,
  Zap,
  Shield,
  Award,
  Headphones,
  Truck,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Tecnología Avanzada",
      description:
        "Sistemas de navegación GPS, conectividad Bluetooth y pantallas táctiles de última generación.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Máxima Seguridad",
      description:
        "Sistemas de frenado ABS, airbags múltiples y tecnología de asistencia al conductor.",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Truck,
      title: "Rendimiento Superior",
      description:
        "Motores potentes y eficientes con capacidades de carga excepcionales para cualquier trabajo.",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Award,
      title: "Calidad Premium",
      description:
        "Materiales de primera calidad y acabados excepcionales en cada detalle del vehículo.",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Headphones,
      title: "Soporte 24/7",
      description:
        "Atención al cliente las 24 horas, mantenimiento especializado y garantía extendida.",
      color: "from-red-400 to-rose-500",
    },
    {
      icon: CheckCircle,
      title: "Garantía Total",
      description:
        "Garantía completa de fábrica con cobertura integral y servicio técnico especializado.",
      color: "from-indigo-400 to-blue-500",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Titan Motors?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Combinamos innovación, calidad y servicio excepcional para brindarte
            la mejor experiencia en vehículos comerciales y camionetas premium.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para encontrar tu camioneta ideal?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Nuestros expertos están listos para ayudarte a elegir el vehículo
              perfecto para tus necesidades específicas.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Consulta Gratuita
              <CheckCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
