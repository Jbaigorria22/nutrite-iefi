// Tests de enviarEmail (email.js). No se envían emails reales:
// se reemplaza fetch por una versión falsa (mock) que simula la respuesta del servicio.

import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { enviarEmail } from "../assets/js/email.js";

const fetchOriginal = globalThis.fetch;
const URL_PRUEBA = "https://formsubmit.co/ajax/prueba@ejemplo.com";

// Crea un fetch falso que devuelve el estado y el JSON indicados
function simularFetch(status, json) {
  globalThis.fetch = async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
  });
}

afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

describe("enviarEmail", () => {
  it("resuelve cuando el servicio confirma el envío", async () => {
    simularFetch(200, { success: "true" });
    const resultado = await enviarEmail(URL_PRUEBA, { nombre: "Ana" });
    assert.equal(resultado.success, "true");
  });

  it("lanza un error si el servidor responde con error HTTP", async () => {
    simularFetch(500, {});
    await assert.rejects(enviarEmail(URL_PRUEBA, {}), /HTTP 500/);
  });

  it("lanza un error si el servicio rechaza el envío", async () => {
    simularFetch(200, { success: "false", message: "This form needs Activation" });
    await assert.rejects(enviarEmail(URL_PRUEBA, {}), /Activation/);
  });

  it("cancela el envío si el servicio no responde a tiempo", async () => {
    // fetch falso que nunca responde: solo termina cuando se cancela con la señal
    globalThis.fetch = (url, opciones) =>
      new Promise((resolve, reject) => {
        const espera = setTimeout(resolve, 5000); // mantiene vivo el proceso mientras espera
        opciones.signal.addEventListener("abort", () => {
          clearTimeout(espera);
          reject(opciones.signal.reason);
        });
      });
    await assert.rejects(enviarEmail(URL_PRUEBA, {}, 50), /no respondió a tiempo/);
  });

  it("avisa si falta configurar el email de destino", async () => {
    await assert.rejects(
      enviarEmail("https://formsubmit.co/ajax/TU_EMAIL_AQUI", {}),
      /Falta configurar/
    );
  });
});
