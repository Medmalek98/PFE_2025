package com.example.demo.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entite.Societe;

@Repository
public interface SocieteRepository extends JpaRepository<Societe, Integer> {
	Optional<Societe> findById(Integer id);

	Optional<Societe> findBySocieteName(String societeName);
}
