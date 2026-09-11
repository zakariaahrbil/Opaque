package org.zalmoxis.opaque.Mappers.Vault;

import org.springframework.stereotype.Component;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemRequest;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemResponse;
import org.zalmoxis.opaque.Entities.User;
import org.zalmoxis.opaque.Entities.VaultItem;

@Component
public class VaultItemMapper {

    public static VaultItemResponse toResponse(VaultItem item) {
        if (item == null) {
            return null;
        }
        return new VaultItemResponse(
                item.getId(),
                item.getTitle(),
                item.getWebsite(),
                item.getCategory(),
                item.getIv(),
                item.getEncryptedData(),
                item.getCreated(),
                item.getUpdated()
        );
    }

    public static VaultItem toEntity(VaultItemRequest request, User user) {
        if (request == null) {
            return null;
        }
        VaultItem item = new VaultItem();
        item.setUser(user);
        item.setTitle(request.title());
        item.setWebsite(request.website());
        item.setCategory(request.category());
        item.setIv(request.iv());
        item.setEncryptedData(request.encryptedData());
        return item;
    }

    public static void updateEntityFromRequest(VaultItem item, VaultItemRequest request) {
        if (item == null || request == null) {
            return;
        }
        item.setTitle(request.title());
        item.setWebsite(request.website());
        item.setCategory(request.category());
        item.setIv(request.iv());
        item.setEncryptedData(request.encryptedData());
    }
}
