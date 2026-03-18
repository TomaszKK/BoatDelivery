package pl.dmcs.userservice.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.exception.InvalidOperationException;
import pl.dmcs.userservice.exception.ResourceNotFoundException;
import pl.dmcs.userservice.mapper.TransportMapper;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.repository.TransportRepository;
import pl.dmcs.userservice.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class TransportService {
    private final TransportRepository transportRepository;
    private final UserRepository userRepository;
    private final TransportMapper transportMapper;

    @Autowired
    public TransportService(TransportRepository transportRepository, UserRepository userRepository, TransportMapper transportMapper) {
        this.transportRepository = transportRepository;
        this.userRepository = userRepository;
        this.transportMapper = transportMapper;
    }

    public List<Transport> getAllTransports() {
        return transportRepository.findAll();
    }

    public Transport getTransportById(UUID id) {
        return transportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transport", "id", id));
    }

    public List<Transport> getTransportsByCourierId(UUID courierId) {
        User courier = userRepository.findById(courierId)
                .orElseThrow(() -> new ResourceNotFoundException("Courier", "id", courierId));

        if (courier.getUserType() != UserType.COURIER) {
            throw new InvalidOperationException("Użytkownik o id " + courierId + " nie jest kurierem");
        }

        return transportRepository.findByCourierId(courierId);
    }

    @Transactional
    public Transport createTransport(UUID courierId, Transport transport) {
        User courier = userRepository.findById(courierId)
                .orElseThrow(() -> new ResourceNotFoundException("Courier", "id", courierId));

        if (courier.getUserType() != UserType.COURIER) {
            throw new InvalidOperationException("Użytkownik o id " + courierId + " nie jest kurierem");
        }

        transport.setCourier(courier);
        return transportRepository.save(transport);
    }

    @Transactional
    public Transport updateTransport(UUID id, TransportRequest updateRequest) {
        Transport existingTransport = getTransportById(id);
        transportMapper.updateEntityFromDto(updateRequest, existingTransport);
        return transportRepository.save(existingTransport);
    }

    @Transactional
    public void deleteTransport(UUID id) {
        getTransportById(id);
        transportRepository.deleteById(id);
    }
}

