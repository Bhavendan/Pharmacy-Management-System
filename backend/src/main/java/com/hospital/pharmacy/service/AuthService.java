package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.AuthResponse;
import com.hospital.pharmacy.dto.LoginRequest;
import com.hospital.pharmacy.dto.RegisterRequest;
import com.hospital.pharmacy.entity.User;
import com.hospital.pharmacy.exception.DuplicateResourceException;
import com.hospital.pharmacy.exception.UnauthorizedException;
import com.hospital.pharmacy.repository.UserRepository;
import com.hospital.pharmacy.security.CustomUserDetailsService;
import com.hospital.pharmacy.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getEnabled()) {
            throw new UnauthorizedException("User account is disabled");
        }

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        // Safe migration for legacy plain-text passwords created during earlier testing
        if (!passwordMatches && user.getPassword().equals(request.getPassword())) {
            passwordMatches = true;
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
