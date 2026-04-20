import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchSuggestion } from '../services/ai_n8n_service';
import { fetchWeather } from '../services/weatherService';
import { supabase } from '../services/supabase';

export const getDayKey = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const referenceDate = new Date(now);
  if (currentHour < 5) {
    referenceDate.setDate(referenceDate.getDate() - 1);
  }
  return referenceDate.toISOString().slice(0, 10);
};


export function useSuggestion(filters = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isManualRefresh = useRef(false);

  const query = useQuery({
    queryKey: ['suggestion', user?.id, filters],
    queryFn: async () => {
      if (!user) return null;
      const today = getDayKey();
      if (!isManualRefresh.current) {
        const { data: existing } = await supabase
          .from('daily_suggestions')
          .select('*')
          .eq('user_id', user.id)
          .eq('suggestion_date', today)
          .eq('filters_occasion', filters.occasion || '')
          .eq('filters_style', filters.style || '')
          .maybeSingle();

        if (existing) {
          const itemIds = existing.selected_items_ids || [];
          let fullClothes = [];
          if (itemIds.length > 0) {
            const { data: clothesData } = await supabase
              .from('clothes')
              .select('*')
              .in('id', itemIds);
            fullClothes = clothesData || [];
          }
          
          return {
            explanation: existing.explanation,
            clothes: fullClothes,
            comfort_score: existing.comfort_score,
            filters_occasion: existing.filters_occasion,
            filters_style: existing.filters_style,
            from_db: true
          };
        }
      }
      isManualRefresh.current = false;

      const weather = await fetchWeather();
      const rawResponse = await fetchSuggestion(user.id, weather, filters);
      const suggestion = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;

      if (suggestion) {
        await supabase.from('daily_suggestions').upsert({
          user_id: user.id,
          suggestion_date: today,
          explanation: suggestion.explanation,
          selected_items_ids: suggestion.clothes?.map(c => c.id) || [],
          comfort_score: suggestion.comfort_score,
          filters_occasion: Array.isArray(filters.occasion) ? filters.occasion.join(",") : (filters.occasion || ""),
          filters_style: Array.isArray(filters.style) ? filters.style.join(",") : (filters.style || ""),
        });
      }
      return suggestion;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    retry: 1,
  });

  // Refresh 
  const refresh = (force = false) => {
    if (force) isManualRefresh.current = true;
    queryClient.invalidateQueries({ queryKey: ['suggestion', user?.id, filters] });
  };

  return { ...query, refresh };
}