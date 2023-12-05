package de.swtm.fuhrparkmanagement;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FuhrparkmanagementSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(FuhrparkmanagementSpringApplication.class, args);
        System.out.println("Hallo World");
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
