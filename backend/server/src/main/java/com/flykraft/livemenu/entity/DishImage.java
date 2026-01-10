package com.flykraft.livemenu.entity;

import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.flykraft.livemenu.model.CloudinaryFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashMap;
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

    public Map<String, Object> getUploadParams(String folderPath) {
        Map<String, Object> params = new HashMap<>();
        params.put("folder", folderPath);
        params.put("resource_type", "image");
        params.put("quality", "auto:good");
        params.put("fetch_format", "auto");
        params.put("flags", "lossy");
        params.put("transformation", new Transformation<>()
                .width(1024)
                .height(1024)
                .crop("fill")
                .gravity("auto")
        );
        return params;
    }
}
