package com.root.LokalWerk.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.ManyToMany;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class BundleOffer extends Offer{
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private BigDecimal price = BigDecimal.ZERO;
    @Column(nullable = false)
    private BigDecimal offerPrice = BigDecimal.ZERO;
    @Column(nullable = false)
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    @ManyToMany
    private List<Product> produkts = new ArrayList<>();

    public BundleOffer(
            String name,
            LocalDateTime start,
            LocalDateTime end,
            BigDecimal discountPercentage,
            List<Product> produktList
    ){
        super(null,start,end);
        this.produkts = produktList;
        this.name = name;
        this.discountPercentage = discountPercentage;
        for (Product produkt : produktList)
            this.price = produkt.getPrice().add(this.price);
        this.offerPrice = price.multiply(BigDecimal.ONE.subtract(discountPercentage));
    }
}