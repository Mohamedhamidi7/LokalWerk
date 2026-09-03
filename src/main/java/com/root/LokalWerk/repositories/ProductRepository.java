package com.root.LokalWerk.repositories;

import com.root.LokalWerk.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
