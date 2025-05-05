package com.example.demo.entite;


public class SetDefaultRequest {
    private String username;
    private Long userId; 
    private Integer societeId; 
    private boolean isDefault;

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Integer societeId) {
        this.societeId = societeId;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
