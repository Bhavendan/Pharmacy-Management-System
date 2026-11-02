package com.hospital.pharmacy.config;

import com.hospital.pharmacy.entity.User;
import com.hospital.pharmacy.enums.Role;
import com.hospital.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataSeeder dataSeeder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@hospital.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@hospital.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }

        // Trigger comprehensive data seeding
        dataSeeder.seedAllData();
    }
}
