package org.zalmoxis.opaque.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vault_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VaultItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
    @Column(nullable = false, length = 100)
    private String title;

    private String website;
    @Column(nullable = false)
    private String iv;
    private String category;
    @Column(nullable = false)
    private String encryptedData;

    @Column(nullable = false, updatable = false)
    private Instant created;
    @Column(nullable = false)
    private Instant updated;

    @PrePersist
    private void onCreate()
    {
        this.created = Instant.now();
        this.updated = Instant.now();
    }

    @PreUpdate
    private void onUpdate()
    {
        this.updated = Instant.now();
    }
}
