package org.zalmoxis.opaque.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemRequest;
import org.zalmoxis.opaque.Dtos.Vault.VaultItemResponse;
import org.zalmoxis.opaque.Security.UserPrincipal;
import org.zalmoxis.opaque.Services.Interfaces.VaultItemsServiceInterface;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
public class VaultController
{
    private final VaultItemsServiceInterface vaultItemsService;

    public VaultController(VaultItemsServiceInterface vaultItemsService) {
        this.vaultItemsService = vaultItemsService;
    }

    @GetMapping
    public ResponseEntity<List<VaultItemResponse>> getAllVaultItems(
            @AuthenticationPrincipal UserPrincipal principal
    )
    {
        return ResponseEntity.ok(vaultItemsService.findAllByUserId(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<Void> addVaultItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VaultItemRequest vaultItemRequest)
    {
        vaultItemsService.addVaultItem(principal.getId(), vaultItemRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<List<VaultItemResponse>> searchVaultItemsByTitle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String title)
    {
        return ResponseEntity.ok(vaultItemsService.findAllByTitle(principal.getId(), title));
    }

    @DeleteMapping("/{vaultItemId}")
    public ResponseEntity<Void> deleteVaultItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String vaultItemId)
    {
        vaultItemsService.removeVaultItem(principal.getId(), java.util.UUID.fromString(vaultItemId));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{vaultItemId}")
    public ResponseEntity<Void> updateVaultItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String vaultItemId,
            @Valid @RequestBody VaultItemRequest vaultItemRequest)
    {
        vaultItemsService.updateVaultItem(principal.getId(), java.util.UUID.fromString(vaultItemId), vaultItemRequest);
        return ResponseEntity.ok().build();
    }
}
