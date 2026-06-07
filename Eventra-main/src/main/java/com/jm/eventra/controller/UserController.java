package com.jm.eventra.controller;

import com.jm.eventra.dto.request.ChangePasswordRequest;
import com.jm.eventra.dto.request.UpdateProfileRequest;
import com.jm.eventra.dto.response.UserProfileResponse;
import com.jm.eventra.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(){
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request){
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changeMyPassword(@Valid @RequestBody ChangePasswordRequest request){
        userService.changeMyPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

}
