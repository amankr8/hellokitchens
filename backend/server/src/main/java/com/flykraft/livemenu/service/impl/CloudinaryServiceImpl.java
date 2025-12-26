package com.flykraft.livemenu.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.flykraft.livemenu.model.CloudinaryFile;
import com.flykraft.livemenu.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    private Map<?, ?> getUploadParams(String folderPath) {
        return ObjectUtils.asMap(
                "folder", folderPath,
                "resource_type", "auto"
        );
    }

    @Override
    public CloudinaryFile uploadFile(MultipartFile file, String folderPath) throws IOException {
        Map<?, ?> params = getUploadParams(folderPath);
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
        return CloudinaryFile.builder()
                .publicId(result.get("public_id").toString())
                .secureUrl(result.get("secure_url").toString())
                .build();
    }

    @Override
    public void deleteFile(String publicId) throws IOException {
        Map<?, ?> params = ObjectUtils.asMap();
        Map<?, ?> deleteResult = cloudinary.uploader().destroy(publicId, params);

        if (!deleteResult.get("result").equals("ok")) {
            System.out.println("Could not delete file: " + deleteResult.get("result"));
        }
    }
}
