import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Carlos Rodríguez",
      position: "Director de Logística",
      company: "TransporteCorp",
      content:
        "Titan Motors transformó completamente nuestra flota de distribución en el área metropolitana. La calidad y el rendimiento de sus camionetas han superado todas nuestras expectativas, especialmente en las rutas del Estado de México.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "María González",
      position: "Empresaria",
      company: "Construcciones MG",
      content:
        "Como mujer en el sector construcción, necesitaba vehículos confiables y potentes. Titan Motors me ofreció exactamente lo que buscaba con un servicio personalizado increíble.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Javier Martínez",
      position: "Propietario",
      company: "Granja Los Robles",
      content:
        "Llevo 20 años en el negocio agrícola y nunca había tenido camionetas tan resistentes y eficientes. La inversión se pagó sola en menos de un año.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Ana Fernández",
      position: "Gerente de Operaciones",
      company: "DeliveryExpress",
      content:
        "El equipo de Titan Motors entendió perfectamente nuestras necesidades de distribución urbana en la CDMX. Las camionetas compactas han optimizado nuestras rutas por Polanco, Condesa y Roma Norte significativamente.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Roberto Silva",
      position: "Contratista",
      company: "Silva & Asociados",
      content:
        "La potencia y durabilidad de estas camionetas es impresionante. Hemos trabajado en terrenos difíciles y nunca nos han fallado. Recomiendo Titan Motors al 100%.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "Patricia López",
      position: "Directora",
      company: "Eventos Premium",
      content:
        "Para nuestro negocio de eventos, necesitábamos vehículos elegantes y funcionales. Titan Motors nos proporcionó la solución perfecta con un servicio excepcional.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40v-40h40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Lo que dicen nuestros
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              clientes
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Más de 10,000 clientes satisfechos confían en Titan Motors para sus
            necesidades de transporte comercial y personal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <Quote className="w-8 h-8 text-blue-400" />
              </div>

              {/* Stars */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-200 leading-relaxed mb-8 text-lg italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-blue-400/50">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {testimonial.position}
                  </p>
                  <p className="text-blue-400 text-sm font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="text-white">
            <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
            <div className="text-gray-300">Satisfacción del Cliente</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold text-blue-400 mb-2">4.9/5</div>
            <div className="text-gray-300">Calificación Promedio</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-300">Vehículos Entregados</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold text-blue-400 mb-2">15+</div>
            <div className="text-gray-300">Años de Experiencia</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
