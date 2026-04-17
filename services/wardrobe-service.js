import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase-client";

export function useGetClothesQuery() {
	return useQuery({
		queryKey: ["clothes"],
		queryFn: async () => {
			const { data, error } = await supabase.from('clothes').select('*');
			if (error) throw error;
			return data;
		},
	})
} 