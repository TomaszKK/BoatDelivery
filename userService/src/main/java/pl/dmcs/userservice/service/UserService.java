package pl.dmcs.userservice.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.exception.ResourceNotFoundException;
import pl.dmcs.userservice.mapper.UserMapper;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
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
        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        getUserById(id);
        userRepository.deleteById(id);
    }
}
