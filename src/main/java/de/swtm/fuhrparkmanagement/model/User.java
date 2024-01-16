package de.swtm.fuhrparkmanagement.model;

import lombok.Data;

@Data
public class User {

    private int id;
    private String name;
    private String givenName;
    private String surname;
    private String mail;
}
