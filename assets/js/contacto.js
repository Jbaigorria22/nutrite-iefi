// Contacto — validación del formulario y envío real del mensaje por email.
// El envío lo hace el servicio FormSubmit (ver email.js y config.js).

import { actualizarContadorHeader } from "./agregar.js";
import { enviarEmail } from "./email.js";
import { URL_EMAIL } from "./config.js";

const form = document.getElementById("form-contacto");
const mensajeEstado = document.getElementById("contacto-estado");
const botonEnviar = form.querySelector('button[type="submit"]');

function marcarCampo(input, mensajeError) {
  const campo = input.closest(".campo");
  const ayuda = campo.querySelector(".campo__ayuda");

  if (mensajeError) {
    campo.classList.add("campo--error");
    ayuda.textContent = mensajeError;
    return false;
  }

  campo.classList.remove("campo--error");
  ayuda.textContent = ayuda.dataset.textoOriginal || "";
  return true;
}

function validar() {
  const f = form.elements;
  const resultados = [
    marcarCampo(f.nombre, f.nombre.value.trim().length < 3 ? "Ingresá tu nombre" : ""),
    marcarCampo(
      f.email,
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()) ? "Ingresá un email válido" : ""
    ),
    marcarCampo(f.mensaje, f.mensaje.value.trim().length < 10 ? "Contanos un poco más (mínimo 10 caracteres)" : ""),
  ];
  return !resultados.includes(false);
}

// Arma los datos del email (los campos con _ son opciones de FormSubmit)
function armarEmailContacto() {
  const f = form.elements;
  return {
    _subject: "Nueva consulta desde la web — " + f.motivo.value,
    _template: "table",
    _autoresponse: "¡Gracias por escribirnos! Recibimos tu consulta y te respondemos a la brevedad. — Nutrite",
    nombre: f.nombre.value.trim(),
    email: f.email.value.trim(),
    motivo: f.motivo.value,
    mensaje: f.mensaje.value.trim(),
  };
}

async function enviarMensaje(evento) {
  evento.preventDefault();
  mensajeEstado.textContent = "";
  mensajeEstado.classList.remove("is-error");

  if (!validar()) {
    mensajeEstado.textContent = "Revisá los campos marcados.";
    mensajeEstado.classList.add("is-error");
    return;
  }

  const nombre = form.elements.nombre.value.trim().split(" ")[0];
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";

  try {
    await enviarEmail(URL_EMAIL, armarEmailContacto());
    mensajeEstado.textContent = `¡Gracias, ${nombre}! Recibimos tu mensaje y te respondemos a la brevedad.`;
    form.reset();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "No pudimos enviar tu mensaje. Revisá tu conexión e intentá de nuevo.";
    mensajeEstado.classList.add("is-error");
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar mensaje";
  }
}

function inicializarEventos() {
  // guardo el texto de ayuda original para restaurarlo cuando el campo es válido
  form.querySelectorAll(".campo__ayuda").forEach((ayuda) => {
    ayuda.dataset.textoOriginal = ayuda.textContent;
  });

  // Evento: enviar el formulario
  form.addEventListener("submit", enviarMensaje);

  // Evento: limpiar el error de un campo apenas el usuario lo corrige
  form.addEventListener("input", (evento) => {
    const campo = evento.target.closest(".campo");
    if (campo && campo.classList.contains("campo--error")) {
      marcarCampo(evento.target, "");
    }
  });
}

function iniciar() {
  actualizarContadorHeader();
  inicializarEventos();
}

iniciar();
