package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entite.SetDefaultRequest;
import com.example.demo.entite.Societe;
import com.example.demo.entite.SocieteDTO;
import com.example.demo.entite.User;
import com.example.demo.service.SocieteService;

@RestController
@RequestMapping("/Societe")
public class SocieteController {

	@Autowired
	private SocieteService societeService;

	@PostMapping("/add")
	public ResponseEntity<Societe> createSociete(@RequestBody Societe societe) {
		Societe createdSociete = societeService.createSociete(societe);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdSociete);
	}

	@GetMapping("/get")
	public ResponseEntity<List<Societe>> getAllSocietes() {
		List<Societe> societes = societeService.getAllSocietes();
		return ResponseEntity.ok(societes);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Societe> getSociete(@PathVariable Integer id) {
		Societe societe = societeService.getSocieteById(id);
		return ResponseEntity.ok(societe);
	}

	@PostMapping("/{societeId}/assign-users")
	public ResponseEntity<Societe> assignUsersToSociete(@PathVariable Integer societeId,
			@RequestBody List<Long> userIds) {
		Societe updatedSociete = societeService.assignUsersToSociete(societeId, userIds);
		return ResponseEntity.ok(updatedSociete);
	}

	@GetMapping("/all-names-with-users")
	public ResponseEntity<List<SocieteDTO>> getAllSocietesWithUserNames() {
		List<SocieteDTO> societes = societeService.getAllSocietesWithUserNames();
		return ResponseEntity.ok(societes);
	}

	@GetMapping("/{societeId}/users")
	public ResponseEntity<List<User>> getUsersBySociete(@PathVariable Integer societeId) {
		List<User> users = societeService.getUsersBySocieteId(societeId);
		return ResponseEntity.ok(users);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<Societe> updateSociete(@PathVariable Integer id, @RequestBody Societe societeDetails) {
		Societe updatedSociete = societeService.updateSociete(id, societeDetails);
		return ResponseEntity.ok(updatedSociete);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteSociete(@PathVariable Integer id) {
		societeService.deleteSociete(id);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{societeId}/users/{userId}")
	public ResponseEntity<Void> removeUserFromSociete(@PathVariable Integer societeId, @PathVariable Long userId) {
		societeService.removeUserFromSociete(societeId, userId);
		return ResponseEntity.noContent().build();
	}

}