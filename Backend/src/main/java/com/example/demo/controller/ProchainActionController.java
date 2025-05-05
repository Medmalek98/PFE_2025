package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.demo.dao.ProchainActionRepository;

import com.example.demo.entite.ProchainAction;

@RestController
@RequestMapping ("/prochainaction")
public class ProchainActionController {
	
	
	@Autowired
	private ProchainActionRepository prochainActionRepository ; 
	
	
	
	
	@GetMapping ("/get")
	public List<ProchainAction> getAllActions() {
        return prochainActionRepository.findAll();
           }
	
	
	@GetMapping("/get/{id}")
    public ResponseEntity<ProchainAction> getActionById(@PathVariable Long id) {
        return prochainActionRepository.findById(id)
                .map(action -> ResponseEntity.ok(action))
                .orElse(ResponseEntity.notFound().build());
    }
	

	
	@PostMapping ("/add")
    public ProchainAction createAction(@RequestBody ProchainAction prochainAction) {
        return prochainActionRepository.save(prochainAction);
    }
	
	
	 @PutMapping("/put/{id}")
	    public ResponseEntity<ProchainAction> updateAction(@PathVariable Long id, @RequestBody ProchainAction prochainAction) {
	        if (!prochainActionRepository.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        prochainAction.setId(id);
	        return ResponseEntity.ok(prochainActionRepository.save(prochainAction));
	    }
	 
	 
	 @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Void> deleteAction(@PathVariable Long id) {
	        if (!prochainActionRepository.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        prochainActionRepository.deleteById(id);
	        return ResponseEntity.noContent().build();
	    }

	
}
