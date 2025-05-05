package com.example.demo.entite;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "societe")
public class Societe {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "societeName")
	private String societeName;

	@Column(name = "matriculeFiscal")
	private String matriculeFiscal;

	@Column(name = "debutContract")
	private String debutContract;

	@Column(name = "finContract")
	private String finContract;

	@Column(name = "IPadresse")
	private String IPadresse;

	@Column(name = "nomContact")
	private String nomContact;

	@Column(name = "numContact")
	private String numContact;

	@ManyToMany(mappedBy = "societes", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JsonIgnore
	private Set<User> users = new HashSet<>();

	// Constructors
	public Societe() {
	}

	public Societe(String societeName, String matriculeFiscal, String debutContract, String finContract,
			String IPadresse, String numContact, String nomContact) {
		this.societeName = societeName;
		this.matriculeFiscal = matriculeFiscal;
		this.debutContract = debutContract;
		this.finContract = finContract;
		this.IPadresse = IPadresse;
		this.numContact = numContact;
		this.nomContact = nomContact;

	}

	// Getters & Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSocieteName() {
		return societeName;
	}

	public void setSocieteName(String societeName) {
		this.societeName = societeName;
	}

	public String getMatriculeFiscal() {
		return matriculeFiscal;
	}

	public void setMatriculeFiscal(String matriculeFiscal) {
		if (matriculeFiscal == null || matriculeFiscal.length() != 13) {
			throw new IllegalArgumentException("Matricule fiscal doit contenir 13 caractères.");
		}
		this.matriculeFiscal = matriculeFiscal;
	}

	public String getDebutContract() {
		return debutContract;
	}

	public void setDebutContract(String debutContract) {
		this.debutContract = debutContract;
	}

	public String getFinContract() {
		return finContract;
	}

	public void setFinContract(String finContract) {
	    this.finContract = finContract;
	}

	public String getIPadresse() {
		return IPadresse;
	}

	public void setIPadresse(String iPadresse) {
//		if (iPadresse != null && !iPadresse
//				.matches("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")) {
//			throw new IllegalArgumentException("Invalid IP address format");
//		}
		this.IPadresse = iPadresse;
	}

	public String getNomContact() {
		return nomContact;
	}

	public void setNomContact(String nomContact) {
		this.nomContact = nomContact;
	}

	public String getNumContact() {
		return numContact;
	}

	public void setNumContact(String numContact) {
		if (numContact == null || !numContact.matches("\\d{8}")) {
			throw new IllegalArgumentException("Numéro de contact invalide (8 chiffres attendus).");
		}
		this.numContact = numContact;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}
}
