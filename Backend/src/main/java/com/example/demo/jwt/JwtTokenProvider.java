package com.example.demo.jwt;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParserBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    @Value("${app.jwt-refresh-expiration-milliseconds}")
    private long refreshTokenExpirationDate;

    // Generate Access Token
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
    }

    // Generate Refresh Token
    public String generateRefreshToken(String username) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + refreshTokenExpirationDate);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
    }

    // Extract Username from Token
    public String getUsername(String token) {
        Claims claims = parseToken(token).getBody();
        return claims.getSubject();
    }

    // Validate Token
    public boolean validateToken(String token) {
        try {
            parseToken(token); // Parsing and validating the token
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Helper method to parse JWT
    private Jws<Claims> parseToken(String token) {
        JwtParserBuilder parserBuilder = Jwts.parserBuilder();
        return parserBuilder.setSigningKey(key()).build().parseClaimsJws(token);
    }

    // Secret Key for JWT
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}
