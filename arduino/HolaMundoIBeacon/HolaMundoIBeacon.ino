// -*-c++-*-

/*
 * Nombre: HolaMundoIBeacon.ino
 * Descripción: Programa principal de la placa SparkFun para el Sprint 0 y emisión de la medición por BLE/iBeacon.
 * Copyright: código base docente; adaptación (c) 2026 Pedro Fernández
 * Fecha: 2019 (código base); 16/10/2026 (adaptación Sprint 0)
 * Autor: Jordi Bataller i Mascarell (código base); Pedro Fernández (adaptación)
 * Aportación: Integración del medidor/publicador y uso de la medida ficticia 12.34 ppm exigida por el test de funcionamiento.
 */

// --------------------------------------------------------------
//
// Jordi Bataller i Mascarell
// 2019-07-07
//
// --------------------------------------------------------------

// https://learn.sparkfun.com/tutorials/nrf52840-development-with-arduino-and-circuitpython

// https://stackoverflow.com/questions/29246805/can-an-ibeacon-have-a-data-payload

// --------------------------------------------------------------
// --------------------------------------------------------------
#include <bluefruit.h>

#undef min // vaya tela, están definidos en bluefruit.h y  
#undef max // colisionan con los de la biblioteca estándar

// --------------------------------------------------------------
// --------------------------------------------------------------
#include "LED.h"
#include "PuertoSerie.h"

// --------------------------------------------------------------
// --------------------------------------------------------------
namespace Globales {
  
  LED elLED ( /* NUMERO DEL PIN LED = */ 7 );

  PuertoSerie elPuerto ( /* velocidad = */ 115200 ); // 115200 o 9600 o ...

  // Serial1 en el ejemplo de Curro creo que es la conexión placa-sensor 
};

// --------------------------------------------------------------
// --------------------------------------------------------------
#include "EmisoraBLE.h"
#include "Publicador.h"
#include "Medidor.h"


// --------------------------------------------------------------
// --------------------------------------------------------------
namespace Globales {

  Publicador elPublicador;

  Medidor elMedidor;

}; // namespace

// --------------------------------------------------------------
// --------------------------------------------------------------
/*
 * inicializarPlaquita()
 * Punto de inicialización específico de la placa; en este Sprint 0 no requiere acciones adicionales.
 */
void inicializarPlaquita () {

  // de momento nada

} // ()

// --------------------------------------------------------------
// setup()
// --------------------------------------------------------------
/*
 * setup()
 * Inicializa puerto serie, emisora BLE y medidor antes de comenzar el ciclo principal.
 */
void setup() {

  Globales::elPuerto.esperarDisponible();

  // 
  // 
  // 
  inicializarPlaquita();

  // Suspend Loop() to save power
  // suspendLoop();

  // 
  // 
  // 
  Globales::elPublicador.encenderEmisora();

  // Globales::elPublicador.laEmisora.pruebaEmision();
  
  // 
  // 
  // 
  Globales::elMedidor.iniciarMedidor();

  // 
  // 
  // 
  esperar( 1000 );

  Globales::elPuerto.escribir( "---- setup(): fin ---- \n " );

} // setup ()

// --------------------------------------------------------------
// --------------------------------------------------------------
/*
 * lucecitas()
 * Ejecuta una secuencia de encendido del LED de apoyo.
 */
inline void lucecitas() {
  using namespace Globales;

  elLED.brillar( 100 ); // 100 encendido
  esperar ( 400 ); //  100 apagado
  elLED.brillar( 100 ); // 100 encendido
  esperar ( 400 ); //  100 apagado
  Globales::elLED.brillar( 100 ); // 100 encendido
  esperar ( 400 ); //  100 apagado
  Globales::elLED.brillar( 1000 ); // 1000 encendido
  esperar ( 1000 ); //  100 apagado
} // ()

// --------------------------------------------------------------
// loop ()
// --------------------------------------------------------------
namespace Loop {
  uint8_t cont = 0;
};

// ..............................................................
// ..............................................................
// --------------------------------------------------
// LOOP PRINCIPAL
// --------------------------------------------------

/*
 * loop()
 * Genera la medida ficticia del test, la codifica como ozono y ordena su publicación periódica por iBeacon.
 */
void loop() {

    using namespace Globales;
    using namespace Loop;

    // Incrementamos contador
    cont++;

    // -----------------------------------------
    // Leer voltajes del sensor
    // -----------------------------------------

    float vgas = elMedidor.leerVgasVoltios();
    float vref = elMedidor.leerVrefVoltios();

    // -----------------------------------------
    // Medida ficticia exigida por el test de funcionamiento del Sprint 0
    // -----------------------------------------

    float valorOzono = 12.34f;

    if (isnan(valorOzono) || isinf(valorOzono)) {
    Serial.println("ERROR: medicion no valida.");
    delay(2000);
    return;
    }

    // Una concentración física no puede ser negativa.
    // Valores negativos pequeños se llevan a 0.
    if (valorOzono < 0.0f) {
    valorOzono = 0.0f;
    }

    Serial.println("----------------------------");

    Serial.print("Medicion numero: ");
    Serial.println(cont);

    Serial.print("Vgas: ");
    Serial.print(vgas, 4);
    Serial.println(" V");

    Serial.print("Vref: ");
    Serial.print(vref, 4);
    Serial.println(" V");

    Serial.print("Ozono calculado: ");
    Serial.print(valorOzono, 3);
    Serial.println(" ppm");

    bool publicado = elPublicador.publicarOzono(
    valorOzono,
    cont,
    1000
    );

    if (publicado) {
    Serial.println("Beacon de ozono emitido.");
    }   else {
    Serial.println("ERROR: Beacon de ozono NO emitido.");
    }

delay(2000);
}
  
// loop ()
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
