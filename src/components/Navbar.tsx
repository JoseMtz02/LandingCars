import { motion } from "framer-motion";
import { Car, MapPin, Phone, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TITAN MOTORS
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Premium Trucks</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollTo("hero")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollTo("categories")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Catálogo
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Características
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Testimonios
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contacto
            </button>
          </nav>

          {/* Contact Info & Login */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+52 55 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Ciudad de México, MX</span>
              </div>
            </div>

            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>Acceder</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gray-700"
            />
            <motion.div
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-gray-700"
            />
            <motion.div
              animate={
                isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="w-6 h-0.5 bg-gray-700"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            isMenuOpen
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/20"
        >
          <div className="py-6 space-y-4">
            <button
              onClick={() => scrollTo("hero")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollTo("categories")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Catálogo
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Características
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Testimonios
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Contacto
            </button>

            <div className="px-4 pt-4 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+52 55 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Ciudad de México, MX</span>
                </div>
              </div>

              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Acceder</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;
