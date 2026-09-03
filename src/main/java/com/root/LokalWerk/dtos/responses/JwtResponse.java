package com.root.LokalWerk.dtos.responses;

import lombok.Builder;

@Builder
public record JwtResponse(
        String token
) {
}
