package org.zalmoxis.opaque.Services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemRequest;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemResponse;
import org.zalmoxis.opaque.Entities.User;
import org.zalmoxis.opaque.Entities.VaultItem;
import org.zalmoxis.opaque.Exceptions.ResourceNotFoundException;
import org.zalmoxis.opaque.Exceptions.UnauthorizedAccessException;
import org.zalmoxis.opaque.Mappers.Vault.VaultItemMapper;
import org.zalmoxis.opaque.Repositories.UserRepository;
import org.zalmoxis.opaque.Repositories.VaultItemRepository;
import org.zalmoxis.opaque.Services.Interfaces.VaultItemsServiceInterface;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VaultItemsService
        implements VaultItemsServiceInterface
{
    private final VaultItemRepository vaultItemRepository;
    private final UserRepository userRepository;

    public VaultItemsService(VaultItemRepository vaultItemRepository, UserRepository userRepository) {
        this.vaultItemRepository = vaultItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VaultItemResponse> findAllByTitle(UUID userId, String title)
    {
        List<VaultItem> vaultItems = vaultItemRepository.findAllByTitleAndUserId(title, userId);
        return vaultItems.stream()
                .map(VaultItemMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VaultItemResponse> findAllByUserId(UUID userId)
    {
        List<VaultItem> vaultItems = vaultItemRepository.findAllByUserId(userId);
        return vaultItems.stream()
                .map(VaultItemMapper::toResponse)
                .toList();
    }

    @Override
    public void addVaultItem(UUID userId, VaultItemRequest vaultItemRequest)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        VaultItem vaultItem = VaultItemMapper.toEntity(vaultItemRequest, user);
        vaultItemRepository.save(vaultItem);
    }

    @Override
    public void removeVaultItem(UUID userId, UUID vaultItemId)
    {
        VaultItem vaultItem = vaultItemRepository.findById(vaultItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Vault item not found"));
        if (vaultItem.getUser() == null || !vaultItem.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("User does not have permission to delete this vault item");
        }
        vaultItemRepository.delete(vaultItem);
    }

    @Override
    public void updateVaultItem(UUID userId, UUID vaultItemId, VaultItemRequest vaultItemRequest)
    {
        VaultItem vaultItem = vaultItemRepository.findById(vaultItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Vault item not found"));
        if (vaultItem.getUser() == null || !vaultItem.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("User does not have permission to update this vault item");
        }
        VaultItemMapper.updateEntityFromRequest(vaultItem, vaultItemRequest);
        vaultItemRepository.save(vaultItem);
    }
}
