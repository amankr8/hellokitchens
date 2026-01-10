package com.flykraft.livemenu.entity;

import com.cloudinary.utils.ObjectUtils;
import com.flykraft.livemenu.model.CloudinaryFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "dish_images")
public class DishImage extends CloudinaryFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "di_id")
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "mi_id", nullable = false)
    private MenuItem menuItem;

    public Map<?, ?> getUploadParams(String folderPath) {
        return ObjectUtils.asMap(
                "folder", folderPath,
                "resource_type", "image",
                "quality", "auto",
                "fetch_format", "auto",
                "width", 1024,
                "height", 1024,
                "crop", "limit"
        );
    }
}
