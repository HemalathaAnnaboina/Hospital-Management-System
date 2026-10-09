package com.hospital.service;

import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.request.RegisterRequest;
import com.hospital.dto.response.JwtResponse;
import com.hospital.entity.User;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    JwtResponse registerPatient(RegisterRequest registerRequest);
    User getCurrentUser();
}
