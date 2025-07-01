export default function AvisoPrivacidad() {
  return (
    <body className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Titan Motors</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
            Aviso de Privacidad
          </h1>
          <p className="text-gray-600 mb-4 text-sm">
            Última actualización: 23 de junio de 2025
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            En Camionetas Ideal, nos comprometemos a proteger tus datos
            personales. Recolectamos únicamente nombre, correo electrónico y
            teléfono con el propósito exclusivo de contactarte respecto a tus
            preferencias de camionetas.
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-3">
            <li className="text-lg">
              No compartimos tus datos con terceros sin tu consentimiento
              explícito.
            </li>
            <li className="text-lg">
              Tienes derecho a solicitar la eliminación de tus datos en
              cualquier momento.
            </li>
            <li className="text-lg">
              Implementamos medidas de seguridad avanzadas para proteger tu
              información.
            </li>
          </ul>
          <p className="text-gray-600 text-sm mt-4">
            Para más detalles o para ejercer tus derechos, contáctanos a través
            de nuestro formulario en la página principal.
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
    </body>
  );
}
