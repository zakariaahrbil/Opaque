package org.zalmoxis.opaque.Dtos.Vault;

import java.time.Instant;
import java.util.UUID;

public record VaultItemResponse(
        UUID id,
        String title,
        String website,
        String category,
        String iv,
        String encryptedData,
        Instant created,
        Instant updated
) {
}
