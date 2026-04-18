package pl.dmcs.userservice.service;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import pl.dmcs.userservice.dto.request.JwtUserSyncRequest;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.dto.response.UserCountByTypeDTO;
import pl.dmcs.userservice.exception.InvalidOperationException;
import pl.dmcs.userservice.exception.ResourceNotFoundException;
import pl.dmcs.userservice.mapper.UserMapper;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.repository.UserRepository;
import pl.dmcs.userservice.sync.KeycloakSyncService;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final Validator validator;
    private final KeycloakSyncService keycloakSyncService;

    @Autowired
    public UserService(
            UserRepository userRepository,
            UserMapper userMapper,
            Validator validator,
            KeycloakSyncService keycloakSyncService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.validator = validator;
        this.keycloakSyncService = keycloakSyncService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getAllUsersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    public Page<User> getUsersByTypePaged(UserType userType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findByUserType(userType, pageable);
    }

    public Page<User> searchUsers(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return userRepository.findAll(pageable);
        }
        return userRepository.searchUsers(searchTerm, pageable);
    }

    public Page<User> searchUsersByType(String searchTerm, UserType userType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return userRepository.findByUserType(userType, pageable);
        }
        return userRepository.searchUsersByType(searchTerm, userType, pageable);
    }

    public UserCountByTypeDTO getUserCountByType() {
        long totalUsers = userRepository.count();
        long customerCount = userRepository.countByUserType(UserType.CUSTOMER);
        long courierCount = userRepository.countByUserType(UserType.COURIER);
        long adminCount = userRepository.countByUserType(UserType.ADMIN);

        return UserCountByTypeDTO.builder()
                .totalUsers(totalUsers)
                .customerCount(customerCount)
                .courierCount(courierCount)
                .adminCount(adminCount)
                .build();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserWithPut(UUID id, UserRequest updateRequest) {
        User existingUser = getUserById(id);
        userMapper.updateEntityFromDto(updateRequest, existingUser);
        return userRepository.save(existingUser);
    }

    @Transactional
    public User updateUserWithPatch(UUID id, UpdateUserRequest updateRequest) {
        User existingUser = getUserById(id);
        userMapper.updateEntityFromDto(updateRequest, existingUser);
        User updatedUser = userRepository.save(existingUser);

        // Synchronizuj zmienione dane do Keycloaka
        keycloakSyncService.syncUserToKeycloak(updatedUser);

        return updatedUser;
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = getUserById(id);
        userRepository.deleteById(id);

        // Synchronizuj usuwanie do Keycloaka
        keycloakSyncService.deleteUserFromKeycloak(id);
    }

    @Transactional
    public User syncUserFromJwt(Jwt jwt) {
        if (jwt == null) {
            throw new InvalidOperationException("JWT nie może być null");
        }

        String subject = jwt.getSubject();
        if (subject == null || subject.isEmpty()) {
            throw new InvalidOperationException("JWT subject nie może być pusty");
        }

        UUID keycloakId;
        try {
            keycloakId = UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Nieprawidłowy format JWT subject: " + subject);
        }

        return userRepository.findById(keycloakId)
                .orElseGet(() -> {
                    // Log all claims from JWT for debugging
                    logger.info("=== JWT Claims Debug ===");
                    logger.info("Subject: {}", jwt.getSubject());
                    jwt.getClaims().forEach((key, value) ->
                        logger.info("Claim [{}]: {}", key, value)
                    );
                    logger.info("======================");

                    String phoneNumber = jwt.getClaimAsString("phone_number");
                    logger.info("Extracted phone_number: {}", phoneNumber);

                    JwtUserSyncRequest syncRequest = JwtUserSyncRequest.builder()
                            .id(keycloakId)
                            .email(jwt.getClaimAsString("email"))
                            .firstName(jwt.getClaimAsString("given_name"))
                            .lastName(jwt.getClaimAsString("family_name"))
                            .phoneNumber(phoneNumber)
                            .userType(UserType.CUSTOMER)
                            .build();

                    Set<ConstraintViolation<JwtUserSyncRequest>> violations = validator.validate(syncRequest);
                    if (!violations.isEmpty()) {
                        String messages = violations.stream()
                                .map(ConstraintViolation::getMessage)
                                .reduce((a, b) -> a + ", " + b)
                                .orElse("Błąd walidacji danych z JWT");
                        throw new InvalidOperationException(messages);
                    }

                    User newUser = userMapper.toEntity(syncRequest);
                    newUser.setCreatedBy("keycloak-client");

                    try {
                        return userRepository.save(newUser);
                    } catch (DataIntegrityViolationException e) {
                        throw new InvalidOperationException("Nie można utworzyć użytkownika: " + e.getMessage());
                    } catch (Exception e) {
                        throw new InvalidOperationException("Błąd przy tworzeniu użytkownika: " + e.getMessage());
                    }
                });
    }
}


