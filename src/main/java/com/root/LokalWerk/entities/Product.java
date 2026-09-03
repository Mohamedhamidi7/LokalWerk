package com.root.LokalWerk.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    //@Column(nullable = false)
    private String name;
    private String description;
    //@Column(nullable = false)
    private BigDecimal costPrice;
    //@Column(nullable = false)
    private BigDecimal price;
    private String imageURL;
    @CreationTimestamp
    //@Column(nullable = false, updatable = false)
    private LocalDateTime addedAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    private boolean available = true;
    private boolean preorderAvailable = true;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
