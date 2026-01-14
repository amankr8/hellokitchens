package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.user.UserResDto;
import com.flykraft.livemenu.model.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "users")
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "au_id", nullable = false, unique = true)
    private AuthUser authUser;

    @Column(name = "u_name")
    private String name;

    @Column(name = "u_phone")
    private String phone;

    @Column(name = "u_default_address_id")
    private Long defaultAddressId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Address> addresses;

    public UserResDto toResponseDto() {
        return UserResDto.builder()
                .id(this.id)
                .name(this.name)
                .phone(this.phone)
                .defaultAddressId(this.defaultAddressId)
                .addresses(this.addresses == null ? List.of() : this.addresses.stream()
                        .map(Address::toResponseDto)
                        .toList()
                )
                .build();
    }
}
