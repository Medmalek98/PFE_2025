package com.example.demo.entite;

import java.util.Set;

public class SocieteDTO {
    private String societeName;
    private Set<String> userNames; 

    public String getSocieteName() {
        return societeName;
    }

    public Set<String> getUserNames() {
        return userNames;
    }
}
