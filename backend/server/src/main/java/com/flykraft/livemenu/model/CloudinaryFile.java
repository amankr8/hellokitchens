package com.flykraft.livemenu.model;

import com.cloudinary.utils.ObjectUtils;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass
public class CloudinaryFile {

    @Column(name = "cn_public_id")
    private String publicId;

    @Column(name = "cn_secure_url")
    private String secureUrl;

    public Map<?, ?> getUploadParams(String folderPath) {
        return ObjectUtils.asMap(
                "folder", folderPath,
                "resource_type", "auto"
        );
    }
}
