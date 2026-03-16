package pl.dmcs.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Konfiguracja bezpieczeństwa
     * Umożliwia dostęp do wszystkich endpointów API bez autentykacji (dev mode)
     * Gdy Keycloak będzie gotowy, zmień permitAll() na: .requestMatchers("/user/**", "/transport/**").authenticated()
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Pozwól na dostęp bez autentykacji (DEV MODE)
                .requestMatchers("/user/**", "/transport/**").permitAll()
                // Wszystkie inne żądania wymagają autentykacji
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())  // Wyłącz CSRF dla REST API
            .cors(cors -> {});  // Włącz CORS

        return http.build();
    }

    /**
     * Encoder hasła dla przyszłej autentykacji
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

