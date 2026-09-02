package org.zalmoxis.opaque.Exceptions;

import org.springframework.security.core.AuthenticationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.zalmoxis.opaque.Exceptions.Auth.RegistrationException;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<String> handleRegistrationException(RegistrationException e)
    {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AuthenticationException.class)
public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
    return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
}

}
