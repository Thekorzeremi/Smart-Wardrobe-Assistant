import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { elements } from "../theme";
import { useRefreshOnFocus } from "../hooks/use-refresh-on-focus";
import { useDeleteClothesMutation, useGetClothesQuery } from "../services/wardrobe-service";
import { useEffect, useRef, useState } from "react";
import { Pencil, X } from "lucide-react-native";
import { WardrobeEditModalContent } from "../components/WardrobeEditModalContent";
import { WardrobeCreateModalContent } from "../components/WardrobeCreateModalContent";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const Wardrobe = () => {
  useRefreshOnFocus();
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
	const { userData } = useAuth();
  const username = userData?.username || "Utilisateur";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCreatingClothing, setIsCreatingClothing] = useState(false);
  const [isDeletingClothing, setIsDeletingClothing] = useState(false);
  const editTranslateY = useRef(new Animated.Value(42)).current;
  const editOpacity = useRef(new Animated.Value(0)).current;
  const addTranslateY = useRef(new Animated.Value(48)).current;
  const addOpacity = useRef(new Animated.Value(0)).current;
  const isEditAnimatingRef = useRef(false);
  const isAddAnimatingRef = useRef(false);
  const { mutateAsync: deleteClothes } = useDeleteClothesMutation();

  useEffect(() => {
    if (route.params?.openAddModal) {
      openAddModal();
      navigation.setParams({ openAddModal: false });
    }
  }, [navigation, route.params?.openAddModal]);

  const { data, isLoading, error, refetch } = useGetClothesQuery(userData?.id);

  const openClothingModal = (item) => {
    setSelectedClothing(item);
    setIsEditModalOpen(false);
    setIsModalOpen(true);
  };

  const closeClothingModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsSavingEdit(false);
    setIsDeletingClothing(false);
    setSelectedClothing(null);
  };

  const openAddModal = () => {
    if (isAddAnimatingRef.current || isCreatingClothing) {
      return;
    }

    setIsAddModalOpen(true);
    addTranslateY.setValue(48);
    addOpacity.setValue(0);
    isAddAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(addTranslateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(addOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAddAnimatingRef.current = false;
    });
  };

  const animateAddClose = (onFinished) => {
    if (isAddAnimatingRef.current) {
      return;
    }

    isAddAnimatingRef.current = true;
    Animated.parallel([
      Animated.timing(addTranslateY, {
        toValue: 48,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(addOpacity, {
        toValue: 0,
        duration: 170,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAddModalOpen(false);
      isAddAnimatingRef.current = false;
      if (typeof onFinished === "function") {
        onFinished();
      }
    });
  };

  const closeAddModal = () => {
    if (isCreatingClothing) {
      return;
    }

    animateAddClose();
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
    if (isEditAnimatingRef.current || isSavingEdit) {
      return;
    }

    setIsEditModalOpen(true);
    editTranslateY.setValue(68);
    editOpacity.setValue(0);
    isEditAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(editTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(editOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isEditAnimatingRef.current = false;
    });
  };

  const animateEditClose = (onFinished) => {
    if (isEditAnimatingRef.current) {
      return;
    }

    isEditAnimatingRef.current = true;
    Animated.parallel([
      Animated.timing(editTranslateY, {
        toValue: 68,
        duration: 210,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(editOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsEditModalOpen(false);
      isEditAnimatingRef.current = false;
      if (typeof onFinished === "function") {
        onFinished();
      }
    });
  };

  const closeEditModal = () => {
    setIsSavingEdit(false);
    animateEditClose();
  };

  const handleModalDismiss = () => {
    if (isEditModalOpen) {
      closeEditModal();
      return;
    }

    closeClothingModal();
  };

  const saveButtonStyle = {
    backgroundColor: "rgba(10,132,255,0.26)",
    borderColor: "rgba(255,255,255,0.22)",
  };

  const handleDeletePress = () => {
    if (isDeletingClothing) {
      return;
    }

    const selectedId = selectedClothing?.id ?? selectedClothing?._id;
    if (!selectedId) {
      Alert.alert("Supprimer", "Impossible de trouver l'identifiant du vêtement.");
      return;
    }

    Alert.alert(
      "Supprimer ce vêtement ?",
      "Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingClothing(true);
              await deleteClothes({ clothingId: selectedId, userId: userData?.id });
              await queryClient.invalidateQueries({ queryKey: ["clothes"] });
              setIsDeletingClothing(false);
              closeClothingModal();
              Alert.alert("Supprimer", "Vêtement supprimé.");
            } catch (deleteError) {
              setIsDeletingClothing(false);
              Alert.alert(
                "Supprimer",
                deleteError?.message ?? "Une erreur est survenue.",
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleClosePress = () => {
    closeClothingModal();
  };

	console.log("user", username);

  return (
    <SafeAreaView style={elements.wardrobeContainer} edges={["top", "bottom"]}>
      <StatusBar
        style={isModalOpen || isEditModalOpen || isAddModalOpen ? "dark" : "light"}
      />
      <Text style={elements.wardrobeTitle}>Mon Armoire</Text>
      <Text style={elements.homeHeaderHello}>Tu peux consulter ta garde robe ici, {username}</Text>
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
        onRequestClose={handleModalDismiss}
      >
        <View style={elements.wardrobeModalBackdrop}>
          <Pressable
            style={elements.wardrobeModalDismissArea}
            onPress={handleModalDismiss}
          />

          <View style={elements.wardrobeModalContent}>
            <View style={elements.wardrobeModalHeader}>
              <View style={elements.wardrobeModalHeaderTopRow}>
                <Text style={elements.wardrobeModalTitle}>
                  {isEditModalOpen
                    ? "Modifier le vêtement"
                    : (selectedClothing?.name ?? "Détail du vêtement")}
                </Text>

                <View style={elements.wardrobeModalActions}>
                  {!isEditModalOpen ? (
                    <TouchableOpacity
                      style={elements.wardrobeModalIconButton}
                      onPress={handleEditPress}
                      activeOpacity={0.82}
                    >
                      <Pencil size={18} color="#f3f5ff" />
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={elements.wardrobeModalIconButton}
                    onPress={isEditModalOpen ? closeEditModal : handleClosePress}
                    activeOpacity={0.82}
                  >
                    <X size={19} color="#f3f5ff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <ScrollView
              style={elements.wardrobeModalBody}
              contentContainerStyle={elements.wardrobeModalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              {!isEditModalOpen ? (
                <>
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

                  <TouchableOpacity
                    style={[
                      elements.wardrobeModalBottomDeleteButton,
                      elements.wardrobeModalActionDelete,
                    ]}
                    onPress={handleDeletePress}
                    activeOpacity={0.86}
                  >
                    <Text style={elements.wardrobeModalActionText}>Supprimer</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <WardrobeEditModalContent
                  selectedClothing={selectedClothing}
                  userId={userData?.id}
                  editOpacity={editOpacity}
                  editTranslateY={editTranslateY}
                  getImageUri={getImageUri}
                  onSavingStateChange={setIsSavingEdit}
                  onUpdatedClothing={setSelectedClothing}
                  onCloseAfterSave={closeEditModal}
                  saveButtonStyle={saveButtonStyle}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View style={elements.wardrobeModalBackdrop}>
          <Pressable style={elements.wardrobeModalDismissArea} onPress={closeAddModal} />

          <Animated.View
            style={[
              elements.wardrobeModalContent,
              {
                opacity: addOpacity,
                transform: [{ translateY: addTranslateY }],
              },
            ]}
          >
            <WardrobeCreateModalContent
              isVisible={isAddModalOpen}
              userId={userData?.id}
              onCreatingStateChange={setIsCreatingClothing}
              saveButtonStyle={saveButtonStyle}
              onClose={closeAddModal}
            />
          </Animated.View>
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
