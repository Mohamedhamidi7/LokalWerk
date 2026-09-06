package com.root.LokalWerk.configurations;

import com.root.LokalWerk.entities.User;
import com.root.LokalWerk.repositories.UserRepository;
import com.root.LokalWerk.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Frontend public files
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/dashboard.html",
                                "/products.html",
                                "/categories.html",
                                "/css/**",
                                "/js/**",
                                "/login",
                                "/error"
                        ).permitAll()

                        // Protected API
                        .requestMatchers("/admin/produkts/**").authenticated()
                        .requestMatchers("/categories/**").authenticated()

                        // Everything else
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    CommandLineRunner createTestUser(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {

            if (userRepository.findByUsername("test").isEmpty()) {

                User user = new User();

                user.setUsername("test");
                user.setPassword(passwordEncoder.encode("test"));

                userRepository.save(user);
            }
        };
    }
    @Bean
    RestTemplate  restTemplate(){
        return new RestTemplate();
    }
}
