package com.example.demo.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.dao.SocieteRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.entite.Societe;
import com.example.demo.entite.SocieteDTO;
import com.example.demo.entite.User;

import jakarta.transaction.Transactional;

@Service
public class SocieteService {

	@Autowired
	private SocieteRepository societeRepository;

	@Autowired
	private UserRepository userRepository;

	public Societe createSociete(Societe societe) {
		return societeRepository.save(societe);
	}

	public Societe getSocieteById(Integer id) {
		return societeRepository.findById(id).orElseThrow(() -> new RuntimeException("Societe not found"));
	}

	public List<Societe> getAllSocietes() {
		return societeRepository.findAll();
	}

	@Transactional
	public Societe assignUsersToSociete(Integer societeId, List<Long> userIds) {
		Societe societe = societeRepository.findById(societeId)
				.orElseThrow(() -> new RuntimeException("Societe not found"));

		Set<User> users = userRepository.findAllById(userIds).stream().collect(Collectors.toSet());

		// Update the users and their associated societes
		for (User user : users) {
			user.getSocietes().add(societe); // Add Societe to User's societes
			userRepository.save(user); // Save User with the updated Societes
		}

		societe.setUsers(users); // Update Societe with the new users
		return societeRepository.save(societe);
	}

	public List<SocieteDTO> getAllSocietesWithUserNames() {
		return societeRepository.findAll().stream().map(societe -> new SocieteDTO()) 
				.collect(Collectors.toList());
	}

	public List<User> getUsersBySocieteId(Integer societeId) {
		return societeRepository.findById(societeId).map(Societe::getUsers).orElseThrow().stream().toList();
	}

	public void removeUserFromSociete(Integer societeId, Long userId) {
		Societe societe = societeRepository.findById(societeId)
				.orElseThrow(() -> new RuntimeException("Societe not found"));
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		societe.getUsers().remove(user);
		user.getSocietes().remove(societe);

		userRepository.save(user);
		societeRepository.save(societe);
	}

	public Societe updateSociete(Integer id, Societe societeDetails) {
		Societe societe = societeRepository.findById(id).orElseThrow(() -> new RuntimeException("Societe not found"));

		societe.setSocieteName(societeDetails.getSocieteName());
		societe.setMatriculeFiscal(societeDetails.getMatriculeFiscal());
		societe.setDebutContract(societeDetails.getDebutContract());
		societe.setFinContract(societeDetails.getFinContract());
		societe.setIPadresse(societeDetails.getIPadresse());
		societe.setNomContact(societeDetails.getNomContact());
		societe.setNumContact(societeDetails.getNumContact());

		return societeRepository.save(societe);
	}

	@Transactional
	public void deleteSociete(Integer id) {
		Societe societe = societeRepository.findById(id).orElseThrow(() -> new RuntimeException("Societe not found"));

		for (User user : societe.getUsers()) {
			user.getSocietes().remove(societe);
		}
		societe.getUsers().clear();

		societeRepository.delete(societe);
	}

	public Set<Societe> findSocietesByUser(String username) {
		User user = userRepository.findByUsername(username);

		return user.getSocietes();
	}


}
