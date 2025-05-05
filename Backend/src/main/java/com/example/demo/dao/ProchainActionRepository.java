package com.example.demo.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entite.ProchainAction;

public interface ProchainActionRepository extends JpaRepository<ProchainAction, Long> {
	
	@SuppressWarnings("unchecked")
	ProchainAction save(ProchainAction prochainAction);
	
    List<ProchainAction> findAll();
    
    Optional<ProchainAction> findById(Long id);
    
    void deleteById(Long id);
    
    
    boolean existsById(Long id);

}
