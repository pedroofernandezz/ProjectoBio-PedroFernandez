/*
 * Nombre: PuertoSerie.h
 * Descripción: Abstracción mínima del puerto serie utilizado por el programa Arduino.
 * Copyright: código base docente; adaptación (c) 2026 Pedro Fernández
 * Fecha: 2019 (código base); 16/10/2026 (adaptación Sprint 0)
 * Autor: Jordi Bataller i Mascarell (código base); Pedro Fernández (adaptación)
 * Aportación: Reutilización para trazas y diagnóstico durante el test de funcionamiento.
 */

// -*- mode: c++ -*-

// ----------------------------------------------------------
// Jordi Bataller i Mascarell
// 2019-07-07
// ----------------------------------------------------------

#ifndef PUERTO_SERIE_H_INCLUIDO
#define PUERTO_SERIE_H_INCLUIDO

// ----------------------------------------------------------
// ----------------------------------------------------------
class PuertoSerie  {

public:
  // .........................................................
  // .........................................................
/*
 * baudios: Z --> PuertoSerie()
 * Inicializa el puerto serie a la velocidad indicada.
 */
  PuertoSerie (long baudios) {
	Serial.begin( baudios );
	// mejor no poner esto aquí: while ( !Serial ) delay(10);   
  } // ()

  // .........................................................
  // .........................................................
/*
 * esperarDisponible()
 * Espera hasta que el puerto serie esté disponible.
 */
  void esperarDisponible() {

	while ( !Serial ) {
	  delay(10);   
	}

  } // ()

  // .........................................................
  // .........................................................
  template<typename T>
/*
 * mensaje: T --> escribir()
 * Escribe en el puerto serie el valor recibido.
 */
  void escribir (T mensaje) {
	Serial.print( mensaje );
  } // ()
  
}; // class PuertoSerie

// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
#endif
