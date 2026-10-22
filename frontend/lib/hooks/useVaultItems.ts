import { addVaultItem, deleteVaultItem, getAllVaultItems, updateVaultItem, VaultItemRequest } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVaultItems = () => {
  return useQuery({
    queryKey: ["vaultItems"],
    queryFn: getAllVaultItems,
  });
};

export const useAddVaultItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVaultItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaultItems"] });
    },
  });
};

export const useDeleteVaultItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVaultItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaultItems"] });
    },
  });
};

export const useUpdateVaultItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { item: VaultItemRequest; id: string }) =>
      updateVaultItem(payload.item, payload.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaultItems"] });
    },
  });
};