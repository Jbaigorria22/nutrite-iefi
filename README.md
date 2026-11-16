# Nutrite — Dietética online

Sitio web de Nutrite, dietética online de Córdoba. Proyecto final (IEFI) de **Aplicaciones Web 1**, Colegio Universitario IES Siglo 21.

- **Sitio publicado:** https://jbaigorria22.github.io/nutrite-iefi/
- **Alumno:** Joaquín Baigorria — Analista de Sistemas, comisión Noche A
- **Docente:** Andrés Senn

> Este repositorio continúa el trabajo grupal del TP4 ([aw1-tp](https://github.com/Jbaigorria22/aw1-tp)), cuyo historial de commits se conserva. A partir de ahí, el desarrollo del IEFI es individual.

## Funcionalidades

- **Catálogo** con filtros por atributo, categoría y stock, búsqueda por nombre y ordenamiento.
- **Carrito de compras** persistido en `localStorage`.
- **Checkout en 4 pasos** (datos, entrega, pago, confirmación) con validaciones en HTML y JavaScript.
- **Envío real por email** del pedido y del formulario de contacto mediante [FormSubmit](https://formsubmit.co), con notificación en la interfaz y respuesta automática al cliente.
- **Blog** con artículos cargados desde JSON.

## Tecnologías

HTML5, CSS3 y JavaScript con módulos ES (`import`/`export`), `fetch`, `try/catch` y `localStorage`. Tests con el runner nativo de Node (`node:test`). CI/CD con GitHub Actions y publicación en GitHub Pages.

## Estructura

```
├── index.html, catalogo.html, producto.html, carrito.html,
│   checkout.html, contacto.html, blog.html, blog-articulo.html
├── assets/
│   ├── css/        estilos
│   ├── data/       productos.json, articulos.json
│   ├── img/        imágenes e íconos
│   └── js/         módulos JavaScript
├── tests/          tests unitarios (node:test)
└── .github/workflows/ci-cd.yml   pipeline CI/CD
```

### Módulos JavaScript principales

| Módulo | Responsabilidad |
|---|---|
| `config.js` | Constantes de configuración: rutas de datos y URL del servicio de email |
| `datos.js` | Obtención de datos con `fetch` a partir de la URL recibida por parámetro |
| `email.js` | Envío de emails con `fetch` (POST) al servicio FormSubmit |
| `filtros.js` | Filtrado y ordenamiento del catálogo (funciones puras) |
| `render.js` | Creación de las tarjetas de producto en el DOM |
| `funciones-carrito.js` | Cálculos del carrito y persistencia en `localStorage` |
| `catalogo.js`, `carrito.js`, `checkout.js`, `contacto.js`, … | Punto de entrada de cada página |

## Tests

Requiere Node.js 18 o superior. No hay dependencias que instalar.

```
npm test
```

Se testean `filtrarProductos`, `ordenarProductos`, `calcularSubtotal`, `calcularEnvio`, `contarProductos`, `armarDetallePedido` y `enviarEmail` (esta última con `fetch` simulado, sin enviar emails reales).

## CI/CD

El workflow `.github/workflows/ci-cd.yml` se ejecuta en cada push y pull request a `main`:

1. **CI — Tests unitarios:** instala Node y ejecuta `npm test`.
2. **CD — Despliegue:** solo si los tests pasan y el cambio llegó a `main`, publica el sitio en GitHub Pages.

Si algún test falla, el despliegue no se ejecuta y la versión en producción no cambia.

## Configuración del envío de emails

En `assets/js/config.js`, reemplazar `TU_EMAIL_AQUI` en `URL_EMAIL` por el email que recibe los pedidos. El primer envío dispara un email de activación de FormSubmit que hay que confirmar una única vez.

## Ver el sitio en local

Los módulos ES y `fetch` requieren un servidor: abrir la carpeta en VS Code y usar **Live Server**.
