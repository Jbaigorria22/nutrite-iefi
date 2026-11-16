// E2E: proceso de compra completo — validaciones, envío del pedido por email y notificación.
// FormSubmit se simula: los tests no envían emails reales.

import { test, expect } from "@playwright/test";
import { capturar, simularFormSubmit } from "./ayudantes.js";

// Carrito de prueba: 2 x Harina de almendras + 1 x Semillas de chía
const CARRITO = [
  { id: 2, cantidad: 2 },
  { id: 8, cantidad: 1 },
];

async function prepararCarrito(page) {
  await page.goto("index.html");
  await page.evaluate((carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("envio", "moto");
  }, CARRITO);
  await page.goto("checkout.html");
}

async function completarDatos(page) {
  await page.locator("#dato-nombre").fill("Julieta Fernández");
  await page.locator("#dato-email").fill("julieta@ejemplo.com");
  await page.locator("#dato-telefono").fill("3511234567");
  await page.locator("#dato-dni").fill("35123456");
  await page.locator("#form-datos button[type=submit]").click();
}

async function completarEntrega(page) {
  await page.locator("#dir-calle").fill("Av. Colón 1234");
  await page.locator("#dir-ciudad").fill("Córdoba");
  await page.locator("#dir-cp").fill("5000");
  await page.locator("#form-entrega button[type=submit]").click();
}

test.describe("Checkout", () => {
  test("valida los datos antes de avanzar", async ({ page }, testInfo) => {
    await prepararCarrito(page);
    await page.locator("#dato-email").fill("esto-no-es-un-email");
    await page.locator("#form-datos button[type=submit]").click();

    // Sigue en el paso 1 y marca los campos con error
    await expect(page.locator("#panel-datos")).toBeVisible();
    await expect(page.locator("#panel-datos .campo--error")).toHaveCount(4);
    await capturar(page, testInfo, "07-checkout-validaciones");
  });

  test("compra completa: envía el pedido por email y confirma", async ({ page }, testInfo) => {
    const enviados = await simularFormSubmit(page);
    await prepararCarrito(page);

    await completarDatos(page);
    await expect(page.locator("#panel-entrega")).toBeVisible();
    await capturar(page, testInfo, "08-checkout-entrega");

    await completarEntrega(page);
    await expect(page.locator("#panel-pago")).toBeVisible();
    await capturar(page, testInfo, "09-checkout-pago");

    await page.locator("#btn-continuar").click();

    // Notificación en la interfaz
    await expect(page.locator("#panel-confirmacion h1")).toContainText("¡Gracias por tu compra, Julieta!");
    await capturar(page, testInfo, "10-checkout-confirmacion");

    // Se envió un email con los datos del pedido
    expect(enviados).toHaveLength(1);
    expect(enviados[0].email).toBe("julieta@ejemplo.com");
    expect(enviados[0].productos).toContain("2 x Harina de almendras");
    expect(enviados[0]._subject).toMatch(/^Nuevo pedido NUT-\d{6}/);

    // El carrito se vació (localStorage)
    const carrito = await page.evaluate(() => localStorage.getItem("carrito"));
    expect(carrito).toBe("[]");
  });

  test("si el email falla, avisa y no pierde el carrito", async ({ page }, testInfo) => {
    await simularFormSubmit(page, { falla: true });
    await prepararCarrito(page);
    await completarDatos(page);
    await completarEntrega(page);

    await page.locator("#btn-continuar").click();

    await expect(page.locator("#checkout-estado")).toContainText("No pudimos enviar tu pedido");
    await expect(page.locator("#panel-confirmacion")).toBeHidden();
    await capturar(page, testInfo, "11-checkout-error-envio", "#checkout-estado");

    const carrito = await page.evaluate(() => JSON.parse(localStorage.getItem("carrito")));
    expect(carrito).toHaveLength(2);
  });
});
