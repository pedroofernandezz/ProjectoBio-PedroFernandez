// -*-c++-*-

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
void inicializarPlaquita () {

  // de momento nada

} // ()

// --------------------------------------------------------------
// setup()
// --------------------------------------------------------------
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
    // Calcular concentracion de ozono
    // -----------------------------------------

    float valorOzono =
    elMedidor.medirOzono(vgas, vref);

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
