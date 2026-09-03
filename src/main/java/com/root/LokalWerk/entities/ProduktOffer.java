package com.root.LokalWerk.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProduktOffer extends Offer{
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private BigDecimal price = BigDecimal.ZERO;
    @Column(nullable = false)
    private BigDecimal discountPercentage = BigDecimal.ONE;
    @Column(nullable = false)
    private BigDecimal offerPrice = price.multiply(BigDecimal.ONE.subtract(discountPercentage));
    @OneToOne
    @JoinColumn(name = "produkt_id", unique = true)
    private Product produkt;

}
