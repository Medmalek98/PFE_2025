package com.example.demo.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.demo.entite.client;

public interface ClientRepository extends JpaRepository<client, Long> {
	
	
	
	@SuppressWarnings("unchecked")
	client save(client cclient);
	
    List<client> findAll();
    
    Optional<client> findById(Long id);
    
    void deleteById(Long id);
    
    
    boolean existsById(Long id);

}
