package org.zalmoxis.opaque.Services.Interfaces;

import org.zalmoxis.opaque.Dtos.Auth.LoginRequest;
import org.zalmoxis.opaque.Dtos.Auth.RegisterRequest;

public interface AuthServiceInterface
{
    public void registerUser(RegisterRequest registerRequest);
    public String login(LoginRequest loginRequest);
}
