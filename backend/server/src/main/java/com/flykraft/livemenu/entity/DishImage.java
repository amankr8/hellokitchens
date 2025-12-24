package com.flykraft.livemenu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "dish_image")
public class DishImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "di_id")
    private Long id;

    @Column(name = "di_public_id")
    private String publicId;

    @Column(name = "di_url")
    private String url;
}
