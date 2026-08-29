# Threat Model: Zero-Knowledge Password Manager

## 1. System Objective
A client side encrypted password manager where the server handles only storage while having zero knowledge about the encryption method nor the encrypted data.
The user can access all his password across devices while only needing to remember his master password.

## 2. Assets
* **Credentials** : Username, password and URL stored by the user.
* **Vault key** : A symetric key that only gets generated once per user, used to encrypt all the vault data. It gets storred in the db encrypted by the Master key for optimal performance and ease of updating the Master password.
* **Master key** : The main key we derive from the master password and only used to encrypt and the decrypt the vault password.
* **Session token** : A JWT token used for authorization for our stateless backend preparint it to be a distributed system.

## 3. Our threat actors
*   **The Network Eavesdropper:** An attacker intercepting traffic between the client and server. We fight using tls connection and handling the encryption client side while ensuring a fast performance methode.
*   **The Database Hacker:** An external attacker who steals a complete dump of the PostgreSQL database or even the control over it.
*   **The Rogue Admin:** An insider with infrastructure access attempting to read user data directly from the db.
*   **The Session Hijacker:** An attacker who steals a valid session token via Cross-Site Scripting (XSS) or malware.

## 4. Mitigations & Controls

| Threat Actor | Vector | Mitigation / Control |
| :--- | :--- | :--- |
| **Network Eavesdropper** | Intercepting HTTP traffic | **TLS/HTTPS** enforced on all endpoints. |
| **Database Hacker / Rogue Admin** | Reading DB records directly | **AES-256 ENCRYPTION** The server only stores ciphertext, the nounce and Auth tag. The Master Key needed to decrypt the Vault Key never leaves the browser's memory. |
| **Database Hacker / Rogue Admin** | Stealing Master Passwords | **PBKDF2 Key Split.** The Master Password is never sent to the server. The client derives a separate `Login Verifier` for authentication, which the server stores as a BCrypt hash. |
| **Session Hijacker** | Reusing a stolen JWT | **Token Expiration & Idle Timeouts.** JWTs are short lived.

---

> 
    In addition, the Master key gets wiped out each 15 min of inactivity with all the decrypted data and the user gets prompted to reenter his Master password.