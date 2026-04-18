package pl.dmcs.userservice.service;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private static final Logger log = LoggerFactory.getLogger(TransportService.class);

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
    
    public Page<Transport> getAllTransportsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transportRepository.findAll(pageable);
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
    
    public Page<Transport> getTransportsByCourierIdPaged(UUID courierId, int page, int size) {
        User courier = userRepository.findById(courierId)
                .orElseThrow(() -> new ResourceNotFoundException("Courier", "id", courierId));

        if (courier.getUserType() != UserType.COURIER) {
            throw new InvalidOperationException("Użytkownik o id " + courierId + " nie jest kurierem");
        }

        Pageable pageable = PageRequest.of(page, size);
        return transportRepository.findByCourierId(courierId, pageable);
    }
    
    public long getTotalTransportCount() {
        return transportRepository.count();
    }

    public Page<Transport> searchTransports(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return transportRepository.findAll(pageable);
        }
        return transportRepository.searchTransports(searchTerm, pageable);
    }

    @Transactional
    public Transport createTransport(UUID courierId, Transport transport) {
        log.info("Próba dodania transportu dla courier ID: {}", courierId);
        log.info("Transport data: type={}, brand={}, model={}", transport.getTransportType(), transport.getBrand(), transport.getModel());

        try {
            User courier = userRepository.findById(courierId)
                    .orElseThrow(() -> new ResourceNotFoundException("Courier", "id", courierId));

            log.info("Znaleziony courier: {} {} (type: {})", courier.getFirstName(), courier.getLastName(), courier.getUserType());

            if (courier.getUserType() != UserType.COURIER) {
                throw new InvalidOperationException("Użytkownik o id " + courierId + " nie jest kurierem");
            }

            if (transport.getId() == null) {
                transport.setId(UUID.randomUUID());
                log.info("Wygenerowano nowy UUID dla transportu: {}", transport.getId());
            }

            transport.setCourier(courier);
            log.info("Ustawiłem couriera dla transportu");

            Transport saved = transportRepository.save(transport);
            log.info("Transport zapisany z ID: {}", saved.getId());

            return saved;
        } catch (Exception e) {
            log.error("Błąd podczas dodawania transportu: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public Transport createTransportWithoutCourier(Transport transport) {
        log.info("Próba dodania transportu bez kuriera: type={}, brand={}, model={}",
                transport.getTransportType(), transport.getBrand(), transport.getModel());

        try {
            if (transport.getId() == null) {
                transport.setId(UUID.randomUUID());
                log.info("Wygenerowano nowy UUID dla transportu: {}", transport.getId());
            }

            transport.setCourier(null);
            Transport saved = transportRepository.save(transport);
            log.info("Transport zapisany z ID: {}", saved.getId());

            return saved;
        } catch (Exception e) {
            log.error("Błąd podczas dodawania transportu: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public Transport updateTransport(UUID id, TransportRequest updateRequest) {
        Transport existingTransport = getTransportById(id);
        transportMapper.updateEntityFromDto(updateRequest, existingTransport);
        return transportRepository.save(existingTransport);
    }

    @Transactional
    public Transport saveTransport(Transport transport) {
        return transportRepository.save(transport);
    }

    @Transactional
    public void deleteTransport(UUID id) {
        getTransportById(id);
        transportRepository.deleteById(id);
    }
}


