package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.user.AddressResDto;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "a_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "u_id", nullable = false)
    private User user;

    @Column(name = "a_street_address", nullable = false)
    private String streetAddress;

    @Column(name = "a_full_address", nullable = false)
    private String fullAddress;

    @Column(name = "a_location", nullable = false)
    private String location;

    public AddressResDto toResponseDto() {
        return AddressResDto.builder()
                .id(this.id)
                .streetAddress(this.streetAddress)
                .fullAddress(this.fullAddress)
                .location(this.location)
                .build();
    }
}
