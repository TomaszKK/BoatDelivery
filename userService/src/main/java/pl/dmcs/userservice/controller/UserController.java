package pl.dmcs.userservice.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.dto.response.PaginatedResponse;
import pl.dmcs.userservice.dto.response.UserCountByTypeDTO;
import pl.dmcs.userservice.dto.response.UserResponse;
import pl.dmcs.userservice.mapper.TransportMapper;
import pl.dmcs.userservice.mapper.UserMapper;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.service.TransportService;
import pl.dmcs.userservice.service.UserService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final UserMapper userMapper;
    private final TransportService transportService;
    private final TransportMapper transportMapper;
    private final String expectedSecret;

    @Autowired
    public UserController(
            UserService userService,
            UserMapper userMapper,
            TransportService transportService,
            TransportMapper transportMapper,
            @Value("${app.webhook.keycloak-secret}") String expectedSecret) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.transportService = transportService;
        this.transportMapper = transportMapper;
        this.expectedSecret = expectedSecret;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @GetMapping("/my-role")
    public ResponseEntity<?> getMyRole(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt);
        return ResponseEntity.ok(new Object() {
            public UserType userType = user.getUserType();
            public String role = user.getUserType().name();
        });
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> responses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/paginated")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PaginatedResponse<UserResponse>> getAllUsersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Validate size
        if (size <= 0 || size > 100) {
            size = 10;
        }
        
        Page<User> usersPage = userService.getAllUsersPaged(page, size);
        List<UserResponse> responses = usersPage.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        
        PaginatedResponse<UserResponse> response = PaginatedResponse.<UserResponse>builder()
                .content(responses)
                .page(usersPage.getNumber())
                .size(usersPage.getSize())
                .totalElements(usersPage.getTotalElements())
                .totalPages(usersPage.getTotalPages())
                .numberOfElements(usersPage.getNumberOfElements())
                .hasNext(usersPage.hasNext())
                .hasPrevious(usersPage.hasPrevious())
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/paginated/by-type")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PaginatedResponse<UserResponse>> getUsersByTypePaged(
            @RequestParam UserType userType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Validate size
        if (size <= 0 || size > 100) {
            size = 10;
        }
        
        Page<User> usersPage = userService.getUsersByTypePaged(userType, page, size);
        List<UserResponse> responses = usersPage.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        
        PaginatedResponse<UserResponse> response = PaginatedResponse.<UserResponse>builder()
                .content(responses)
                .page(usersPage.getNumber())
                .size(usersPage.getSize())
                .totalElements(usersPage.getTotalElements())
                .totalPages(usersPage.getTotalPages())
                .numberOfElements(usersPage.getNumberOfElements())
                .hasNext(usersPage.hasNext())
                .hasPrevious(usersPage.hasPrevious())
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats/count-by-type")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserCountByTypeDTO> getUserCountByType() {
        return ResponseEntity.ok(userService.getUserCountByType());
    }

    @GetMapping("/internal/couriers")
    public ResponseEntity<List<UserResponse>> getCouriers(
            @RequestHeader(value = "X-Keycloak-Secret", required = false) String providedSecret) {

        if (providedSecret == null || !expectedSecret.equals(providedSecret)) {
            log.warn("Wrong secret!!!: {}", providedSecret);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> users = userService.getAllUsers();
        List<UserResponse> responses = users.stream()
                .filter(user -> UserType.COURIER.equals(user.getUserType()))
                .map(user -> {
                    UserResponse userResponse = userMapper.toResponse(user);
                    try {
                        List<Transport> transports = transportService.getTransportsByCourierId(user.getId());
                        if (transports != null && !transports.isEmpty()) {
                            Transport firstTransport = transports.get(0);
                            userResponse.setTransport(transportMapper.toResponse(firstTransport));
                        }
                    } catch (Exception e) {
                        log.debug("Courier {} do not have any transport", user.getId());
                    }

                    return userResponse;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/internal/{id}")
    public ResponseEntity<UserResponse> getUserByIdInternal(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Keycloak-Secret", required = false) String providedSecret) {

        if (providedSecret == null || !expectedSecret.equals(providedSecret)) {
            log.warn("Wrong secret for internal user fetch!!!: {}", providedSecret);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @GetMapping("/public/list")
    public ResponseEntity<List<UserResponse>> getPublicUsersList() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> responses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateUserRequest request) {
        User currentUser = userService.syncUserFromJwt(jwt);
        User updatedUser = userService.updateUserWithPatch(currentUser.getId(), request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        User user = userMapper.toEntity(request);
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(createdUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequest request) {
        User updatedUser = userService.updateUserWithPut(id, request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> partialUpdateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUserWithPatch(id, request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
