package pl.dmcs.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.dto.response.TransportResponse;
import pl.dmcs.userservice.mapper.TransportMapper;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.service.TransportService;
import pl.dmcs.userservice.service.UserService;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transport")
public class TransportController {

    private final TransportService transportService;
    private final TransportMapper transportMapper;
    private final UserService userService;

    @Autowired
    public TransportController(TransportService transportService, TransportMapper transportMapper, UserService userService) {
        this.transportService = transportService;
        this.transportMapper = transportMapper;
        this.userService = userService;
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('COURIER')")
    public ResponseEntity<TransportResponse> getMyTransport(@AuthenticationPrincipal Jwt jwt) {
        pl.dmcs.userservice.model.User courier = userService.syncUserFromJwt(jwt);
        List<Transport> transports = transportService.getTransportsByCourierId(courier.getId());
        
        if (transports == null || transports.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        
        return ResponseEntity.ok(transportMapper.toResponse(transports.get(0)));
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
    @Transactional
    public ResponseEntity<TransportResponse> createTransport(
            @PathVariable UUID courierId,
            @Valid @RequestBody TransportRequest request) {
        Transport transport = transportMapper.toEntity(request);
        Transport createdTransport = transportService.createTransport(courierId, transport);
        return ResponseEntity.status(HttpStatus.CREATED).body(transportMapper.toResponse(createdTransport));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('COURIER')")
    public ResponseEntity<TransportResponse> updateTransport(
            @PathVariable UUID id,
            @Valid @RequestBody TransportRequest request) {
        Transport updatedTransport = transportService.updateTransport(id, request);
        return ResponseEntity.ok(transportMapper.toResponse(updatedTransport));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('COURIER')")
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

