// E2E: carrito — agregar productos, persistencia en localStorage y totales.

import { test, expect } from "@playwright/test";
import { capturar } from "./ayudantes.js";

test.describe("Carrito", () => {
  test.beforeEach(async ({ page }) => {
    // Arranca cada test con el carrito vacío
    await page.goto("index.html");
    await page.evaluate(() => localStorage.setItem("carrito", "[]"));
  });

  test("agregar desde el catálogo actualiza el contador y se guarda", async ({ page }, testInfo) => {
    await page.goto("catalogo.html");
    const contador = page.locator(".carrito-icono__contador");

    await page.locator(".boton-agregar").first().click();
    await expect(contador).toHaveText("1");
    await page.locator(".boton-agregar").nth(1).click();
    await expect(contador).toHaveText("2");
    await capturar(page, testInfo, "05-catalogo-agregar-al-carrito");

    // Persistencia: al recargar la página el carrito sigue ahí (localStorage)
    await page.reload();
    await expect(contador).toHaveText("2");
  });

  test("el carrito muestra los productos y recalcula el total", async ({ page }, testInfo) => {
    await page.goto("catalogo.html");
    await page.locator(".boton-agregar").first().click();
    await page.goto("carrito.html");

    await expect(page.locator(".item-carrito")).toHaveCount(1);
    const totalAntes = await page.locator("#resumen-subtotal").textContent();

    await page.locator(".boton-sumar").first().click();
    await expect(page.locator(".item-carrito .cantidad__input")).toHaveValue("2");
    await expect(page.locator("#resumen-subtotal")).not.toHaveText(totalAntes);
    await capturar(page, testInfo, "06-carrito");
  });

  test("con el carrito vacío lo indica en pantalla", async ({ page }) => {
    await page.goto("carrito.html");
    await expect(page.locator(".carrito__vacio")).toBeVisible();
  });
});
