// E2E: catálogo — carga desde JSON, filtros, búsqueda y orden.

import { test, expect } from "@playwright/test";
import { capturar } from "./ayudantes.js";

test.describe("Catálogo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("catalogo.html");
    await expect(page.locator(".producto-card").first()).toBeVisible();
  });

  test("muestra todos los productos del JSON", async ({ page }, testInfo) => {
    await expect(page.locator(".producto-card")).toHaveCount(8);
    await expect(page.locator("#contador-resultados")).toHaveText("8");
    await capturar(page, testInfo, "01-catalogo-completo");
  });

  test("filtra por atributo Vegano", async ({ page }, testInfo) => {
    await page.getByLabel("Vegano").check();

    const tarjetas = page.locator(".producto-card");
    await expect(tarjetas).toHaveCount(6);
    // Cada tarjeta visible tiene que tener el badge "Vegano"
    for (const tarjeta of await tarjetas.all()) {
      await expect(tarjeta.locator(".badge", { hasText: "Vegano" })).toBeVisible();
    }
    await capturar(page, testInfo, "02-catalogo-filtro-vegano");
  });

  test("combina filtros: Vegano + solo con stock", async ({ page }) => {
    await page.getByLabel("Vegano").check();
    await page.getByLabel("Solo con stock").check();
    await expect(page.locator(".producto-card")).toHaveCount(5);
  });

  test("busca por nombre", async ({ page }, testInfo) => {
    await page.locator("#buscar").fill("almendras");
    await page.locator("#buscar").press("Enter");

    await expect(page.locator(".producto-card")).toHaveCount(2);
    await capturar(page, testInfo, "03-catalogo-busqueda");
  });

  test("ordena por menor precio", async ({ page }, testInfo) => {
    await page.locator("#orden-select").selectOption("Menor precio");

    const precios = await page.locator(".producto-card__precio").allTextContents();
    const numeros = precios.map((p) => Number(p.replace(/\D/g, "")));
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    await capturar(page, testInfo, "04-catalogo-menor-precio");
  });

  test("muestra un mensaje si ningún producto coincide", async ({ page }) => {
    await page.locator("#buscar").fill("xyz inexistente");
    await page.locator("#buscar").press("Enter");
    await expect(page.locator(".catalogo__vacio")).toBeVisible();
  });
});
