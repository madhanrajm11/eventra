package com.jm.eventra.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SensitiveEndPointsRateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> adminRegisterBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> forgotOtpBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> resetBuckets = new ConcurrentHashMap<>();

    private Bucket newBucket(int capacity, Duration per) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(capacity, per)
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }


    private String key(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (!"POST".equalsIgnoreCase(method)) return true;

        return !(uri.equals("/auth/login")
                || uri.equals("/api/auth/login")
                || uri.equals("/auth/register/admin")
                || uri.equals("/api/auth/register/admin")
                || uri.equals("/auth/forgot-password/otp")
                || uri.equals("/api/auth/forgot-password/otp")
                || uri.equals("/auth/forgot-password/reset")
                || uri.equals("/api/auth/forgot-password/reset"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String k = key(request);

        Bucket bucket;
        String message;

        if (uri.equals("/auth/login") || uri.equals("/api/auth/login")) {
            bucket = loginBuckets.computeIfAbsent(k, __ -> newBucket(10, Duration.ofMinutes(1)));
            message = "Too many login attempts. Try again later.";
        } else if (uri.equals("/auth/register/admin") || uri.equals("/api/auth/register/admin")) {
            bucket = adminRegisterBuckets.computeIfAbsent(k, __ -> newBucket(5, Duration.ofMinutes(10)));
            message = "Too many admin registration attempts. Try again later.";
        } else if (uri.equals("/auth/forgot-password/otp") || uri.equals("/api/auth/forgot-password/otp")) {
            bucket = forgotOtpBuckets.computeIfAbsent(k, __ -> newBucket(5, Duration.ofMinutes(5)));
            message = "Too many OTP requests. Try again later.";
        } else {
            bucket = resetBuckets.computeIfAbsent(k, __ -> newBucket(10, Duration.ofMinutes(5)));
            message = "Too many password reset attempts. Try again later.";
        }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
