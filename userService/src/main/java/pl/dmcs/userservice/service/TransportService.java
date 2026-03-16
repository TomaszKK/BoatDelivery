package pl.dmcs.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.repository.TransportRepository;
import pl.dmcs.userservice.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TransportService {
    private final TransportRepository transportRepository;
    private final UserRepository userRepository;

    @Autowired
    public TransportService(TransportRepository transportRepository, UserRepository userRepository) {
        this.transportRepository = transportRepository;
        this.userRepository = userRepository;
    }

    public List<Transport> getAllTransports() {
        return transportRepository.findAll();
    }

    public Optional<Transport> getTransportById(Long id) {
        return transportRepository.findById(id);
    }

    public List<Transport> getTransportsByCourierId(Long courierId) {
        return transportRepository.findByCourierId(courierId);
    }

    public Transport createTransport(Long courierId, Transport transport) {
        Optional<User> courier = userRepository.findById(courierId);
        if (courier.isPresent() && courier.get().getUserType() == UserType.COURIER) {
            transport.setCourier(courier.get());
            return transportRepository.save(transport);
        }
        throw new IllegalArgumentException("Kurier o id " + courierId + " nie został znaleziony lub nie jest kurierem");
    }

    public Transport updateTransport(Long id, Transport transportDetails) {
        Optional<Transport> transport = transportRepository.findById(id);
        if (transport.isPresent()) {
            Transport existingTransport = transport.get();
            if (transportDetails.getTransportType() != null) {
                existingTransport.setTransportType(transportDetails.getTransportType());
            }
            if (transportDetails.getBrand() != null) {
                existingTransport.setBrand(transportDetails.getBrand());
            }
            if (transportDetails.getModel() != null) {
                existingTransport.setModel(transportDetails.getModel());
            }
            if (transportDetails.getFuelType() != null) {
                existingTransport.setFuelType(transportDetails.getFuelType());
            }
            if (transportDetails.getTrunkVolume() != null) {
                existingTransport.setTrunkVolume(transportDetails.getTrunkVolume());
            }
            if (transportDetails.getCargoCapacity() != null) {
                existingTransport.setCargoCapacity(transportDetails.getCargoCapacity());
            }
            if (transportDetails.getConsumption() != null) {
                existingTransport.setConsumption(transportDetails.getConsumption());
            }
            if (transportDetails.getLicensePlate() != null) {
                existingTransport.setLicensePlate(transportDetails.getLicensePlate());
            }
            if (transportDetails.getColor() != null) {
                existingTransport.setColor(transportDetails.getColor());
            }
            return transportRepository.save(existingTransport);
        }
        return null;
    }

    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }
}

