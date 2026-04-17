import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "../services/weatherService";

export const useWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 10,
  });
};
