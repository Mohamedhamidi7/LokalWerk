package com.root.LokalWerk.services;

import com.root.LokalWerk.dtos.requests.LoginRequest;
import com.root.LokalWerk.dtos.responses.JwtResponse;
import com.root.LokalWerk.entities.User;
import com.root.LokalWerk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.atn.ActionTransition;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    public JwtResponse login(LoginRequest request){
        Optional<User> user = userRepository.findByUsername(request.username());
        if (user.isEmpty() || !passwordEncoder.matches(request.password(), user.get().getPassword()))
            return null;
        return JwtResponse.builder()
                .token(jwtService.generateTocken(request.username()))
                .build();
    }
}
