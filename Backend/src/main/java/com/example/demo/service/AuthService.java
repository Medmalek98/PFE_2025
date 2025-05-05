package com.example.demo.service;



import com.example.demo.jwt.JwtAuthReponse;
import com.example.demo.jwt.LoginDto;

public interface AuthService {
	
	JwtAuthReponse   login(LoginDto loginDto);
	
	JwtAuthReponse refreshAccessToken(String refreshToken);

}
