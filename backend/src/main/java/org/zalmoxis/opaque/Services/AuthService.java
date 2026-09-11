package org.zalmoxis.opaque.Services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zalmoxis.opaque.Dtos.Auth.LoginRequest;
import org.zalmoxis.opaque.Dtos.Auth.RegisterRequest;
import org.zalmoxis.opaque.Entities.Role;
import org.zalmoxis.opaque.Entities.User;
import org.zalmoxis.opaque.Exceptions.Auth.RegistrationException;
import org.zalmoxis.opaque.Repositories.UserRepository;
import org.zalmoxis.opaque.Security.JwtService;
import org.zalmoxis.opaque.Services.Interfaces.AuthServiceInterface;

@Service
public class AuthService
        implements AuthServiceInterface
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void registerUser(RegisterRequest registerRequest)
    {
        if (userRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new RegistrationException("Email already registered");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.password());

        User user = new User(registerRequest.email(), encodedPassword, Role.USER);

        userRepository.save(user);
    }

    public String login(LoginRequest loginRequest)
    {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        return jwtService.generateToken(
                (UserDetails) authentication.getPrincipal()
        );
    }
}
