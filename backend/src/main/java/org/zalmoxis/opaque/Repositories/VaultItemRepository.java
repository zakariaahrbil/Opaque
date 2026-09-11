package org.zalmoxis.opaque.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zalmoxis.opaque.Entities.VaultItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VaultItemRepository
        extends JpaRepository<VaultItem, UUID>
{
    List<VaultItem> findAllByUserId(UUID userId);

    List<VaultItem> findAllByTitle(String title);
}
