import { Alert } from "react-native";
import { supabase } from "../services/supabase";

export function useDeleteAccount() {
  const deleteAccount = async () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Supprimer le compte",
        "Cette action est irréversible. Toutes tes données seront supprimées.",
        [
          { text: "Annuler", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                const {
                  data: { session },
                } = await supabase.auth.getSession();

                const response = await fetch(
                  `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${session.access_token}`,
                      "Content-Type": "application/json",
                    },
                  },
                );

                const result = await response.json();

                if (!response.ok) {
                  Alert.alert("Erreur", result.error);
                  resolve(false);
                  return;
                }

                await supabase.auth.signOut();
                resolve(true);
              } catch (error) {
                console.log("Erreur complète:", error);
                Alert.alert("Erreur", "Une erreur est survenue.");
                resolve(false);
              }
            },
          },
        ],
      );
    });
  };

  return { deleteAccount };
}
