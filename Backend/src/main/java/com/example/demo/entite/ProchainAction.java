package com.example.demo.entite;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity


@Table (name= "ProchainAction")
public class ProchainAction {
	
	
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	
    private Long id;
	
	 private String namepochainaction;
	 
	 
	 

	public ProchainAction(Long id, String namepochainaction) {
		super();
		this.id = id;
		this.namepochainaction = namepochainaction;
	}




	public ProchainAction() {
		super();
	}




	public Long getId() {
		return id;
	}




	public void setId(Long id) {
		this.id = id;
	}




	public String getNamepochainaction() {
		return namepochainaction;
	}




	public void setNamepochainaction(String namepochainaction) {
		this.namepochainaction = namepochainaction;
	}
	
	
	
	 
	 
	 

}
