package com.hospital.pharmacy.config;

import com.hospital.pharmacy.security.CustomAccessDeniedHandler;
import com.hospital.pharmacy.security.CustomAuthenticationEntryPoint;
import com.hospital.pharmacy.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // User & Supplier management - ADMIN only
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/suppliers/**").hasRole("ADMIN")

                        // Drug modification - ADMIN only; Drug viewing - ADMIN, DOCTOR, PHARMACIST
                        .requestMatchers(HttpMethod.GET, "/api/drugs/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")
                        .requestMatchers(HttpMethod.POST, "/api/drugs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/drugs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/drugs/**").hasRole("ADMIN")

                        // Patient management - ADMIN, DOCTOR, PHARMACIST
                        .requestMatchers("/api/patients/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")

                        // Inventory management - ADMIN, PHARMACIST (DOCTOR can view low-stock and expiring alerts)
                        .requestMatchers(HttpMethod.GET, "/api/inventory/low-stock", "/api/inventory/expiring").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")
                        .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "PHARMACIST")

                        // Prescription verify/dispense - PHARMACIST and ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/prescriptions/*/verify").hasAnyRole("ADMIN", "PHARMACIST")
                        .requestMatchers(HttpMethod.PUT, "/api/prescriptions/*/dispense").hasAnyRole("ADMIN", "PHARMACIST")
                        // Bill payment update - PHARMACIST and ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/bills/*/payment").hasAnyRole("ADMIN", "PHARMACIST")
                        // Prescriptions - ADMIN, DOCTOR, PHARMACIST
                        .requestMatchers("/api/prescriptions/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")

                        // Bills - ADMIN, PHARMACIST
                        .requestMatchers("/api/bills/**").hasAnyRole("ADMIN", "PHARMACIST")

                        // Dashboard & Reports - ADMIN, DOCTOR, PHARMACIST
                        .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")
                        .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
