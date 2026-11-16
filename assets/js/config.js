// Configuración compartida del sitio.
// Las constantes viven acá y se pasan como parámetro a las funciones que las usan,
// así ningún módulo depende de una ruta o dirección fija.

// Rutas de los archivos de datos
export const URL_PRODUCTOS = "assets/data/productos.json";
export const URL_ARTICULOS = "assets/data/articulos.json";

// Envío de emails con FormSubmit (servicio gratuito, sin backend).
// Se usa el alias que da FormSubmit al activar el formulario, en lugar del email real,
// para que la dirección de la tienda no quede visible en el código público.
export const URL_EMAIL = "https://formsubmit.co/ajax/ff53929fdaeef23e365a9ecf977dd137";
