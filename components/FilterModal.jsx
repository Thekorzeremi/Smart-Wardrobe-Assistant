import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import { useState } from 'react';

const OCCASIONS = [
  { id: 'casual', label: 'Casual' },
  { id: 'work', label: 'Travail' },
  { id: 'dinner', label: 'Dîner' },
  { id: 'party', label: 'Fête' },
  { id: 'interview', label: 'Entretien' },
  { id: 'sport', label: 'Sport' },
];

const STYLES = [
  { id: 'elegant', label: 'Élégant' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'minimalist', label: 'Minimaliste' },
  { id: 'bohemian', label: 'Bohème' },
  { id: 'preppy', label: 'Preppy' },
];

export const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
  const [selectedOccasion, setSelectedOccasion] = useState(initialFilters.occasion || null);
  const [selectedStyle, setSelectedStyle] = useState(initialFilters.style || null);

  const handleApply = () => {
    const filters = {};
    if (selectedOccasion) filters.occasion = selectedOccasion;
    if (selectedStyle) filters.style = selectedStyle;
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedOccasion(null);
    setSelectedStyle(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filtrer la suggestion</Text>

          <Text style={styles.sectionTitle}>Occasion</Text>
          <View style={styles.chipContainer}>
            {OCCASIONS.map(occ => (
              <TouchableOpacity
                key={occ.id}
                style={[styles.chip, selectedOccasion === occ.id && styles.chipSelected]}
                onPress={() => setSelectedOccasion(occ.id)}
              >
                <Text style={[styles.chipText, selectedOccasion === occ.id && styles.chipTextSelected]}>
                  {occ.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Style</Text>
          <View style={styles.chipContainer}>
            {STYLES.map(style => (
              <TouchableOpacity
                key={style.id}
                style={[styles.chip, selectedStyle === style.id && styles.chipSelected]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <Text style={[styles.chipText, selectedStyle === style.id && styles.chipTextSelected]}>
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'rgba(20,20,30,0.95)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 12,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  chipTextSelected: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  resetText: {
    color: '#ddd',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#aaa',
    fontSize: 14,
  },
});