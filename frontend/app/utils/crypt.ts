import { uint8ArrayToBase64 } from "./unit8Array&Base64Conversion"

type masterKeyGenType = {
    masterPassword: string
    email: string
}

export async function masterKeyGen(masterKeyGenRequest: masterKeyGenType): Promise<Uint8Array<ArrayBuffer>> {
    const { masterPassword, email } = masterKeyGenRequest
    const encoder = new TextEncoder()
    const binaryMasterPassword = encoder.encode(masterPassword)
    const binaryEmail = encoder.encode(email)

    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        binaryMasterPassword,
        "PBKDF2",
        false,
        ["deriveBits"]
    )

    const masterKey = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            hash: "SHA-256",
            iterations: 600_000,
            salt: binaryEmail
        },
        baseKey,
        256
    )

    return new Uint8Array(masterKey);

}

type Creds = {
    login: string
    password: string
    website: string
    description: string
}

type EncryptedCreds = {
    iv: string,
    ciphertext: string
}


export async function encryptCreds(masterKey: Uint8Array<ArrayBuffer>, cred: Creds): Promise<EncryptedCreds> {

    const jsonCredsString = JSON.stringify(cred);

    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        masterKey,
        "AES-GCM",
        false,
        ["encrypt"]
    )

    const encryptedCreds = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        baseKey,
        new TextEncoder().encode(jsonCredsString)
    )



    return {
        iv: uint8ArrayToBase64(iv),
        ciphertext: uint8ArrayToBase64(new Uint8Array(encryptedCreds))
    }



}