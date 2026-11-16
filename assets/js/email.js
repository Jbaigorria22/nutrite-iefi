// Módulo de email: envía datos a un servicio externo (FormSubmit) con fetch.
// No conoce la dirección de destino: la recibe por parámetro (ver config.js).

export async function enviarEmail(url, datos) {
  if (url.includes("TU_EMAIL_AQUI")) {
    throw new Error("Falta configurar el email de destino en config.js");
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datos),
  });

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
