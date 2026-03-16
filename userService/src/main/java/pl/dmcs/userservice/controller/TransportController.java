package pl.dmcs.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.service.TransportService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transport")
public class TransportController {

    private final TransportService transportService;

    @Autowired
    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @GetMapping
    public ResponseEntity<List<Transport>> getAllTransports() {
        List<Transport> transports = transportService.getAllTransports();
        return ResponseEntity.ok(transports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transport> getTransportById(@PathVariable Long id) {
        Optional<Transport> transport = transportService.getTransportById(id);
        return transport.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/courier/{courierId}")
    public ResponseEntity<List<Transport>> getTransportsByCourierId(@PathVariable Long courierId) {
        List<Transport> transports = transportService.getTransportsByCourierId(courierId);
        return ResponseEntity.ok(transports);
    }

    @PostMapping("/courier/{courierId}")
    public ResponseEntity<Transport> createTransport(@PathVariable Long courierId, @RequestBody Transport transport) {
        try {
            Transport createdTransport = transportService.createTransport(courierId, transport);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTransport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transport> updateTransport(@PathVariable Long id, @RequestBody Transport transportDetails) {
        Transport updatedTransport = transportService.updateTransport(id, transportDetails);
        if (updatedTransport != null) {
            return ResponseEntity.ok(updatedTransport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Transport> partialUpdateTransport(@PathVariable Long id, @RequestBody Transport transportDetails) {
        Transport updatedTransport = transportService.updateTransport(id, transportDetails);
        if (updatedTransport != null) {
            return ResponseEntity.ok(updatedTransport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        transportService.deleteTransport(id);
        return ResponseEntity.noContent().build();
    }
}

