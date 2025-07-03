import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Qué garantía ofrecen en sus camionetas?",
      answer:
        "Ofrecemos una garantía completa de 3 años o 100,000 km (lo que ocurra primero) que cubre motor, transmisión, sistemas eléctricos y carrocería. Además, incluimos 5 años de asistencia en carretera las 24 horas.",
    },
    {
      question: "¿Puedo personalizar mi camioneta según mis necesidades?",
      answer:
        "¡Absolutamente! Contamos con un equipo de especialistas que puede personalizar cualquier vehículo según tus requerimientos específicos. Desde modificaciones de carga hasta sistemas especializados para tu industria.",
    },
    {
      question: "¿Ofrecen opciones de financiamiento?",
      answer:
        "Sí, trabajamos con las mejores instituciones financieras mexicanas para ofrecerte planes flexibles de financiamiento. Contamos con opciones desde 12 hasta 84 meses con tasas preferenciales para empresas y descuentos especiales para pymes.",
    },
    {
      question: "¿Cuál es el tiempo de entrega de una camioneta?",
      answer:
        "Para vehículos en stock, la entrega es inmediata. Para personalizaciones especiales, el tiempo varía entre 15 a 45 días hábiles dependiendo de la complejidad de las modificaciones solicitadas.",
    },
    {
      question: "¿Qué incluye el servicio postventa?",
      answer:
        "Nuestro servicio incluye mantenimiento programado, repuestos originales, servicio técnico especializado, asistencia en carretera 24/7, y un programa de seguimiento personalizado para maximizar la vida útil de tu inversión.",
    },
    {
      question: "¿Manejan camionetas usadas o solo nuevas?",
      answer:
        "Manejamos tanto camionetas nuevas como seminuevos certificados. Todos nuestros vehículos usados pasan por un riguroso proceso de inspección de 150 puntos antes de ser ofrecidos al público.",
    },
    {
      question: "¿Cómo puedo saber qué camioneta es la ideal para mi negocio?",
      answer:
        "Contamos con un equipo de consultores especializados que analizará tus necesidades específicas: tipo de carga, rutas, frecuencia de uso, presupuesto y más factores para recomendarte la solución perfecta.",
    },
    {
      question: "¿Ofrecen programas para flotas empresariales?",
      answer:
        "Sí, tenemos programas especiales para flotas empresariales que incluyen descuentos por volumen, planes de mantenimiento empresarial, gestión integral de flota y asesoría especializada en optimización logística.",
    },
    {
      question: "¿Están certificados para operar en México?",
      answer:
        "Absolutamente. Contamos con todas las certificaciones mexicanas necesarias: NOM (Normas Oficiales Mexicanas), registro ante la PROFECO, y nuestros vehículos cumplen con todas las normativas de la SCT (Secretaría de Comunicaciones y Transportes).",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Preguntas
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              frecuentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Resolvemos las dudas más comunes sobre nuestros vehículos, servicios
            y procesos para que tomes la mejor decisión.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
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
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encontraste la respuesta que buscabas?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está disponible para resolver cualquier
              duda específica sobre nuestros vehículos y servicios.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Contactar Especialista
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
