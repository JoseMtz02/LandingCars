import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart3,
  Users,
  Car,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Download,
  Plus,
  UserCheck,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import UsersManagement from "../components/UsersManagement";
import ContactsManagement from "../components/ContactsManagement";
import MessagesManagement from "../components/MessagesManagement";

const DashboardView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const statsData = [
    {
      title: "Vehículos Totales",
      value: "524",
      change: "+12%",
      icon: Car,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Ventas del Mes",
      value: "89",
      change: "+23%",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Clientes Activos",
      value: "1,247",
      change: "+8%",
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Ingresos ($MX)",
      value: "43.2M",
      change: "+15%",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentSales = [
    {
      id: 1,
      customer: "Carlos Rodríguez",
      vehicle: "Camioneta Mediana Pro",
      amount: "$756,000",
      date: "2025-01-15",
      status: "Completada",
    },
    {
      id: 2,
      customer: "María González",
      vehicle: "Camioneta Compacta Urban",
      amount: "$513,000",
      date: "2025-01-14",
      status: "Pendiente",
    },
    {
      id: 3,
      customer: "Javier Martínez",
      vehicle: "Camioneta Grande Heavy",
      amount: "$1,060,200",
      date: "2025-01-13",
      status: "Completada",
    },
    {
      id: 4,
      customer: "Ana Fernández",
      vehicle: "Camioneta Mediana Flex",
      amount: "$705,600",
      date: "2025-01-12",
      status: "En proceso",
    },
  ];

  const inventory = [
    {
      id: 1,
      model: "Urban Compact",
      category: "Compacta",
      stock: 23,
      price: "$450,000",
      demand: "Alta",
    },
    {
      id: 2,
      model: "Pro Medium",
      category: "Mediana",
      stock: 15,
      price: "$630,000",
      demand: "Muy Alta",
    },
    {
      id: 3,
      model: "Heavy Duty",
      category: "Grande",
      stock: 8,
      price: "$810,000",
      demand: "Media",
    },
    {
      id: 4,
      model: "Eco Compact",
      category: "Compacta",
      stock: 31,
      price: "$396,000",
      demand: "Alta",
    },
  ];

  const menuItems = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "contacts", label: "Contactos", icon: MessageSquare },
    { id: "messages", label: "Mensajes", icon: Bell },
    ...(user?.role === "admin"
      ? [{ id: "users", label: "Usuarios", icon: UserPlus }]
      : []),
    { id: "vehicles", label: "Vehículos", icon: Car },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "sales", label: "Ventas", icon: TrendingUp },
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-green-600 text-sm font-medium mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Ventas Recientes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vehículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {sale.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {sale.vehicle}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          {sale.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              sale.status === "Completada"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "vehicles":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Inventario de Vehículos
              </h2>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Vehículo
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar vehículos..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Modelo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Demanda
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.model}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.stock}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          {item.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              item.demand === "Muy Alta"
                                ? "bg-red-100 text-red-800"
                                : item.demand === "Alta"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.demand}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "users":
        return <UsersManagement />;

      case "contacts":
        return <ContactsManagement />;

      case "messages":
        return <MessagesManagement />;

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sección en desarrollo
            </h3>
            <p className="text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        );
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">TITAN MOTORS</span>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                  : "text-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
                <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative text-gray-400 hover:text-gray-500">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Ir al sitio web
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">{renderContent()}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardView;
