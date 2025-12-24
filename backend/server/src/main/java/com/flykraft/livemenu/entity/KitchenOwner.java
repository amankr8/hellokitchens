package com.flykraft.livemenu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "kitchen_owner")
public class KitchenOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ko_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "au_id", nullable = false)
    private AuthUser authUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "k_id", nullable = false)
    private Kitchen kitchen;

    @Column(name = "ko_name")
    private String name;

    @Column(name = "ko_email")
    private String email;

    @Column(name = "ko_phone")
    private String phone;
}
