import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useGetClothesQuery } from "../services/wardrobe-service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshOnFocus } from "../hooks/use-refresh-on-focus";
import { elements } from "../theme";
import { useState } from "react";

export const Wardrobe = () => {
  useRefreshOnFocus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(null);

  const { data, isLoading, error, refetch } = useGetClothesQuery();

  const openClothingModal = (item) => {
    setSelectedClothing(item);
    setIsModalOpen(true);
  };

  const closeClothingModal = () => {
    setIsModalOpen(false);
    setSelectedClothing(null);
  };

  const getImageUri = (item) => {
    if (!item) {
      return "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif";
    }

    return (
      item.image_url ??
      item.imageUrl ??
      item.photo_url ??
      item.photoUrl ??
      item.image ??
      item.url ??
      "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif"
    );
  };

  const modalInfoEntries = Object.entries(selectedClothing ?? {}).filter(
    ([key]) =>
      ![
        "id",
        "_id",
        "image_url",
        "imageUrl",
        "photo_url",
        "photoUrl",
        "image",
        "url",
        "user_id",
      ].includes(key),
  );

  const handleEditPress = () => {
    Alert.alert("Modifier", "Fonctionnalité de modification à venir.");
  };

  const handleDeletePress = () => {
    Alert.alert("Supprimer", "Fonctionnalité de suppression à venir.");
  };

  const handleClosePress = () => {
    closeClothingModal();
  };

  return (
    <SafeAreaView style={elements.wardrobeContainer} edges={["top", "bottom"]}>
      <StatusBar style={isModalOpen ? "dark" : "light"} />
      <Text style={elements.wardrobeTitle}>Mon Armoire</Text>
      {isLoading ? <ActivityIndicator size="large" color="#f3f5ff" /> : null}
      {error ? (
        <View>
          <Text>Une erreur est survenue</Text>
          <Text>{error.message}</Text>
          <TouchableOpacity onPress={refetch}>
            <Text>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        numColumns={2}
        columnWrapperStyle={elements.wardrobeGridItem}
        data={data}
        keyExtractor={(item) => String(item?.id ?? item?.name ?? Math.random())}
        renderItem={({ item }) => (
          <WardrobeItem item={item} onPress={() => openClothingModal(item)} />
        )}
      />

      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeClothingModal}
      >
        <View style={elements.wardrobeModalBackdrop}>
          <Pressable
            style={elements.wardrobeModalDismissArea}
            onPress={closeClothingModal}
          />

          <View style={elements.wardrobeModalContent}>
            <View style={elements.wardrobeModalHeader}>
              <Text style={elements.wardrobeModalTitle}>
                {selectedClothing?.name ?? "Détail du vêtement"}
              </Text>

              <View style={elements.wardrobeModalActions}>
                <TouchableOpacity
                  style={elements.wardrobeModalActionButton}
                  onPress={handleClosePress}
                >
                  <Text style={elements.wardrobeModalActionText}>Fermer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={elements.wardrobeModalActionButton}
                  onPress={handleEditPress}
                >
                  <Text style={elements.wardrobeModalActionText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    elements.wardrobeModalActionButton,
                    elements.wardrobeModalActionDelete,
                  ]}
                  onPress={handleDeletePress}
                >
                  <Text style={elements.wardrobeModalActionText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={elements.wardrobeModalBody}
              contentContainerStyle={elements.wardrobeModalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <Image
                resizeMode="cover"
                source={{ uri: getImageUri(selectedClothing) }}
                style={elements.wardrobeModalImage}
              />

              <View style={elements.wardrobeModalInfoList}>
                {modalInfoEntries.map(([key, value]) => (
                  <View key={key} style={elements.wardrobeModalInfoRow}>
                    <Text style={elements.wardrobeModalInfoKey}>{key}</Text>
                    <Text style={elements.wardrobeModalInfoValue}>
                      {value == null
                        ? "-"
                        : typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const WardrobeItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={elements.wardrobeItemCard}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {/* <View  /> */}
    <View style={elements.wardrobeImagePlaceholder}>
      <Image
        resizeMode="cover"
        source={{
          uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
        }}
        style={elements.wardrobeItemImage}
      />
    </View>
    <Text style={elements.wardrobeItemTitle}>{item.name}</Text>
  </TouchableOpacity>
);
