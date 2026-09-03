package com.root.LokalWerk.controllers;

import com.root.LokalWerk.dtos.requests.admin.ProductRequest;
import com.root.LokalWerk.dtos.responses.admin.ProductResponse;
import com.root.LokalWerk.entities.Product;
import com.root.LokalWerk.services.ProductService;
import com.root.LokalWerk.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/produkts")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final SupabaseStorageService supabaseStorageService;
    //Adding a new Product
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @RequestPart("product") ProductRequest request,
            @RequestPart("image") MultipartFile image
    ) throws IOException {

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(
                        ProductResponse.from(productService.create(request, supabaseStorageService.upload(image, "products"))
                    )
            );
    }

    //Getting One Product with id
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(
            @PathVariable int id
    ){
        Product product = productService.get(id);
        if (product == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(
                ProductResponse.from(product)
        );
    }
    //Getting all Products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> get(){
        List<Product> products = productService.get();
        return ResponseEntity.status(HttpStatus.OK).body(
                products.stream().map(ProductResponse::from).toList()
        );
    }
    //Editing a Product with id
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @RequestBody ProductRequest request,
            @PathVariable int id
    ){
        Product product = productService.update(request, id);
        if (product == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(
                ProductResponse.from(product)
        );
    }
    //Deleting a produkt with id
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductResponse> delete(
            @PathVariable int id
    ){
        Product product = productService.delete(id);
        if (product == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        return ResponseEntity.status(HttpStatus.OK).body(
                ProductResponse.from(product)
        );
    }

    //Uploading an Image

}
