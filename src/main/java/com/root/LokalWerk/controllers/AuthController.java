package com.root.LokalWerk.controllers;

import com.root.LokalWerk.dtos.requests.LoginRequest;
import com.root.LokalWerk.dtos.responses.JwtResponse;
import com.root.LokalWerk.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request){
        JwtResponse response = userService.login(request);
        if (response != null)
            return ResponseEntity.ok(response);
        return ResponseEntity.badRequest().build();
    }
}
