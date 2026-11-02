
package com.hospital.pharmacy.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("\n========== JWT FILTER ==========");
        System.out.println("Request: " + request.getMethod() + " " + request.getRequestURI());

        // 1. Get Authorization header
        final String authHeader = request.getHeader("Authorization");

        System.out.println("Authorization header present: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found");
            System.out.println("================================\n");

            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract JWT
        final String jwt = authHeader.substring(7);

        System.out.println("Bearer token found");
        System.out.println("Token length: " + jwt.length());

        final String userEmail;

        // 3. Extract username/email from JWT
        try {
            userEmail = jwtService.extractUsername(jwt);

            System.out.println("JWT username/email: " + userEmail);

        } catch (Exception e) {

            System.out.println("JWT extraction/validation FAILED");
            System.out.println("Exception: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());

            e.printStackTrace();

            System.out.println("================================\n");

            filterChain.doFilter(request, response);
            return;
        }

        // 4. Check whether authentication already exists
        if (userEmail != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            System.out.println("Loading user from database...");

            final UserDetails userDetails;

            try {

                userDetails =
                        userDetailsService.loadUserByUsername(userEmail);

                System.out.println("User loaded successfully");
                System.out.println("User: " + userDetails.getUsername());
                System.out.println("Authorities: " + userDetails.getAuthorities());
                System.out.println("Enabled: " + userDetails.isEnabled());

            } catch (Exception e) {

                System.out.println("Failed to load user");
                System.out.println("Exception: " + e.getClass().getName());
                System.out.println("Message: " + e.getMessage());

                e.printStackTrace();

                System.out.println("================================\n");

                filterChain.doFilter(request, response);
                return;
            }

            // 5. Validate JWT
            try {

                boolean valid =
                        jwtService.isTokenValid(jwt, userDetails);

                System.out.println("JWT valid: " + valid);

                if (valid) {

                    // 6. Create authentication object
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // 7. Store authentication in SecurityContext
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                    System.out.println("✅ AUTHENTICATION SET");
                    System.out.println(
                            "Authenticated user: " +
                                    SecurityContextHolder
                                            .getContext()
                                            .getAuthentication()
                                            .getName()
                    );

                    System.out.println(
                            "Authorities: " +
                                    SecurityContextHolder
                                            .getContext()
                                            .getAuthentication()
                                            .getAuthorities()
                    );

                } else {

                    System.out.println("JWT IS INVALID");
                }

            } catch (Exception e) {

                System.out.println("JWT validation FAILED");
                System.out.println("Exception: " + e.getClass().getName());
                System.out.println("Message: " + e.getMessage());

                e.printStackTrace();
            }

        } else {

            System.out.println(
                    "Authentication already exists OR username is null"
            );
        }

        System.out.println("================================\n");

        // 8. Continue request
        filterChain.doFilter(request, response);
    }
}

