import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useGetClothesQuery(userId) {
	return useQuery({
		queryKey: ["clothes"],
		queryFn: async () => {
			const { data, error } = await supabase.from('clothes').select('*').eq('user_id', userId);
			if (error) throw error;
			return data;
		},
	})
} 

export function useUpdateClothesMutation() {
	return useMutation({
		mutationKey: ["updateClothes"],
		mutationFn: async ({ clothingId, userId, clothes }) => {
			if (!clothingId) {
				throw new Error("Identifiant du vêtement manquant.");
			}
			if (!userId) {
				throw new Error("Identifiant utilisateur manquant.");
			}

			const { data, error } = await supabase
				.from('clothes')
				.update(clothes)
				.eq('id', clothingId)
				.eq('user_id', userId)
				.select('*');
			if (error) throw error;

			const updatedRow = Array.isArray(data) ? data[0] ?? null : data;
			if (!updatedRow) {
				throw new Error("Aucun vêtement mis à jour (id/user_id introuvable ou accès refusé).");
			}
			return updatedRow;
		},
	})
}

export function useCreateClothesMutation() {
	return useMutation({
		mutationKey: ["createClothes"],
		mutationFn: async ({ userId, clothes }) => {
			if (!userId) {
				throw new Error("Identifiant utilisateur manquant.");
			}

			const payload = {
				...clothes,
				user_id: userId,
			};

			const { data, error } = await supabase
				.from("clothes")
				.insert([payload])
				.select("*");
			if (error) throw error;

			const createdRow = Array.isArray(data) ? data[0] ?? null : data;
			if (!createdRow) {
				throw new Error("Aucun vêtement créé.");
			}
			return createdRow;
		},
	})
}

export function useDeleteClothesMutation() {
	return useMutation({
		mutationKey: ["deleteClothes"],
		mutationFn: async ({ clothingId, userId }) => {
			if (!clothingId) {
				throw new Error("Identifiant du vêtement manquant.");
			}
			if (!userId) {
				throw new Error("Identifiant utilisateur manquant.");
			}

			const { data, error } = await supabase
				.from("clothes")
				.delete()
				.eq("id", clothingId)
				.eq("user_id", userId)
				.select("*");
			if (error) throw error;

			const deletedRow = Array.isArray(data) ? data[0] ?? null : data;
			if (!deletedRow) {
				throw new Error("Aucun vêtement supprimé (id/user_id introuvable ou accès refusé).");
			}
			return deletedRow;
		},
	})
}