// -*- mode: c++ -*-

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
  Medidor(  ) {
  } // ()

  // .....................................................
  // .....................................................
  void iniciarMedidor() {
	pinMode(PIN_VGAS, INPUT);

  analogReadResolution(12);

  analogReference(AR_INTERNAL);
  } // ()

  float leerVgasVoltios(){
    uint32_t suma = 0;

    for(int i = 0; i < 16; i++){
      suma += analogRead(PIN_VGAS);
    }

    float lecturaMedia = suma / 16.0f;

    float voltaje = lecturaMedia * VOLTAJE_ADC / ADC_MAX;

    return voltaje;
  }

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
  float medirOzono(float vgas, float vref) {

    float concentracion =
        (vgas - vref) / SENSIBILIDAD;

    return concentracion;
  }

  // .....................................................
  // .....................................................
  int medirTemperatura() {
	return -12; // qué frío !
  } // ()
	
}; // class

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
#endif
