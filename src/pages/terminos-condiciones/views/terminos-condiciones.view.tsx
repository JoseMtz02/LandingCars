export default function TerminosCondicionesView() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Camionetas Ideal</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600 mb-4 text-sm">
            Última actualización: 23 de junio de 2025
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Bienvenido a Camionetas Ideal. Al utilizar nuestro sitio web y
            servicios, aceptas cumplir con los siguientes términos y
            condiciones.
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-3">
            <li className="text-lg">
              Debes proporcionar información veraz y actualizada en todo
              momento.
            </li>
            <li className="text-lg">
              Nos reservamos el derecho de modificar estos términos sin previo
              aviso.
            </li>
            <li className="text-lg">
              La disponibilidad de los vehículos está sujeta a inventario
              existente.
            </li>
          </ul>
          <p className="text-gray-600 text-sm mt-4">
            Para cualquier consulta, visita nuestra página de contacto o utiliza
            el formulario disponible.
          </p>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 Camionetas Ideal. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
