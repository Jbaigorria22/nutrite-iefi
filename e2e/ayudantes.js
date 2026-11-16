// Funciones compartidas por los tests E2E.

// Guarda una captura en capturas-e2e/ y la adjunta al reporte HTML de Playwright.
// Si se indica un selector, primero desplaza la página para que ese elemento se vea.
export async function capturar(page, testInfo, nombre, selector) {
  if (selector) {
    await page.locator(selector).evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  }
  const ruta = `capturas-e2e/${nombre}.png`;
  await page.screenshot({ path: ruta });
  await testInfo.attach(nombre, { path: ruta, contentType: "image/png" });
}

// Intercepta las llamadas a FormSubmit para NO enviar emails reales durante los tests.
// Devuelve un arreglo donde quedan guardados los datos que el sitio intentó enviar.
export async function simularFormSubmit(page, { falla = false } = {}) {
  const enviados = [];
  await page.route("https://formsubmit.co/**", async (route) => {
    enviados.push(route.request().postDataJSON());
    if (falla) {
      await route.fulfill({ status: 500, body: "{}" });
    } else {
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"success":"true"}' });
    }
  });
  return enviados;
}
