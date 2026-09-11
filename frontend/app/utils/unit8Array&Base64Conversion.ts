export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let b64 = ''
    for (let i = 0; i < uint8Array.length; i++) {
        b64 += String.fromCharCode(uint8Array[i])           
    }
    return btoa(b64)
}

export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
}