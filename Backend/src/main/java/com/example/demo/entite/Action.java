package com.example.demo.entite;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity

@Table (name= "Action")
public class Action {
	
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 @Column(name = "idactions")
    private Long idactions;
	
	 @Column(name = "nameactions") 
	 private String nameactions;
	 
	 @Version  // Colonne de version pour gérer le verrouillage optimiste
	    private int version;

	public Action() {
		super();
	}

	public Action(String nameactions) {
		super();
		this.nameactions = nameactions;
	}

	public Long getIdactions() {
		return idactions;
	}

	public void setIdactions(Long idactions) {
		this.idactions = idactions;
	}

	public String getNameactions() {
		return nameactions;
	}

	public void setNameactions(String nameactions) {
		this.nameactions = nameactions;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}
	 
	 
	 
	 




	
	
	 
	 
	 
	 

}
