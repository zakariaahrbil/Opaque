package org.zalmoxis.opaque.Services.Interfaces;

import org.zalmoxis.opaque.Dtos.Vault.VaultItemRequest;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemResponse;

import java.util.List;
import java.util.UUID;

public interface VaultItemsServiceInterface
{
    public List<VaultItemResponse> findAllByTitle(UUID userId, String title);

    public List<VaultItemResponse> findAllByUserId(UUID userId);

    public void addVaultItem(UUID userId, VaultItemRequest vaultItemRequest);

    public void removeVaultItem(UUID userId, UUID vaultItemId);

    public void updateVaultItem(UUID userId, UUID vaultItemId, VaultItemRequest vaultItemRequest);
}
