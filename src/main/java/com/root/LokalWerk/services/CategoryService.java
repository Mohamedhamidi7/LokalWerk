package com.root.LokalWerk.services;

import com.root.LokalWerk.dtos.requests.admin.CategoryRequest;
import com.root.LokalWerk.entities.Category;
import com.root.LokalWerk.entities.Product;
import com.root.LokalWerk.repositories.CategoryRepository;
import com.root.LokalWerk.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    public Category create(CategoryRequest request, String imageUrl) {
        return categoryRepository.save(
                Category.builder()
                        .name(request.name())
                        .description(request.description())
                        .imageURL(imageUrl)
                        .build()
        );
    }

    public Category addProduct(int id, int productId) {
        Category category = get(id);
        Product product = productRepository.findById(productId).orElse(null);
        if (category == null || product == null)
            return null;
        product.setCategory(category);
        productRepository.save(product);
        return category;
    }

    public Category get(int id){
        return categoryRepository.findById(id)
                .orElse(null);
    }

    public List<Category> get(){
        return categoryRepository.findAll();
    }

    public Set<Product> getProductsOf(int id) {
        Category category = get(id);
        if(category != null)
            return category.getProdukts();
        return null;
    }

    public Category delete(int id) {
        Category category = get(id);
        if (category == null)
            return null;
        category.getProdukts().forEach(product -> product.setCategory(null));
        categoryRepository.deleteById(id);
        return category;
    }
}
