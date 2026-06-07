package com.jm.eventra.mapper;

import com.jm.eventra.dto.response.UserProfileResponse;
import com.jm.eventra.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toResponse(User user){
        return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getInstitutionName(),
                user.getDepartment(),
                user.getYear()
        );
    }
}
