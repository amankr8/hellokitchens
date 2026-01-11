package com.flykraft.livemenu.config;

import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.model.Authority;
import com.flykraft.livemenu.repository.AuthUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class DataInitializer implements ApplicationRunner {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.security.username}")
    private String adminUsername;

    @Value("${spring.security.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (authUserRepository.findByUsername(adminUsername).isEmpty()) {
            AuthUser admin = AuthUser.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .authority(Authority.ADMIN)
                    .build();
            authUserRepository.save(admin);
        }
    }
}
