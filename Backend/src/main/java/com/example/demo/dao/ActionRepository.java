package com.example.demo.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entite.Action;





public interface ActionRepository extends JpaRepository<Action, Long> {
	
	
	@SuppressWarnings("unchecked")
	Action save(Action action);
	
    List<Action> findAll();
    
    Optional<Action> findById(Long id);
    
    void deleteById(Long id);
    
    
    boolean existsById(Long id);

}
