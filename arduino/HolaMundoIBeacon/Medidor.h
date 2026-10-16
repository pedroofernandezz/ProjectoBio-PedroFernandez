// -*- mode: c++ -*-

/*
 * Nombre: Medidor.h
 * Descripción: Adquisición de señales analógicas del sensor y cálculo de concentración de ozono.
 * Copyright: código base docente; adaptación (c) 2026 Pedro Fernández
 * Fecha: 2019 (código base); 16/10/2026 (adaptación Sprint 0)
 * Autor: Código base docente (código base); Pedro Fernández (adaptación)
 * Aportación: Adaptación de la adquisición ADC y cálculo de ozono usados en el proyecto.
 */

#ifndef MEDIDOR_H_INCLUIDO
#define MEDIDOR_H_INCLUIDO

#include <Arduino.h>
#include <math.h>

// ------------------------------------------------------
// ------------------------------------------------------
class Medidor {

  // .....................................................
  // .....................................................
private:

  const int PIN_VGAS  = A3;   // GPIO 5
  const int PIN_VREF  = A4;   // GPIO 28
  const int PIN_VTEMP = A5;   // GPIO 29

  const float ADC_MAX = 4095.0f;
  const float VOLTAJE_ADC = 3.6f;

  // Si -56.44 es el Sensitivity Code de la etiqueta:
  const float SENSIBILIDAD = -0.02816356f;

public:

  // .....................................................
  // constructor
  // .....................................................
/*
 * Medidor()
 * Construye el objeto responsable de la adquisición de medidas.
 */
  Medidor(  ) {
  } // ()

  // .....................................................
  // .....................................................
/*
 * iniciarMedidor()
 * Configura la entrada analógica y la resolución/referencia del ADC.
 */
  void iniciarMedidor() {
	pinMode(PIN_VGAS, INPUT);

  analogReadResolution(12);

  analogReference(AR_INTERNAL);
  } // ()

/*
 * leerVgasVoltios() --> vgas: R
 * Obtiene el voltaje medio de Vgas a partir de varias lecturas ADC.
 */
  float leerVgasVoltios(){
    uint32_t suma = 0;

    for(int i = 0; i < 16; i++){
      suma += analogRead(PIN_VGAS);
    }

    float lecturaMedia = suma / 16.0f;

    float voltaje = lecturaMedia * VOLTAJE_ADC / ADC_MAX;

    return voltaje;
  }

/*
 * leerVrefVoltios() --> vref: R
 * Obtiene el voltaje medio de referencia a partir de varias lecturas ADC.
 */
  float leerVrefVoltios() {

    uint32_t suma = 0;

    for (int i = 0; i < 16; i++) {
        suma += analogRead(PIN_VREF);
    }

    float lecturaMedia = suma / 16.0f;

    return lecturaMedia * VOLTAJE_ADC / ADC_MAX;
  }

  // .....................................................
  // .....................................................
/*
 * vgas: R, vref: R --> medirOzono() --> ozono: R
 * Calcula la concentración de ozono a partir de Vgas, Vref y la sensibilidad configurada.
 */
  float medirOzono(float vgas, float vref) {

    float concentracion =
        (vgas - vref) / SENSIBILIDAD;

    return concentracion;
  }

  // .....................................................
  // .....................................................
/*
 * medirTemperatura() --> temperatura: Z
 * Conserva la operación de temperatura del código base; no se utiliza en el Sprint 0.
 */
  int medirTemperatura() {
	return -12; // qué frío !
  } // ()
	
}; // class

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
#endif
