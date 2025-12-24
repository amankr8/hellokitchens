package com.flykraft.livemenu.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "kitchen_owners")
public class KitchenOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "owner_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AuthUser authUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kitchen_id", nullable = false)
    private Kitchen kitchen;

    @Column(name = "owner_name")
    private String name;

    @Column(name = "owner_email")
    private String email;

    @Column(name = "owner_phone")
    private String phone;
}
