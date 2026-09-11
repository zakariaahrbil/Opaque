package org.zalmoxis.opaque.Dtos.Vault;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VaultItemRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title cannot exceed 100 characters")
        String title,

        String website,

        String category,

        @NotBlank(message = "IV is required")
        String iv,

        @NotBlank(message = "Encrypted data is required")
        String encryptedData
) {
}
