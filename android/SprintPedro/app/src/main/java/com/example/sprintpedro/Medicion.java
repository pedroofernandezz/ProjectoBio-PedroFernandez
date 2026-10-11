package com.example.sprintpedro;

/*
 * Nombre: Medicion.java
 * Descripción: Representa una medición utilizada por la lógica del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Representación en Android del tipo lógico Medicion compartido
 *             con la lógica del negocio y el API REST.
 */

public class Medicion {

    private final int id;
    private final String tipo;
    private final String fecha;
    private final double valor;

    /*
     * id: N, tipo: Text, fecha: Text, valor: R --> Medicion()
     * Crea una medición con los datos recibidos del servidor.
     */
    public Medicion(int id, String tipo, String fecha, double valor) {
        this.id = id;
        this.tipo = tipo;
        this.fecha = fecha;
        this.valor = valor;
    }

    /*
     * --> getId() --> id: N
     * Devuelve el identificador de la medición.
     */
    public int getId() {
        return id;
    }

    /*
     * --> getTipo() --> tipo: Text
     * Devuelve el tipo de medición.
     */
    public String getTipo() {
        return tipo;
    }

    /*
     * --> getFecha() --> fecha: Text
     * Devuelve la fecha y hora de la medición.
     */
    public String getFecha() {
        return fecha;
    }

    /*
     * --> getValor() --> valor: R
     * Devuelve el valor de la medición.
     */
    public double getValor() {
        return valor;
    }
}