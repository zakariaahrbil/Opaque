## Crypt Flow

### 1. Key Derivation (PBKDF2-HMAC-SHA256)
```
User Inputs: [Master Password] + [Email as Salt]
                     │
                     ▼
            masterKeyGen(...)
     (600,000 rounds of PBKDF2)
                     │
                     ▼
          Master Key (Uint8Array)  <── Kept ONLY in browser memory
```

---

### 2. Vault Encryption (AES-256-GCM)
```
Credentials Object: { login, password, website, description }
                     │
                     ▼
            JSON.stringify() + TextEncoder
                     │
                     ▼
       crypto.getRandomValues(IV: 12 bytes)
                     │
                     ▼
          crypto.subtle.encrypt()
  (Generates Ciphertext + 16-byte Auth Tag)
                     │
                     ▼
            uint8ArrayToBase64()
                     │
                     ▼
Output to Backend: { iv: string, ciphertext: string } (Base64)
```

---

### 3. Vault Decryption (AES-256-GCM)
```
Input from Backend: { iv: string, ciphertext: string } (Base64)
                     │
                     ▼
            base64ToUint8Array()
     (Extracts IV & Ciphertext + Auth Tag)
                     │
                     ▼
          crypto.subtle.decrypt()
 (Verifies Auth Tag & Decrypts with Master Key)
                     │
                     ▼
          TextDecoder + JSON.parse()
                     │
                     ▼
Credentials Object: { login, password, website, description }
```

---

## Crypt Standards

| Component | Standard / Specification | Purpose |
| :--- | :--- | :--- |
| **Key Derivation** | PBKDF2-HMAC-SHA256 (600,000 iterations) | Resists brute-force & GPU attacks |
| **Symmetric Encryption** | AES-GCM (256-bit key) | Authenticated encryption (confidentiality + integrity) |
| **IV (Nonce)** | 12 bytes | Unique per encryption operation |
| **Auth Tag** | 16 bytes (128 bits) | Detects tampering / ciphertext modification |
