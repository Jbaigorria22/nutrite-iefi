// Configuración compartida del sitio.
// Las constantes viven acá y se pasan como parámetro a las funciones que las usan,
// así ningún módulo depende de una ruta o dirección fija.

// Rutas de los archivos de datos
export const URL_PRODUCTOS = "assets/data/productos.json";
export const URL_ARTICULOS = "assets/data/articulos.json";

// Envío de emails con FormSubmit (servicio gratuito, sin backend).
// Reemplazá TU_EMAIL_AQUI por el email que recibe los pedidos y consultas
// (o por el alias que te da FormSubmit después de activarlo).
export const URL_EMAIL = "https://formsubmit.co/ajax/jbaigorria.aws@gmail.com";
