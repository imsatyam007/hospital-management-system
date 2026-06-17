package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                DemoApplication.class,
                args
        );
    }

   @Bean
CommandLineRunner testPasswords(
        PasswordEncoder encoder
) {

    return args -> {

        System.out.println(
                "Doctor Password Hash:"
        );

        System.out.println(
                encoder.encode(
                        "Doctor@123"
                )
        );

        System.out.println(
                "Reception Password Hash:"
        );

        System.out.println(
                encoder.encode(
                        "Reception@123"
                )
        );

        System.out.println(
                "Admin Password Hash:"
        );

        System.out.println(
                encoder.encode(
                        "Admin@123"
                )
        );
    };
}
}