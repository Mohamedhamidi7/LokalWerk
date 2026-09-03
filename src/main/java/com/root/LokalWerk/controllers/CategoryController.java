package com.root.LokalWerk.controllers;

import com.root.LokalWerk.dtos.requests.admin.CategoryRequest;
import com.root.LokalWerk.dtos.responses.admin.CategoryResponse;
import com.root.LokalWerk.dtos.responses.admin.ProductResponse;
import com.root.LokalWerk.entities.Category;
import com.root.LokalWerk.entities.Product;
import com.root.LokalWerk.services.CategoryService;
import com.root.LokalWerk.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    public final CategoryService categoryService;
    public final SupabaseStorageService supabaseStorageService;

    //Adding a new Category
    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @RequestPart("category") CategoryRequest request,
            @RequestPart("image") MultipartFile image
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        CategoryResponse.from(categoryService.create(request, supabaseStorageService.upload(image, "Categories")))
                );
    }

    //Adding a produkt to the Category
    @PostMapping("/{id}")
    public ResponseEntity<String> addProduct(
            @PathVariable int id,
            @RequestBody int productId
    ){
        Category category = categoryService.addProduct(id, productId);
        if(category == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category or Product not found!");
        return ResponseEntity.status(HttpStatus.OK).body("Added");
    }


    //Getting all the Categories
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> get(){
        List<Category> categories = categoryService.get();
        return ResponseEntity.status(HttpStatus.OK).body(
                categories.stream().map(CategoryResponse::from).toList()
        );
    }

    //Getting Products of a Category
    @GetMapping("/{id}")
    public ResponseEntity<List<ProductResponse>> getProductsOf(
            @PathVariable int id
    ){
        Set<Product> products = categoryService.getProductsOf(id);
        if(products == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(
                products.stream().map(ProductResponse::from).toList()
        );
    }

    //Deleting a category
    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryResponse> delete(
            @PathVariable int id
    ){
        Category category = categoryService.delete(id);
        if (category == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(
                CategoryResponse.from(category)
        );
    }

}
