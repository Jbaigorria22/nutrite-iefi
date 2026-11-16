// Módulo de email: envía datos a un servicio externo (FormSubmit) con fetch.
// No conoce la dirección de destino: la recibe por parámetro (ver config.js).

const TIEMPO_MAXIMO_MS = 15000; // si el servicio no responde en 15 s, se cancela

export async function enviarEmail(url, datos, tiempoMaximo = TIEMPO_MAXIMO_MS) {
  if (url.includes("TU_EMAIL_AQUI")) {
    throw new Error("Falta configurar el email de destino en config.js");
  }

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datos),
      // Cancela el pedido si tarda demasiado, para no dejar la interfaz "colgada"
      signal: AbortSignal.timeout(tiempoMaximo),
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error("El servicio de email no respondió a tiempo");
    }
    throw error;
  }

  if (!respuesta.ok) {
    throw new Error(`No se pudo enviar el email (HTTP ${respuesta.status})`);
  }

  const resultado = await respuesta.json();

  // FormSubmit responde { success: "true" } cuando el email se envió
  if (String(resultado.success) !== "true") {
    throw new Error(resultado.message || "El servicio de email rechazó el envío");
  }

  return resultado;
}
