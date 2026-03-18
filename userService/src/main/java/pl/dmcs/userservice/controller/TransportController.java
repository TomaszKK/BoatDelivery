
package pl.dmcs.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.dto.response.TransportResponse;
import pl.dmcs.userservice.mapper.TransportMapper;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.service.TransportService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transport")
public class TransportController {

    private final TransportService transportService;
    private final TransportMapper transportMapper;

    @Autowired
    public TransportController(TransportService transportService, TransportMapper transportMapper) {
        this.transportService = transportService;
        this.transportMapper = transportMapper;
    }

    @GetMapping
    public ResponseEntity<List<TransportResponse>> getAllTransports() {
        List<Transport> transports = transportService.getAllTransports();
        List<TransportResponse> responses = transports.stream()
                .map(transportMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportResponse> getTransportById(@PathVariable UUID id) {
        Transport transport = transportService.getTransportById(id);
        return ResponseEntity.ok(transportMapper.toResponse(transport));
    }

    @GetMapping("/courier/{courierId}")
    public ResponseEntity<List<TransportResponse>> getTransportsByCourierId(@PathVariable UUID courierId) {
        List<Transport> transports = transportService.getTransportsByCourierId(courierId);
        List<TransportResponse> responses = transports.stream()
                .map(transportMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/courier/{courierId}")
    public ResponseEntity<TransportResponse> createTransport(
            @PathVariable UUID courierId,
            @Valid @RequestBody TransportRequest request) {
        Transport transport = transportMapper.toEntity(request);
        Transport createdTransport = transportService.createTransport(courierId, transport);
        return ResponseEntity.status(HttpStatus.CREATED).body(transportMapper.toResponse(createdTransport));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportResponse> updateTransport(
            @PathVariable UUID id,
            @Valid @RequestBody TransportRequest request) {
        Transport updatedTransport = transportService.updateTransport(id, request);
        return ResponseEntity.ok(transportMapper.toResponse(updatedTransport));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransportResponse> partialUpdateTransport(
            @PathVariable UUID id,
            @Valid @RequestBody TransportRequest request) {
        Transport updatedTransport = transportService.updateTransport(id, request);
        return ResponseEntity.ok(transportMapper.toResponse(updatedTransport));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable UUID id) {
        transportService.deleteTransport(id);
        return ResponseEntity.noContent().build();
    }
}

