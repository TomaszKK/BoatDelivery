package pl.dmcs.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends ControlledEntity {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @OneToMany(mappedBy = "courier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transport> transports;
}