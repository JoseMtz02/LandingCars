import { useState, useEffect } from "react";
import { contactService, usersService } from "../../../services/api.service";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  assignedUserId?: string;
  assignedUser?: {
    id: string;
    name: string;
  };
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ContactsManagement() {
  const { user: currentUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  useEffect(() => {
    loadContacts();
    loadUsers();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contactsData =
        currentUser?.role === "admin"
          ? await contactService.getContacts()
          : await contactService.getMyContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error("Error loading contacts:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los contactos",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (currentUser?.role === "admin") {
      try {
        const usersData = await usersService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
  };

  const handleAssignContact = async (userId: string) => {
    if (!selectedContact) return;

    try {
      await contactService.assignContact(selectedContact.id, userId);
      Swal.fire({
        icon: "success",
        title: "¡Asignado!",
        text: "Contacto asignado correctamente",
      });
      setShowAssignModal(false);
      setSelectedContact(null);
      loadContacts();
    } catch (error) {
      console.error("Error assigning contact:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo asignar el contacto",
      });
    }
  };

  const handleSendFollowUp = async () => {
    if (!selectedContact || !followUpMessage.trim()) return;

    try {
      await contactService.sendFollowUp(selectedContact.id, followUpMessage);
      Swal.fire({
        icon: "success",
        title: "¡Enviado!",
        text: "Email de seguimiento enviado correctamente",
      });
      setShowFollowUpModal(false);
      setSelectedContact(null);
      setFollowUpMessage("");
    } catch (error) {
      console.error("Error sending follow up:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el email de seguimiento",
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await contactService.deleteContact(contactId);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Contacto eliminado correctamente",
        });
        loadContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el contacto",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
      in_progress: { text: "En Progreso", class: "bg-blue-100 text-blue-800" },
      completed: { text: "Completado", class: "bg-green-100 text-green-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.class}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Contactos
            </h2>
            <p className="text-gray-600">
              {currentUser?.role === "admin"
                ? "Administra todos los contactos del sistema"
                : "Gestiona tus contactos asignados"}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {contacts.length} contactos
          </div>
        </div>
      </div>

      {/* Lista de contactos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Contactos</h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando contactos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignado a
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.assignedUser
                        ? contact.assignedUser.name
                        : "Sin asignar"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contact.createdAt).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {currentUser?.role === "admin" && (
                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowAssignModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Asignar
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowFollowUpModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Seguimiento
                        </button>
                        {(currentUser?.role === "admin" ||
                          contact.assignedUserId === currentUser?.id) && (
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contacts.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No hay contactos disponibles
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de asignación */}
      {showAssignModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Asignar Contacto: {selectedContact.fullName}
            </h3>
            <div className="space-y-3">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAssignContact(user.id)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedContact(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de seguimiento */}
      {showFollowUpModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Enviar Seguimiento: {selectedContact.fullName}
            </h3>
            <textarea
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              placeholder="Escribe tu mensaje de seguimiento..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleSendFollowUp}
                disabled={!followUpMessage.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
              >
                Enviar
              </button>
              <button
                onClick={() => {
                  setShowFollowUpModal(false);
                  setSelectedContact(null);
                  setFollowUpMessage("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
