import { motion } from "framer-motion";
import { ArrowRight, Fuel, Users, Package } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Camionetas Compactas",
      description: "Perfectas para distribución urbana y negocios ágiles",
      image: "/camionetas/cats/1.png",
      backgroundImage: "/camionetas/1.png",
      features: [
        "Eficiencia de combustible",
        "Fácil maniobrabilidad",
        "Carga hasta 1.5 toneladas",
      ],
      specs: {
        fuel: "8.5L/100km",
        capacity: "1,500 kg",
        passengers: "2-3",
      },
      price: "Desde $450,000",
      isPopular: false,
    },
    {
      id: 2,
      title: "Camionetas Medianas",
      description: "Versatilidad y rendimiento para múltiples aplicaciones",
      image: "/camionetas/cats/2.jpeg",
      backgroundImage: "/camionetas/2.png",
      features: [
        "Cabina doble",
        "Espacio de carga optimizado",
        "Tecnología avanzada",
      ],
      specs: {
        fuel: "9.2L/100km",
        capacity: "2,500 kg",
        passengers: "4-5",
      },
      price: "Desde $630,000",
      isPopular: true,
    },
    {
      id: 3,
      title: "Camionetas Grandes",
      description: "Máxima potencia y capacidad para trabajos pesados",
      image: "/camionetas/cats/3.jpg",
      backgroundImage: "/camionetas/3.png",
      features: ["Motor V8 turbo", "Tracción 4x4", "Capacidades extremas"],
      specs: {
        fuel: "11.5L/100km",
        capacity: "3,500 kg",
        passengers: "5-6",
      },
      price: "Desde $810,000",
      isPopular: false,
    },
  ];

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encuentra tu
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              camioneta ideal
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra amplia gama de camionetas diseñadas para satisfacer
            las necesidades específicas de tu negocio o estilo de vida.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Popular Badge */}
              {category.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MÁS POPULAR
                  </div>
                </div>
              )}

              <div
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ${category.isPopular ? "ring-4 ring-orange-400/50" : ""}`}
              >
                {/* Background Hero Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('${category.backgroundImage}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Category Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Category Image */}
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Fuel className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {category.specs.fuel}
                      </div>
                      <div className="text-xs text-gray-500">Consumo</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {category.specs.capacity}
                      </div>
                      <div className="text-xs text-gray-500">Carga</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {category.specs.passengers}
                      </div>
                      <div className="text-xs text-gray-500">Pasajeros</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Características destacadas:
                    </h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {category.price}
                        </div>
                        <div className="text-sm text-gray-500">Precio base</div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        document
                          .getElementById("contact")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                    >
                      <span>Solicitar Información</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-600 mb-6">
              Contamos con más de 50 modelos diferentes y podemos personalizar
              cualquier vehículo según tus necesidades específicas.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              Consulta Personalizada
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
