package org.zalmoxis.opaque.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zalmoxis.opaque.Dtos.LoginRequest;
import org.zalmoxis.opaque.Dtos.LoginResponse;
import org.zalmoxis.opaque.Dtos.RegisterRequest;
import org.zalmoxis.opaque.Services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController
{
    private final AuthService authService;

    public AuthController(AuthService authService) {this.authService = authService;}

    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@Valid @RequestBody RegisterRequest registerRequest)
    {
        authService.registerUser(registerRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest)
    {
        String token = authService.login(loginRequest);
        LoginResponse response = new LoginResponse(token);
        return ResponseEntity.ok(response);
    }
}
