package pl.worker.service.controller;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

import java.util.Map;

@Controller("/api/production")
public class ProductionStatusController {

    @Get("/status")
    public Map<String, String> getHardwareStatus() {
        // Docelowo tutaj wepniesz integrację np. z API Lightburna lub OctoPrint/Orca Slicer
        return Map.of(
                "kurier", "W DRODZE",
                "paczka", "W DOMU",
                "klient", "W PRACY"
        );
    }
}