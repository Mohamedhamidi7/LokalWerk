package com.root.LokalWerk.repositories;

import com.root.LokalWerk.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
