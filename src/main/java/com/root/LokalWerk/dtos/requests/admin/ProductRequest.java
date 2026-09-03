package com.root.LokalWerk.dtos.requests.admin;

import com.root.LokalWerk.entities.Product;
import jakarta.persistence.Column;

import java.math.BigDecimal;

public record ProductRequest (
        String name,
        String description,
        BigDecimal costPrice,
        BigDecimal price,
        boolean available,
        boolean preorderAvailable,
        @Column(nullable = true)
        Integer categoryId
){
    public static ProductRequest from(Product product){
        return new ProductRequest(
                product.getName(),
                product.getDescription(),
                product.getCostPrice(),
                product.getPrice(),
                product.isAvailable(),
                product.isPreorderAvailable(),
                product.getCategory().getId()
        );
    }
}
