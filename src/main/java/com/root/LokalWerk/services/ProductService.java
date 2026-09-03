package com.root.LokalWerk.services;

import com.root.LokalWerk.dtos.requests.admin.ProductRequest;
import com.root.LokalWerk.entities.Category;
import com.root.LokalWerk.entities.Product;
import com.root.LokalWerk.repositories.CategoryRepository;
import com.root.LokalWerk.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    public Product create(ProductRequest request, String imageUrl) {

        Category category = null;

        if (request.categoryId() != null) {
            category = categoryRepository
                    .findById(request.categoryId())
                    .orElse(null);
        }

        return productRepository.save(
                Product.builder()
                        .name(request.name())
                        .description(request.description())
                        .costPrice(request.costPrice())
                        .price(request.price())
                        .imageURL(imageUrl)
                        .preorderAvailable(request.preorderAvailable())
                        .category(category)
                        .build()
        );
    }



    public Product get(int id){
        return productRepository.findById(id)
                .orElse(null);
    }

    public List<Product> get(){
        return productRepository.findAll();
    }

    public Product update(ProductRequest request, int id){
        Product product = get(id);
        if (product == null)
            return null;
        Category category = categoryRepository.findById(request.categoryId()).orElse(null);
        product.setName(request.name());
        product.setDescription(request.description());
        product.setCostPrice(request.costPrice());
        product.setPrice(request.price());
        product.setAvailable(request.available());
        product.setPreorderAvailable(request.preorderAvailable());
        product.setCategory(category);
        return productRepository.save(product);
    }

    public Product delete(int id) {
        Product product = get(id);
        if (product == null)
            return null;
        productRepository.deleteById(id);
        return product;
    }
}
