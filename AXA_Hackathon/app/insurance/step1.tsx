import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol'; // Import IconSymbol for the back button
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import axios from 'axios';

export default function Step1() {
  const { setData } = useInsurance();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    router.back(); // Navigate back to the previous screen
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para usar la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const analyzePhoto = async () => {
    if (!photo) {
      Alert.alert('Error', 'Por favor, toma una foto antes de analizarla.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photo,
        name: 'tractor.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://100.68.130.224:8001/process_image_for_insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const insuranceData = response.data.insurance_data || {};
      const { modelo_tractor, condicion, color, año, descripcion_adicional } = insuranceData;

      setData({
        photo,
        vehicleDetails: {
          model: modelo_tractor || 'Desconocido',
          condition: condicion || 'Desconocido',
          color: color || 'Desconocido',
          year: año || 'Desconocido',
          additionalDescription: descripcion_adicional || 'No disponible',
        },
      });

      router.push('/insurance/step2');
    } catch (error) {
      console.error('Error analyzing photo:', error);
      Alert.alert('Error', 'Ocurrió un error al analizar la foto. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>Toma una foto de tu vehículo</ThemedText>
      <ThemedText style={styles.subtitle}>
        Esto nos ayudará a identificar tu vehículo y ofrecerte un plan de seguro personalizado.
      </ThemedText>

      <View style={styles.card}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <TouchableOpacity style={styles.photoPlaceholder} onPress={takePhoto}>
            <ThemedText style={styles.photoPlaceholderText}>Toca para tomar una foto</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
      ) : (
        photo && (
          <Button title="Analizar Foto" onPress={analyzePhoto} type="primary" style={styles.button} />
        )
      )}

      {!photo && (
        <Button title="Tomar Foto" onPress={takePhoto} type="primary" style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  title: {
    ...Fonts.title,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.body,
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.textSecondary,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  photo: {
    width: 300,
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  photoPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    ...Fonts.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loading: {
    marginVertical: 16,
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
});