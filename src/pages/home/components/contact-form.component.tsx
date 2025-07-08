import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { contactService } from "../../../services/api.service";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

interface ContactForm {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  condiciones?: boolean;
  recaptcha: string;
}

interface TouchedFields {
  fullName?: boolean;
  email?: boolean;
  phone?: boolean;
  message?: boolean;
  condiciones?: boolean;
  recaptcha?: boolean;
}

export default function ContactFormComponent() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [form, setForm] = useState<ContactForm>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    recaptcha: "",
  });
  const [touched, setTouched] = useState<TouchedFields>({});

  const errors = {
    fullName: !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(form.fullName) || form.fullName.trim().length < 3 || form.fullName.length > 100,
    email: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email) || form.email.length > 70,
    phone: !/^\d{10}$/.test(form.phone),
    message: form.message.trim().length < 10 || form.message.length > 1000,
    condiciones: !form.condiciones,
    recaptcha: !form.recaptcha,
  };

  const isValid = Object.values(errors).every((v) => v === false);

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      let sanitizedValue = sanitizeInput(value);
      if (name === "fullName") {
        sanitizedValue = sanitizedValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      } else if (name === "phone") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");
      }
      setForm((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const handleRecaptcha = (token: string | null) => {
    setForm((prev) => ({ ...prev, recaptcha: token || "" }));
    setTouched((prev) => ({ ...prev, recaptcha: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true,
      condiciones: true,
      recaptcha: true,
    });

    if (isValid) {
      try {
        const sanitizedForm = {
          fullName: sanitizeInput(form.fullName),
          email: sanitizeInput(form.email),
          phone: sanitizeInput(form.phone),
          message: sanitizeInput(form.message),
          recaptcha: form.recaptcha, 
        };

        await contactService.submitContact(sanitizedForm);

        Swal.fire({
          icon: "success",
          title: "¡Enviado!",
          text: "¡Gracias por contactarnos! Pronto te responderemos.",
          confirmButtonColor: "#2563eb",
        });

        setForm({
          fullName: "",
          email: "",
          phone: "",
          message: "",
          condiciones: false,
          recaptcha: "",
        });
        setTouched({});
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar el formulario. Por favor, intenta de nuevo más tarde.",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  return (
    <section
      className="min-h-screen bg-gray-600 flex items-center justify-center bg-cover bg-center py-20"
      style={{
        backgroundImage: "url('https://source.unsplash.com/1600x900/?truck')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          ¡Encuentra tu camioneta ideal!
        </h2>
        <p className="text-center text-gray-600 mb-10 font-medium text-lg">
          Déjanos tus datos y te contactaremos con las mejores opciones
          personalizadas.
        </p>
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700"
            >
              Nombre Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              maxLength={100}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*"
              className="mt-2 block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
              placeholder="Tu nombre completo"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
            />
            {touched.fullName && errors.fullName && (
              <div className="text-red-500 text-sm mt-2">
                El nombre debe tener entre 3 y 100 caracteres, solo letras y espacios.
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              maxLength={70}
              className="mt-2 block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
            />
            {touched.email && errors.email && (
              <div className="text-red-500 text-sm mt-2">
                Ingresa un correo electrónico válido (máximo 70 caracteres).
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700"
            >
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={10}
              pattern="\d{10}"
              className="mt-2 block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
              placeholder="1234567890"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
            />
            {touched.phone && errors.phone && (
              <div className="text-red-500 text-sm mt-2">
                Ingresa un teléfono válido (exactamente 10 dígitos, solo números).
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={1000}
              className="mt-2 block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 text-gray-900 placeholder-gray-400 h-40 resize-y"
              placeholder="Cuéntanos qué tipo de camioneta buscas..."
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
            />
            {touched.message && errors.message && (
              <div className="text-red-500 text-sm mt-2">
                El mensaje es requerido (mínimo 10 caracteres, máximo 1000).
              </div>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="condiciones"
              name="condiciones"
              checked={form.condiciones}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
            />
            <label htmlFor="condiciones" className="ml-2">
              Acepto los{" "}
              <a href="/terminos" className="enlace-terminos text-blue-400">
                Términos y Condiciones
              </a>{" "}
              y{" "}
              <a href="/aviso" className="text-blue-400">
                Aviso de Privacidad
              </a>
            </label>
            {touched.condiciones && errors.condiciones && (
              <div className="text-red-500 text-sm mt-2">
                Debes aceptar los términos y condiciones.
              </div>
            )}
          </div>
          <div className="grid justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Ld8Z2srAAAAAC-LdwLTVr7JYf74B8DU44jzKkoM"
              onChange={handleRecaptcha}
            />
            {touched.recaptcha && errors.recaptcha && (
              <div className="text-red-500 text-sm mt-2">
                Debes completar el reCAPTCHA.
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-semibold text-lg"
          >
            Contáctame
          </button>
        </form>
      </div>
    </section>
  );
}