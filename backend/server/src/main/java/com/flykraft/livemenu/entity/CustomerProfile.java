package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.user.ProfileResDto;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer_profiles")
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "cp_name", nullable = false)
    private String name;

    @Column(name = "cp_phone", nullable = false)
    private String phone;

    @Column(name = "cp_address", nullable = false)
    private String address;

    public ProfileResDto toResponseDto() {
        return ProfileResDto.builder()
                .id(this.id)
                .address(this.address)
                .build();
    }
}
