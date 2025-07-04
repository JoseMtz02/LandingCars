import { useState, useEffect } from "react";
import { messagesService, contactService } from "../../../services/api.service";
import { useAuth } from "../../../hooks/useAuth";
import type { Contact, Message } from "../../../types/contacts";
import Swal from "sweetalert2";

export default function MessagesManagement() {
  const { user: currentUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadContacts();
    loadUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadContactMessages(selectedContact.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response =
        currentUser?.role === "admin"
          ? await contactService.getContacts()
          : await contactService.getMyContacts();
      
      // Extraer los contactos de la respuesta
      const contactsData = response.data || [];
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

  const loadUnreadCount = async () => {
    try {
      const { count } = await messagesService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const loadContactMessages = async (contactId: number) => {
    try {
      const messagesData = await messagesService.getContactMessages(contactId);
      setMessages(messagesData);
      // Marcar mensajes como leídos
      await messagesService.markAsRead(contactId);
      loadUnreadCount(); // Actualizar contador
    } catch (error) {
      console.error("Error loading messages:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los mensajes",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    try {
      await messagesService.createMessage(selectedContact.id, newMessage);
      setNewMessage("");
      loadContactMessages(selectedContact.id);
      Swal.fire({
        icon: "success",
        title: "¡Enviado!",
        text: "Mensaje enviado correctamente",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el mensaje",
      });
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
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
        await messagesService.deleteMessage(messageId);
        if (selectedContact) {
          loadContactMessages(selectedContact.id);
        }
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Mensaje eliminado correctamente",
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el mensaje",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Mensajes
            </h2>
            <p className="text-gray-600">Comunicación con contactos</p>
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} mensajes sin leer
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de contactos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contactos</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Cargando...</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {contact.fullName}
                  </div>
                  <div className="text-sm text-gray-500">{contact.email}</div>
                  <div className="text-sm text-gray-500">{contact.phone}</div>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No hay contactos disponibles
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat de mensajes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedContact ? (
            <>
              {/* Header del chat */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Chat con {selectedContact.fullName}
                </h3>
                <p className="text-sm text-gray-500">{selectedContact.email}</p>
              </div>

              {/* Mensajes */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-900">{message.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString(
                              "es-MX"
                            )}
                          </span>
                          {!message.isRead && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No hay mensajes en esta conversación
                  </div>
                )}
              </div>

              {/* Input para nuevo mensaje */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 h-fit"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay conversación seleccionada
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un contacto para ver los mensajes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
