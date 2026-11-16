// Tests unitarios de los cálculos del carrito (funciones-carrito.js).

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calcularSubtotal,
  calcularEnvio,
  contarProductos,
  armarDetallePedido,
  envioGratisDesde,
} from "../assets/js/funciones-carrito.js";

const productos = [
  { id: 1, nombre: "Semillas de chía", precio: 2000 },
  { id: 2, nombre: "Mix de frutos secos", precio: 5000 },
];

const carrito = [
  { id: 1, cantidad: 3 },
  { id: 2, cantidad: 2 },
];

describe("calcularSubtotal", () => {
  it("suma precio por cantidad de cada producto", () => {
    // 3 x 2000 + 2 x 5000 = 16000
    assert.equal(calcularSubtotal(carrito, productos), 16000);
  });

  it("un carrito vacío da 0", () => {
    assert.equal(calcularSubtotal([], productos), 0);
  });
});

describe("calcularEnvio", () => {
  it("cobra el precio del tipo de envío elegido", () => {
    assert.equal(calcularEnvio(10000, "moto"), 1900);
    assert.equal(calcularEnvio(10000, "correo"), 3400);
  });

  it("el retiro en el punto Nutrite es gratis", () => {
    assert.equal(calcularEnvio(10000, "retiro"), 0);
  });

  it("es gratis cuando el subtotal llega al mínimo de envío gratis", () => {
    assert.equal(calcularEnvio(envioGratisDesde, "correo"), 0);
  });
});

describe("contarProductos", () => {
  it("suma las cantidades de todos los ítems", () => {
    assert.equal(contarProductos(carrito), 5);
  });
});

describe("armarDetallePedido", () => {
  it("arma una línea de texto por producto para el email", () => {
    const detalle = armarDetallePedido(carrito, productos);
    assert.equal(detalle.length, 2);
    assert.match(detalle[0], /^3 x Semillas de chía/);
    assert.match(detalle[1], /^2 x Mix de frutos secos/);
  });
});
