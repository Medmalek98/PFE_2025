package com.example.demo.controller;

import java.util.HashMap;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.RoleRepository;
import com.example.demo.dao.SocieteRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.entite.Role;
import com.example.demo.entite.Societe;
import com.example.demo.entite.User;
import com.example.demo.service.SocieteService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private SocieteRepository societeRepository;

	@Autowired
	private UserService userService;
	@Autowired
	private SocieteService societeService;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@PostMapping("/add")
	public ResponseEntity<?> createUser(@RequestBody User user) {
		// Validate username
		if (user.getUsername() == null || user.getUsername().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is required.");
		}

		// Validate email
		if (user.getEmail() == null || user.getEmail().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
		}

		// Check if username or email already exists
		if (userRepository.existsByUsername(user.getUsername())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken.");
		}

		if (userRepository.existsByEmail(user.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use.");
		}

		// Encode password
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		// Validate and set roles
		Set<Role> existingRoles = new HashSet<>();
		for (Role role : user.getRoles()) {
			List<Role> roles = roleRepository.findByName(role.getName());
			if (!roles.isEmpty()) {
				existingRoles.addAll(roles);
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body("Role " + role.getName() + " does not exist.");
			}
		}
		user.setRoles(existingRoles);

		// Initialize societes if null
		if (user.getSocietes() == null) {
			user.setSocietes(new HashSet<>());
		}

		// Validate and associate societes
		Set<Societe> societes = user.getSocietes();
		for (Societe societe : societes) {
			// Validate societe fields
			if (societe.getSocieteName() == null || societe.getSocieteName().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("SocieteName is required.");
			}
			if (societe.getMatriculeFiscal() == null || societe.getMatriculeFiscal().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("MatriculeFiscal is required.");
			}
			if (societe.getDebutContract() == null || societe.getDebutContract().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("DebutContract is required.");
			}
			if (societe.getFinContract() == null || societe.getFinContract().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("FinContract is required.");
			}
			if (societe.getIPadresse() == null || societe.getIPadresse().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("IPadresse is required.");
			}

			// Check if societe already exists
			Optional<Societe> existingSociete = societeRepository.findBySocieteName(societe.getSocieteName());
			if (existingSociete.isPresent()) {
				// If societe exists, associate it with the user
				existingSociete.get().getUsers().add(user);
			} else {
				// If societe does not exist, save it and associate it with the user
				societeRepository.save(societe);
				societe.getUsers().add(user);
			}
		}

		// Save the user
		User createdUser = userRepository.save(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}
	
	@GetMapping("/{id}/societes")
	public ResponseEntity<Set<Societe>> getUserSocietes(@PathVariable Long id) {
	    Optional<User> user = userRepository.findById(id);
	    return user.map(value -> ResponseEntity.ok(value.getSocietes()))
	            .orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/profile")
	public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal UserDetails userPrincipal) {
		userRepository.findByUsername(userPrincipal.getUsername());
		return ResponseEntity.ok().build();
	}

	@GetMapping("/get")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userRepository.findAll();
		return ResponseEntity.ok(users);
	}

	@PutMapping("/put/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
		return userRepository.findById(id).map(user -> {
			user.setName(userDetails.getName());
			user.setUsername(userDetails.getUsername());
			user.setEmail(userDetails.getEmail());

			if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
				user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
			}
			User updatedUser = userRepository.save(user);
			return ResponseEntity.ok(updatedUser);
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
	    try {
	        userService.deleteUser(id);
	        return ResponseEntity.noContent().build();
	    } catch (RuntimeException e) {
	        return ResponseEntity.notFound().build();
	    }
	}


	 @GetMapping("/name")
	    public ResponseEntity<Map<String, String>> getNameByEmail(@RequestParam String email) {
	        Optional<String> name = userRepository.findNameByEmail(email);
	        Map<String, String> response = new HashMap<>();
	        
	        // If name is found, return the name in a map, else return a 404
	        if (name.isPresent()) {
	            response.put("name", name.get());
	            return ResponseEntity.ok(response); // Return the name wrapped in a JSON object
	        } else {
	            response.put("message", "Utilisateur non trouvé");
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	        }
	    }

	 @GetMapping("/mes-societes")
	 public ResponseEntity<Set<Societe>> getMySocietes(@AuthenticationPrincipal UserDetails userDetails) {
	     Set<Societe> societes = societeService.findSocietesByUser(userDetails.getUsername());
	     return ResponseEntity.ok(societes);
	 }


}