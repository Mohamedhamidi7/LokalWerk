package com.root.LokalWerk.dtos.requests.admin;

import com.root.LokalWerk.entities.Category;
import com.root.LokalWerk.entities.Product;

public record CategoryRequest(
        String name,
        String description
) {
    public static CategoryRequest from(Category category){
        return new CategoryRequest(
                category.getName(),
                category.getDescription()
        );
    }
}
