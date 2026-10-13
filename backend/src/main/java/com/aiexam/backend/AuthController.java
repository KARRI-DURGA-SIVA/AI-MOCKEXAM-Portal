package com.aiexam.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record SignupRequest(
            String name,
            String email,
            String password) {
    }

    public record LoginRequest(
            String email,
            String password) {
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(
            @RequestBody SignupRequest request) {

        if (request.name() == null || request.name().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().length() < 8) {

            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "Name and email are required; password must contain at least 8 characters.")
            );
        }

        String email = request.email().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", "An account with this email already exists.")
            );
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("message", "Account created successfully.")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request) {

        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Email and password are required.")
            );
        }

        return userRepository.findByEmailIgnoreCase(request.email().trim())
            .filter(user -> passwordEncoder.matches(
                request.password(), user.getPasswordHash()))
            .map(user -> ResponseEntity.ok(
                Map.of("message", "Login successful.")
            ))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", "Invalid email or password.")
            ));
    }
}
