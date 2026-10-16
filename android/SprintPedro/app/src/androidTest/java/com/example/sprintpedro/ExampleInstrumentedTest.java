package com.example.sprintpedro;

/*
 * Nombre: ExampleInstrumentedTest.java
 * Descripción: Test instrumentado de ejemplo generado por la plantilla de Android Studio.
 * Copyright: plantilla de Android Studio
 * Fecha: 16/10/2026
 * Autor: Android Studio (plantilla)
 * Aportación: comprobación de ejemplo del contexto de la aplicación; no implementa lógica del Sprint 0.
 */

import android.content.Context;

import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.*;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Test
    /*
     * useAppContext()
     * Comprueba que el contexto instrumentado pertenece al paquete de la aplicación.
     */
    public void useAppContext() {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.example.sprintpedro", appContext.getPackageName());
    }
}