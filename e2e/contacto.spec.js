// E2E: formulario de contacto — validaciones y envío por email (simulado).

import { test, expect } from "@playwright/test";
import { capturar, simularFormSubmit } from "./ayudantes.js";

test.describe("Contacto", () => {
  test("no envía si hay campos inválidos", async ({ page }, testInfo) => {
    const enviados = await simularFormSubmit(page);
    await page.goto("contacto.html");

    await page.locator("#form-contacto [type=submit]").click();

    await expect(page.locator("#contacto-estado")).toHaveText("Revisá los campos marcados.");
    await expect(page.locator("#form-contacto .campo--error")).toHaveCount(3);
    expect(enviados).toHaveLength(0);
    await capturar(page, testInfo, "12-contacto-validaciones", "#contacto-estado");
  });

  test("envía el mensaje y confirma en pantalla", async ({ page }, testInfo) => {
    const enviados = await simularFormSubmit(page);
    await page.goto("contacto.html");

    await page.locator("#nombre").fill("Ana Gómez");
    await page.locator("#email").fill("ana@ejemplo.com");
    await page.locator("#mensaje").fill("Hola, ¿la harina de almendras es apta para celíacos?");
    await page.locator("#form-contacto [type=submit]").click();

    await expect(page.locator("#contacto-estado")).toContainText("¡Gracias, Ana!");
    expect(enviados).toHaveLength(1);
    expect(enviados[0].mensaje).toContain("harina de almendras");
    await capturar(page, testInfo, "13-contacto-enviado", "#contacto-estado");
  });
});

// Sin JavaScript: el formulario tiene que funcionar solo con HTML (action + method)
test.describe("Contacto sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("el navegador valida los campos obligatorios", async ({ page }) => {
    let enviado = false;
    await page.route("https://formsubmit.co/**", (route) => {
      enviado = true;
      return route.fulfill({ status: 200, body: "ok" });
    });
    await page.goto("contacto.html");
    await page.locator("#form-contacto [type=submit]").click();

    // required bloquea el envío: no sale ningún pedido
    await expect(page).toHaveURL(/contacto\.html$/);
    expect(enviado).toBe(false);
  });

  test("envía el formulario por POST a FormSubmit", async ({ page }, testInfo) => {
    const pedidos = [];
    await page.route("https://formsubmit.co/**", (route) => {
      pedidos.push({ metodo: route.request().method(), datos: route.request().postData() });
      return route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Mensaje enviado</h1>" });
    });
    await page.goto("contacto.html");
    await page.locator("#nombre").fill("Ana Gómez");
    await page.locator("#email").fill("ana@ejemplo.com");
    await page.locator("#mensaje").fill("Consulta enviada sin JavaScript activo.");
    await page.locator("#form-contacto [type=submit]").click();

    await expect(page.locator("h1")).toHaveText("Mensaje enviado");
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].metodo).toBe("POST");
    expect(pedidos[0].datos).toContain("sin+JavaScript");
  });
});
