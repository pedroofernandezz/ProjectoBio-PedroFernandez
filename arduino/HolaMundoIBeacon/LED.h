// -*- mode: c++ -*-

/*
 * Nombre: LED.h
 * Descripción: Abstracción mínima del LED de la placa y utilidad de espera.
 * Copyright: código base docente; adaptación (c) 2026 Pedro Fernández
 * Fecha: 2019 (código base); 16/10/2026 (adaptación Sprint 0)
 * Autor: Jordi Bataller i Mascarell (código base); Pedro Fernández (adaptación)
 * Aportación: Reutilización como apoyo visual del código Arduino del Sprint 0.
 */

#ifndef LED_H_INCLUIDO
#define LED_H_INCLUIDO

// ----------------------------------------------------------
// Jordi Bataller i Mascarell
// 2019-07-07
// ----------------------------------------------------------

// ----------------------------------------------------------
// ----------------------------------------------------------
/*
 * tiempo: Z --> esperar()
 * Bloquea la ejecución durante el número de milisegundos indicado.
 */
void esperar (long tiempo) {
  delay (tiempo);
}

// ----------------------------------------------------------
// ----------------------------------------------------------
class LED {
private:
  int numeroLED;
  bool encendido;
public:

  // .........................................................
  // .........................................................
/*
 * numero_pin: Z --> LED()
 * Construye el LED asociado al pin indicado y lo deja apagado.
 */
  LED (int numero)
	: numeroLED (numero), encendido(false)
  {
	pinMode(numeroLED, OUTPUT);
	apagar ();
  }

  // .........................................................
  // .........................................................
/*
 * encender()
 * Enciende el LED y actualiza su estado lógico.
 */
  void encender () {
	digitalWrite(numeroLED, HIGH); 
	encendido = true;
  }

  // .........................................................
  // .........................................................
/*
 * apagar()
 * Apaga el LED y actualiza su estado lógico.
 */
  void apagar () {
	  digitalWrite(numeroLED, LOW);
	  encendido = false;
  }

  // .........................................................
  // .........................................................
/*
 * alternar()
 * Invierte el estado actual del LED.
 */
  void alternar () {
	if (encendido) {
	  apagar();
	} else {
	  encender ();
	}
  } // ()

  // .........................................................
  // .........................................................
/*
 * tiempo: Z --> brillar()
 * Enciende el LED durante el tiempo indicado y después lo apaga.
 */
  void brillar (long tiempo) {
	encender ();
	esperar(tiempo); 
	apagar ();
  }
}; // class

// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
#endif
