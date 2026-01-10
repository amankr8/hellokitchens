package com.flykraft.livemenu.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.flykraft.livemenu.model.CloudinaryFile;
import com.flykraft.livemenu.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    private Map<?, ?> getUploadParams(String folderPath) {
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

    @Override
    public CloudinaryFile uploadFile(MultipartFile file, String folderPath) {
        try {
            Map<?, ?> params = getUploadParams(folderPath);
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
            return CloudinaryFile.builder()
                    .publicId(result.get("public_id").toString())
                    .secureUrl(result.get("secure_url").toString())
                    .build();
        } catch (Exception e) {
            log.error("Error uploading file {}: {}", file.getOriginalFilename(), e.getMessage(), e);
            return null;
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            Map<?, ?> params = ObjectUtils.asMap();
            Map<?, ?> deleteResult = cloudinary.uploader().destroy(publicId, params);

            if (!deleteResult.get("result").equals("ok")) {
                log.error("Could not delete file: {}", deleteResult.get("result"));
            }
        } catch (Exception e) {
            log.error("Error deleting image with Public ID - {}: {}", publicId, e.getMessage(), e);
        }
    }
}
