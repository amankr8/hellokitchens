package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.customer.CustomerResDto;
import com.flykraft.livemenu.model.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "customers")
public class Customer extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "au_id", nullable = false)
    private AuthUser authUser;

    @Column(name = "c_name")
    private String name;

    @Column(name = "c_email, unique = true")
    private String email;

    @Column(name = "c_phone, unique = true, nullable = false")
    private String phone;

    @Column(name = "c_address")
    private String address;

    public CustomerResDto toResponseDto() {
        return CustomerResDto.builder()
                .id(this.id)
                .name(this.name)
                .email(this.email)
                .phone(this.phone)
                .address(this.address)
                .build();
    }
}
