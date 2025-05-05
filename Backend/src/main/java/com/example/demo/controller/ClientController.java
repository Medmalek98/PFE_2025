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

import com.example.demo.dao.ClientRepository;

import com.example.demo.entite.client;

@RestController
@RequestMapping("/client")
public class ClientController {
	
	
	
	@Autowired
	private ClientRepository clientRepository ; 
	
	
	@GetMapping ("/get")
	public List<client> getAllActions() {
        return clientRepository.findAll();
    }
	
	
	
	 @GetMapping("/get/{id}")
	    public ResponseEntity<client> getActionById(@PathVariable Long id) {
	        return clientRepository.findById(id)
	                .map(cclient -> ResponseEntity.ok(cclient))
	                .orElse(ResponseEntity.notFound().build());
	    }
	    
	    
	    
	    @PostMapping ("/add")
	    public client createAction(@RequestBody client cclient) {
	        return clientRepository.save(cclient);
	    }
	    
	    
	    @PutMapping("/put/{id}")
	    public ResponseEntity<client> updateAction(@PathVariable Long id, @RequestBody client cclient) {
	        if (!clientRepository.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        cclient.setId(id);
	        return ResponseEntity.ok(clientRepository.save(cclient));
	    }
	    
	    
	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Void> deleteAction(@PathVariable Long id) {
	        if (!clientRepository.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        clientRepository.deleteById(id);
	        return ResponseEntity.noContent().build();
	    }


}
