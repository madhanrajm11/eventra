package com.jm.eventra.service;

import com.jm.eventra.dto.request.ChangePasswordRequest;
import com.jm.eventra.dto.request.UpdateProfileRequest;
import com.jm.eventra.dto.response.UserProfileResponse;
import com.jm.eventra.entity.User;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.mapper.UserMapper;
import com.jm.eventra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));
    }

    public UserProfileResponse getMyProfile(){
        User user = getCurrentUser();
        return userMapper.toResponse(user);
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request){
        User user = getCurrentUser();

        user.setName(request.name());
        user.setYear(request.year());

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    public void changeMyPassword(ChangePasswordRequest request){
        User user = getCurrentUser();

        if (!request.newPassword().equals(request.confirmNewPassword())){
            throw new BusinessException("New password and confirm password do not match", HttpStatus.BAD_REQUEST);
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())){
            throw new BusinessException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }


}
