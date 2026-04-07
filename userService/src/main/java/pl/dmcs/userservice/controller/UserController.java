package pl.dmcs.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.dto.response.UserResponse;
import pl.dmcs.userservice.mapper.UserMapper;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt);
        return ResponseEntity.ok(user);
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

    @GetMapping("/public/list")
    public ResponseEntity<List<UserResponse>> getPublicUsersList() {
        // Endpoint dla init script-u - bez autentykacji, zwraca listę wszystkich userów
        List<User> users = userService.getAllUsers();
        List<UserResponse> responses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateUserRequest request) {
        User currentUser = userService.syncUserFromJwt(jwt);
        User updatedUser = userService.updateUserWithPatch(currentUser.getId(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        User user = userMapper.toEntity(request);
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(createdUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequest request) {
        User updatedUser = userService.updateUserWithPut(id, request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> partialUpdateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUserWithPatch(id, request);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
