package com.example.demo.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entite.User;

public interface UserRepository extends JpaRepository<User,Long> {
	
	
	
	@Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
	Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
	
	
	 @Query("SELECT u FROM User u WHERE u.username = :username")
	    User findByUsername(@Param("username") String username);
	 
	 @Query("SELECT u.username FROM User u WHERE u.email = :email or u.username = :email")
	    Optional<String> findNameByEmail(@Param("email") String email);
	 
	 
	 
	 boolean existsByUsername(String username);
		boolean existsByEmail(String email);

}
