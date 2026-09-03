package com.root.LokalWerk.dtos.responses.admin;

import com.root.LokalWerk.entities.Category;
import com.root.LokalWerk.entities.Product;

import java.math.BigDecimal;

public record CategoryResponse(
        Integer id,
        String name,
        String description,
        String imageURL
) {
    public static CategoryResponse from(Category category){
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageURL()
        );
    }
}
