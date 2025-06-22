package com.example.crud.service;

import com.example.crud.model.AppUser;
import com.example.crud.repository.UserRepository;
import com.example.crud.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AppUser> findAll() {
        return userRepository.findAll();
    }

    public AppUser findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public AppUser findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    public AppUser create(AppUser user) {
        // Check if username already exists
        Optional<AppUser> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username '" + user.getUsername() + "' already exists");
        }

        // Check if email already exists (if provided)
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            Optional<AppUser> existingEmail = userRepository.findByEmail(user.getEmail());
            if (existingEmail.isPresent()) {
                throw new IllegalArgumentException("Email '" + user.getEmail() + "' already exists");
            }
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public AppUser update(Long id, AppUser updatedUser) {
        AppUser user = findById(id);

        // Check if username is being changed and if it conflicts
        if (!user.getUsername().equals(updatedUser.getUsername())) {
            Optional<AppUser> existingUser = userRepository.findByUsername(updatedUser.getUsername());
            if (existingUser.isPresent()) {
                throw new IllegalArgumentException("Username '" + updatedUser.getUsername() + "' already exists");
            }
        }

        // Check if email is being changed and if it conflicts
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
            Optional<AppUser> existingEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (existingEmail.isPresent()) {
                throw new IllegalArgumentException("Email '" + updatedUser.getEmail() + "' already exists");
            }
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        
        // Only update password if a new one is provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

    public void delete(Long id) {
        AppUser user = findById(id);
        userRepository.delete(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
} 