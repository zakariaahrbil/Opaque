package org.zalmoxis.opaque.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.List;

@Configuration
public class JwtService
{
    @Value("${jwt.secret}")
    private  String secretKey;

    private static final long TokenValidityMillis = 3600 * 1000L;

    private SecretKey getSecretKey()
    {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(UserDetails userDetails)
    {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities()
                        .stream()
                        .map(a -> a.getAuthority().substring(5))
                        .toList()
                )
                .signWith(getSecretKey())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + TokenValidityMillis))
                .compact();
    }

    private Claims extractClaims(String token)
    {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token)
    {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public String extractUsername(String token)
    {
        return extractClaims(token).getSubject();
    }

    public List<String> extractRole(String token) {
        List<String> roles = extractClaims(token).get("roles", List.class);
        if (roles != null && !roles.isEmpty()) {
            return roles;
        }
        return List.of();
    }

    public boolean validateToken(String token, UserDetails userDetails)
    {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
