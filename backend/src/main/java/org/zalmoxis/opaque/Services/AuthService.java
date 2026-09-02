package org.zalmoxis.opaque.Services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zalmoxis.opaque.Dtos.RegisterRequest;
import org.zalmoxis.opaque.Entities.Role;
import org.zalmoxis.opaque.Entities.User;
import org.zalmoxis.opaque.Exceptions.Auth.RegistrationException;
import org.zalmoxis.opaque.Repositories.UserRepository;

@Service
public class AuthService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean registerUser(RegisterRequest registerRequest)
    {
        if (userRepository.findByEmail(registerRequest.email()).isPresent())
        {
            throw new RegistrationException("Email already registered");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.password());

        User user = new User(registerRequest.email(), encodedPassword, Role.USER);

        userRepository.save(user);


        return true;
    }
}
