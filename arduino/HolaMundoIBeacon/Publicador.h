// -*- mode: c++ -*-

/*
 * Nombre: Publicador.h
 * Descripción: Codificación de mediciones en campos iBeacon y control de su publicación BLE.
 * Copyright: código base docente; adaptación (c) 2026 Pedro Fernández
 * Fecha: 2019 (código base); 16/10/2026 (adaptación Sprint 0)
 * Autor: Jordi Bataller i Mascarell (código base); Pedro Fernández (adaptación)
 * Aportación: Añadida la publicación de ozono con identificador 14 y codificación en milésimas de ppm.
 */

// --------------------------------------------------------------
// Jordi Bataller i Mascarell
// --------------------------------------------------------------

#ifndef PUBLICADOR_H_INCLUIDO
#define PUBLICADOR_H_INCLUIDO

// --------------------------------------------------------------
// --------------------------------------------------------------
class Publicador {

  // ............................................................
  // ............................................................
private:

  uint8_t beaconUUID[16] = { 
	'E', 'P', 'S', 'G', '-', 'G', 'T', 'I', 
	'-', 'P', 'R', 'O', 'Y', '-', '3', 'A'
	};

  // ............................................................
  // ............................................................
public:
  EmisoraBLE laEmisora {
	"pedritopicapiedra", //  nombre emisora
	  0x004c, // fabricanteID (Apple)
	  4 // txPower
	  };
  
  const int RSSI = -53; // por poner algo, de momento no lo uso

  // ............................................................
  // ............................................................
public:

  // ............................................................
  // ............................................................
  enum MedicionesID {
    CO2 = 11,
    TEMPERATURA = 12,
    RUIDO = 13,
    OZONO = 14
		
	};

  // ............................................................
  // ............................................................
/*
 * Publicador()
 * Construye el publicador sin encender todavía la emisora BLE.
 */
  Publicador( ) {
	// ATENCION: no hacerlo aquí. (*this).laEmisora.encenderEmisora();
	// Pondremos un método para llamarlo desde el setup() más tarde
  } // ()

  // ............................................................
  // ............................................................
/*
 * encenderEmisora()
 * Delega en EmisoraBLE la inicialización de la radio BLE.
 */
  void encenderEmisora() {
	(*this).laEmisora.encenderEmisora();
  } // ()

  // ............................................................
  // ............................................................
/*
 * valor: Z, contador: N, tiempo_espera: Z --> publicarCO2()
 * Codifica y publica temporalmente una medición de CO2 en un iBeacon.
 */
  void publicarCO2( int16_t valorCO2, uint8_t contador,
					long tiempoEspera ) {

	//
	// 1. empezamos anuncio
	//
	uint16_t major = (MedicionesID::CO2 << 8) + contador;
	(*this).laEmisora.emitirAnuncioIBeacon( (*this).beaconUUID, 
											major,
											valorCO2, // minor
											(*this).RSSI // rssi
									);

	/*
	Globales::elPuerto.escribir( "   publicarCO2(): valor=" );
	Globales::elPuerto.escribir( valorCO2 );
	Globales::elPuerto.escribir( "   contador=" );
	Globales::elPuerto.escribir( contador );
	Globales::elPuerto.escribir( "   todo="  );
	Globales::elPuerto.escribir( major );
	Globales::elPuerto.escribir( "\n" );
	*/

	//
	// 2. esperamos el tiempo que nos digan
	//
	esperar( tiempoEspera );

	//
	// 3. paramos anuncio
	//
	(*this).laEmisora.detenerAnuncio();
  } // ()

  // ............................................................
  // ............................................................
/*
 * valor: Z, contador: N, tiempo_espera: Z --> publicarTemperatura()
 * Codifica y publica temporalmente una medición de temperatura en un iBeacon.
 */
  void publicarTemperatura( int16_t valorTemperatura,
							uint8_t contador, long tiempoEspera ) {

	uint16_t major = (MedicionesID::TEMPERATURA << 8) + contador;
	(*this).laEmisora.emitirAnuncioIBeacon( (*this).beaconUUID, 
											major,
											valorTemperatura, // minor
											(*this).RSSI // rssi
									);
	esperar( tiempoEspera );

	(*this).laEmisora.detenerAnuncio();
  } // ()

/*
 * valor_ozono: R, contador: N, tiempo_espera: Z --> publicarOzono() --> publicado: B
 * Valida el rango, codifica el ozono en milésimas de ppm y publica el iBeacon correspondiente.
 */
	bool publicarOzono(float valorOzono, uint8_t contador, long tiempoEspera){
		if(isnan(valorOzono)||isinf(valorOzono)){
			return false;
		}
		if(valorOzono < 0.0f || valorOzono > 20.0f){
			return false;
		}

		int16_t valorCodificado =
        (int16_t)(valorOzono * 1000.0f + 0.5f);

    uint16_t major =
        (MedicionesID::OZONO << 8) + contador;


    (*this).laEmisora.emitirAnuncioIBeacon(

        (*this).beaconUUID,

        major,

        valorCodificado,

        (*this).RSSI

    );

    esperar(tiempoEspera);

    (*this).laEmisora.detenerAnuncio();

    return true;
	}
	
}; // class

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
#endif
