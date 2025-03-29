import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'; // Import router
import { Colors, Fonts } from '@/constants/theme';

export default function Step1() {
  const { setData } = useInsurance();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const analyzePhoto = async () => {
    setLoading(true);
    // Mock AI response
    setTimeout(() => {
      setData({
        photo,
        vehicleDetails: {
          model: 'John Deere 5075E',
          year: '2020',
          manufacturer: 'John Deere',
        },
      });
      setLoading(false);
      router.push('/insurance/step2'); // Use router.push
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Take a Photo of Your Vehicle</ThemedText>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <TouchableOpacity style={styles.photoPlaceholder} onPress={takePhoto}>
          <ThemedText>Tap to Take a Photo</ThemedText>
        </TouchableOpacity>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#1F448C" />
      ) : (
        photo && (
          <Button title="Analyze Photo" onPress={analyzePhoto} type="primary" />
        )
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
    title: {
      ...Fonts.title,
      marginBottom: 16,
      textAlign: 'center',
    },
    photo: {
      width: 200,
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    photoPlaceholder: {
      width: 200,
      height: 200,
      borderRadius: 12,
      backgroundColor: Colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
  });