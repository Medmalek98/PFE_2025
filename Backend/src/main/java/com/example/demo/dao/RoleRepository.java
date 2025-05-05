package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entite.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	
	
	List<Role> findByName(String name);

}
