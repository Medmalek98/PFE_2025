package com.example.demo.secuirty;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.example.demo.jwt.JwtAuthenticationEntryPoint;
import com.example.demo.jwt.JwtAuthenticationFilter;

import lombok.AllArgsConstructor;

@EnableMethodSecurity
@AllArgsConstructor
@Configuration
public class SpringSecuirtyConfig {
	
	
	
	 @Autowired
		private JwtAuthenticationEntryPoint authenticationEntryPoint;
		 
		 @Autowired
		 private JwtAuthenticationFilter authenticationFilter;


    @Bean
    static PasswordEncoder passwordEncoder(){
		        return new BCryptPasswordEncoder();
		    }
		 
		 
		 @Bean
		    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
			 
			 
			 http.csrf(csrf -> csrf.disable())
		        .cors(cors -> cors.configurationSource(request -> {
		            CorsConfiguration config = new CorsConfiguration();
		            config.setAllowCredentials(true);
		           config.addAllowedOriginPattern("*"); // Origine autorisée
		            config.addAllowedHeader("*"); // Tous les en-têtes autorisés
		            config.addAllowedMethod("GET");
		            config.addAllowedMethod("POST");
		            config.addAllowedMethod("PUT");
		            config.addAllowedMethod("DELETE");
		            config.addAllowedMethod("OPTIONS");// Toutes les méthodes autorisées
		            return config;
		        }))
			 
			 
	         .authorizeHttpRequests((authorize) -> {
//	            authorize.requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN");
//	             authorize.requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN");
//	             authorize.requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN");
//	             authorize.requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "USER");
//	             authorize.requestMatchers(HttpMethod.PATCH, "/api/**").hasAnyRole("ADMIN", "USER");
//	             authorize.requestMatchers(HttpMethod.GET, "/api/**").permitAll();
	             authorize.requestMatchers("/api/auth/**").permitAll();
	             authorize.requestMatchers("/api/users/**").permitAll();
	             authorize.requestMatchers("/Societe/**").permitAll();
	             authorize.requestMatchers("/role/**").permitAll();
	             authorize.requestMatchers("/client/*").permitAll();
	             authorize.requestMatchers("/action/*").permitAll();
	             authorize.requestMatchers("/prochainaction/*").permitAll();
	             authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();

	             authorize.anyRequest().authenticated();
	         }).httpBasic(Customizer.withDefaults());
			 
			 http.exceptionHandling( exception -> exception
		                .authenticationEntryPoint(authenticationEntryPoint));

		        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

		        return http.build();
			 
		 }
		 
		 
		 
		 @Bean
		    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		        return configuration.getAuthenticationManager();
		
		

	}

}
