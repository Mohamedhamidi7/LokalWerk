package com.root.LokalWerk;

import com.root.LokalWerk.repositories.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.userdetails.User;

@SpringBootApplication
public class LokalWerkApplication {

	public static void main(String[] args) {
		SpringApplication.run(LokalWerkApplication.class, args);

	}

}
