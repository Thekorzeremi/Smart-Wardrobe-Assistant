import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { fetchSuggestion } from '../services/ai_n8n_service';
import { fetchWeather } from '../services/weatherService';

export function useSuggestion(filters = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['suggestion', user?.id, filters],
    queryFn: async () => {
      if (!user) return null;
      const weather = await fetchWeather();
      const rawResponse = await fetchSuggestion(user.id, weather, filters);
      const suggestion = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;
      return suggestion;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60 * 12,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  // Refresh 
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['suggestion', user?.id, filters] });
  };

  return { ...query, refresh };
}