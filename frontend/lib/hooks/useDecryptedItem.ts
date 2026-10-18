import { useState, useEffect } from "react";
import { decryptCreds, Creds } from "@/app/utils/crypt";
import { VaultItemResponse } from "@/lib/api";

export function useDecryptedItem(
  vaultItem: VaultItemResponse | null | undefined,
  masterKey: Uint8Array<ArrayBuffer> | null
) {
  const [creds, setCreds] = useState<Creds | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!vaultItem) {
      setCreds(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!masterKey) {
      setCreds(null);
      setIsLoading(false);
      setError("Vault is locked. Master key is required to decrypt credentials.");
      return;
    }

    async function decrypt() {
      setIsLoading(true);
      setError(null);

      try {
        const decrypted = await decryptCreds(masterKey!, {
          iv: vaultItem!.iv,
          ciphertext: vaultItem!.encryptedData,
        });

        if (!isCancelled) {
          setCreds(decrypted);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Decryption failed:", err);
          setError("Failed to decrypt credentials. The stored data may be corrupted or encrypted with a different key.");
          setCreds(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    decrypt();

    return () => {
      isCancelled = true;
    };
  }, [vaultItem?.id, vaultItem?.iv, vaultItem?.encryptedData, masterKey]);

  return { creds, isLoading, error };
}
