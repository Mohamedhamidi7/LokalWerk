package com.root.LokalWerk.dtos.responses.admin;

import com.root.LokalWerk.entities.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Integer id,
        String name,
        String description,
        BigDecimal costPrice,
        BigDecimal price,
        String imageURL,
        LocalDateTime addedAt,
        LocalDateTime updatedAt,
        boolean available,
        boolean preorderAvailable,
        CategoryResponse category
) {
    public static ProductResponse from(Product product){
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCostPrice(),
                product.getPrice(),
                product.getImageURL(),
                product.getAddedAt(),
                product.getUpdatedAt(),
                product.isAvailable(),
                product.isPreorderAvailable(),
                product.getCategory() != null ? CategoryResponse.from(product.getCategory()) : null
        );
    }
}
