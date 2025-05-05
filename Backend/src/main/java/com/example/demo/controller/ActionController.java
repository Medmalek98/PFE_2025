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

import com.example.demo.dao.ActionRepository;
import com.example.demo.entite.Action;







@RestController
@RequestMapping ("/action")
public class ActionController {
	
	@Autowired
	private ActionRepository actionRepositry ; 
	
	
	@GetMapping ("/get")
	public List<Action> getAllActions() {
        return actionRepositry.findAll();
           }
	

	 @GetMapping("/get/{id}")
	    public ResponseEntity<Action> getActionById(@PathVariable Long id) {
	        return actionRepositry.findById(id)
	                .map(action -> ResponseEntity.ok(action))
	                .orElse(ResponseEntity.notFound().build());
	    }
	 
	 @PostMapping ("/add")
	    public Action createAction(@RequestBody Action action) {
	        return actionRepositry.save(action);
	    }
	 
	 
	  @PutMapping("/put/{id}")
	    public ResponseEntity<Action> updateAction(@PathVariable Long id, @RequestBody Action action) {
	        if (!actionRepositry.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        action.setIdactions(id);
	        return ResponseEntity.ok(actionRepositry.save(action));
	    }

	  @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Void> deleteAction(@PathVariable Long id) {
	        if (!actionRepositry.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        actionRepositry.deleteById(id);
	        return ResponseEntity.noContent().build();
	    }

}
