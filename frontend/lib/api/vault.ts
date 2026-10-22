import apiClient from "./client";
import { VaultItemBulkResponse, VaultItemRequest } from "./types";


export async function addVaultItem(payload:VaultItemRequest):Promise<void>{
    await apiClient.post<void>(
        "/api/vault",
        payload
    )
}

export async function getAllVaultItems():Promise<VaultItemBulkResponse>{
    const response = await apiClient.get<VaultItemBulkResponse>(
        "/api/vault",
    )
    return response.data

}

export async function deleteVaultItem(id:string):Promise<void>{
    await apiClient.delete<void>(
        `/api/vault/${id}`
    )
}

export async function updateVaultItem(payload:VaultItemRequest,id:string):Promise<void>{
    await apiClient.put<VaultItemRequest>(
        `/api/vault/${id}`,
        payload
    )
}

