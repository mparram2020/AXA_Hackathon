import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import axios from 'axios';

export default function PhotoScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se requiere acceso a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!photo) {
      Alert.alert('Error', 'Debes tomar una foto antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photo,
        name: 'accident.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://100.68.130.224:8001/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageAnalysis = response.data.image_analysis || 'No se pudo analizar la imagen.';
      router.push({
        pathname: '/claims/audio',
        params: { photo, imageAnalysis }, // Pass photo and analysis to the next screen
      });
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la imagen. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Toma una foto del accidente</ThemedText>
      <ThemedText style={styles.subtitle}>
        Captura una foto clara del accidente para incluirla en el reporte.
      </ThemedText>

      <View style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <ThemedText style={styles.placeholder}>No se ha tomado ninguna foto.</ThemedText>
        )}
      </View>

      <Button title="Tomar Foto" onPress={takePhoto} type="primary" style={styles.button} />
      <Button title="Siguiente" onPress={handleNext} type="primary" style={styles.button} disabled={loading} />
    </ThemedView>
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
  photoContainer: {
    width: 300,
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholder: {
    ...Fonts.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
});