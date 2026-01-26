package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.menu.CategoryResponseDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Filter(name = "kitchenFilter", condition = "k_id = :kitchenId")
@Entity
@Table(name = "categories", uniqueConstraints = @UniqueConstraint(columnNames = {"k_id", "c_name"}))
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "k_id", nullable = false)
    private Kitchen kitchen;

    @Column(name = "c_name", nullable = false)
    private String name;

    public CategoryResponseDto toResponseDto() {
        return CategoryResponseDto.builder()
                .id(this.id)
                .name(this.name)
                .build();
    }
}
