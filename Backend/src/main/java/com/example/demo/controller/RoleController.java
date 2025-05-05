package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.RoleRepository;
import com.example.demo.entite.Role;

@RestController
@RequestMapping("/role")
public class RoleController {
	
	
	
	@Autowired
	   private RoleRepository roleRepository ;	
		
		
		@GetMapping("/get")
	    public ResponseEntity<List<Role>> getAllRole() {
	        List<Role> role = roleRepository.findAll();
	        return ResponseEntity.ok(role);
	    }

}
