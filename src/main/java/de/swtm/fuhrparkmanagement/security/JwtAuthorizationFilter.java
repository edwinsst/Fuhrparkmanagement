package de.swtm.fuhrparkmanagement.security;

import io.fusionauth.jwt.JWTException;
import io.fusionauth.jwt.Verifier;
import io.fusionauth.jwt.domain.JWT;
import io.fusionauth.jwt.hmac.HMACVerifier;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${authentication.jwt-secret}")
    private String jwtSecret;

    private Verifier jwtVerifier;

    @PostConstruct
    public void initializeJwtVerifier() {
        this.jwtVerifier = HMACVerifier.newVerifier(jwtSecret);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            retrieveEncodedJWT(request).map(this::parseAndValidateJWT).ifPresent(this::authenticateUserFromJWT);
        } catch (JWTException ignored) {
        }
        filterChain.doFilter(request, response);
    }

    private Optional<String> retrieveEncodedJWT(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(AUTHORIZATION_HEADER))
                .filter(header -> header.startsWith(BEARER_PREFIX))
                .map(header -> header.replaceFirst(BEARER_PREFIX, ""));
    }

    private JWT parseAndValidateJWT(String encodedJwt) {
        return JWT.getDecoder().decode(encodedJwt, jwtVerifier);
    }

    private void authenticateUserFromJWT(JWT jwt) {
        User user = new User(jwt.getBigInteger("uid").toString(), "", List.of());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
