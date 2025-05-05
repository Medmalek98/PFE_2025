package com.example.demo.entite;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name = "Client")
public class client {
	
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	private String raisonsocail;
	
	private String contact;
	
	private String codepostal;
	
	private String ville;
	
	private String adresse;
	
	private Long tel1;
	
	private Long tel2;
	
	private String mail;
	
	private String siteweb;
	
	private String action;
	
	private String description;
	
	private String prochainaction;
	
	
	private String cuser ;


	public client(String raisonsocail, String contact, String codepostal, String ville, String adresse, Long tel1,
			Long tel2, String mail, String siteweb, String action, String description, String prochainaction,
			String cuser) {
		super();
		this.raisonsocail = raisonsocail;
		this.contact = contact;
		this.codepostal = codepostal;
		this.ville = ville;
		this.adresse = adresse;
		this.tel1 = tel1;
		this.tel2 = tel2;
		this.mail = mail;
		this.siteweb = siteweb;
		this.action = action;
		this.description = description;
		this.prochainaction = prochainaction;
		this.cuser = cuser;
	}


	public client() {
		super();
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getRaisonsocail() {
		return raisonsocail;
	}


	public void setRaisonsocail(String raisonsocail) {
		this.raisonsocail = raisonsocail;
	}


	public String getContact() {
		return contact;
	}


	public void setContact(String contact) {
		this.contact = contact;
	}


	public String getCodepostal() {
		return codepostal;
	}


	public void setCodepostal(String codepostal) {
		this.codepostal = codepostal;
	}


	public String getVille() {
		return ville;
	}


	public void setVille(String ville) {
		this.ville = ville;
	}


	public String getAdresse() {
		return adresse;
	}


	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}


	public Long getTel1() {
		return tel1;
	}


	public void setTel1(Long tel1) {
		this.tel1 = tel1;
	}


	public Long getTel2() {
		return tel2;
	}


	public void setTel2(Long tel2) {
		this.tel2 = tel2;
	}


	public String getMail() {
		return mail;
	}


	public void setMail(String mail) {
		this.mail = mail;
	}


	public String getSiteweb() {
		return siteweb;
	}


	public void setSiteweb(String siteweb) {
		this.siteweb = siteweb;
	}


	public String getAction() {
		return action;
	}


	public void setAction(String action) {
		this.action = action;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public String getProchainaction() {
		return prochainaction;
	}


	public void setProchainaction(String prochainaction) {
		this.prochainaction = prochainaction;
	}


	public String getCuser() {
		return cuser;
	}


	public void setCuser(String cuser) {
		this.cuser = cuser;
	}


	
	
	
	
	
	
	
	


	
				

}
