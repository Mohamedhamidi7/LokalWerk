package com.root.LokalWerk.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {
    private final RestTemplate restTemplate;
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public String upload(MultipartFile file, String supabaseFileName) throws IOException {

        String fileName =
                UUID.randomUUID() + "-" + file.getOriginalFilename();

        String uploadUrl =
                supabaseUrl +
                        "/storage/v1/object/"+ supabaseFileName +"/" +
                        fileName;

        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);

        headers.setContentType(
                MediaType.parseMediaType(file.getContentType())
        );

        HttpEntity<byte[]> request =
                new HttpEntity<>(file.getBytes(), headers);

        restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                request,
                String.class
        );

        return uploadUrl;
    }
}
