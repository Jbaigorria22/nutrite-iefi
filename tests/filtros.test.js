// Tests unitarios de filtros.js con el test runner nativo de Node (node:test).
// Se ejecutan con: npm test

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filtrarProductos, ordenarProductos } from "../assets/js/filtros.js";

// Datos de prueba: pocos productos, con lo justo para cada caso
const productos = [
  { id: 1, nombre: "Harina de almendras", precio: 6500, categoria: "harinas", badges: ["Sin TACC", "Vegano"], stock: { estado: "disponible" } },
  { id: 2, nombre: "Pan integral", precio: 3200, categoria: "panificados", badges: ["Integral"], stock: { estado: "sin-stock" } },
  { id: 3, nombre: "Bebida de almendras", precio: 2800, categoria: "bebidas", badges: ["Vegano", "Sin azúcar"], stock: { estado: "ultimas" } },
];

// Criterios "vacíos": sin filtros aplicados
const sinFiltros = { atributos: [], categorias: [], soloConStock: false, busqueda: "" };

describe("filtrarProductos", () => {
  it("sin filtros devuelve todos los productos", () => {
    assert.equal(filtrarProductos(productos, sinFiltros).length, 3);
  });

  it("filtra por atributo: solo los que tienen TODOS los atributos elegidos", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, atributos: ["Vegano"] });
    assert.deepEqual(resultado.map((p) => p.id), [1, 3]);

    const conDos = filtrarProductos(productos, { ...sinFiltros, atributos: ["Vegano", "Sin TACC"] });
    assert.deepEqual(conDos.map((p) => p.id), [1]);
  });

  it("filtra por categoría", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, categorias: ["bebidas"] });
    assert.deepEqual(resultado.map((p) => p.id), [3]);
  });

  it("con 'solo con stock' descarta los productos sin stock", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, soloConStock: true });
    assert.deepEqual(resultado.map((p) => p.id), [1, 3]);
  });

  it("busca por nombre sin distinguir mayúsculas", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, busqueda: "ALMENDRAS" });
    assert.deepEqual(resultado.map((p) => p.id), [1, 3]);
  });

  it("no modifica el arreglo original", () => {
    filtrarProductos(productos, { ...sinFiltros, atributos: ["Vegano"] });
    assert.equal(productos.length, 3);
  });
});

describe("ordenarProductos", () => {
  it("ordena por menor precio", () => {
    const resultado = ordenarProductos(productos, "Menor precio");
    assert.deepEqual(resultado.map((p) => p.precio), [2800, 3200, 6500]);
  });

  it("ordena por mayor precio", () => {
    const resultado = ordenarProductos(productos, "Mayor precio");
    assert.deepEqual(resultado.map((p) => p.precio), [6500, 3200, 2800]);
  });

  it("ordena por nombre de la A a la Z", () => {
    const resultado = ordenarProductos(productos, "Nombre A-Z");
    assert.deepEqual(resultado.map((p) => p.id), [3, 1, 2]);
  });

  it("'Más vendidos' mantiene el orden original", () => {
    const resultado = ordenarProductos(productos, "Más vendidos");
    assert.deepEqual(resultado.map((p) => p.id), [1, 2, 3]);
  });

  it("trabaja sobre una copia: el arreglo original no cambia", () => {
    ordenarProductos(productos, "Menor precio");
    assert.deepEqual(productos.map((p) => p.id), [1, 2, 3]);
  });
});
