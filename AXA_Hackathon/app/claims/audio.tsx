import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors, Fonts } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function AudioScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState(false);
  const { photo, imageAnalysis } = useLocalSearchParams(); // Retrieve photo and imageAnalysis

  const handleStartRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso requerido', 'Se requiere acceso al micrófono para grabar audio.');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación.');
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        setLoading(true);
        await processAudio(uri);
      }
    } catch (error) {
      console.error('Error al detener la grabación:', error);
      Alert.alert('Error', 'No se pudo detener la grabación.');
    }
  };

  const processAudio = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      });

      const response = await axios.post('http://100.68.130.224:8001/analyze_report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const transcription = response.data.message || 'No se pudo transcribir el audio.';
      const combinedDescription = `${imageAnalysis}\n\n${transcription}`;

      // Send combined description to analyze_vehicle_condition
      const conditionResponse = await axios.post(
        'http://100.68.130.224:8001/analyze_vehicle_condition',
        { description: combinedDescription },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      //console.log('Vehicle Condition Analysis:', conditionResponse.data);

      router.push({
        pathname: '/claims/report-summary',
        params: {
          photo,
          transcription: "",
          coverageAnalysis: JSON.stringify(conditionResponse.data.coverage_analysis.coverage_analysis),
        },
      });

    } catch (error) {
      console.error('Error al procesar el audio:', error);
      Alert.alert('Error', 'Hubo un problema al procesar el reporte. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Describe el accidente</ThemedText>
      <ThemedText style={styles.subtitle}>
        Mantén presionado el botón para describir lo que ha pasado.
      </ThemedText>

      <TouchableOpacity
        style={[styles.microphoneButton, isRecording && styles.recording]}
        onPressIn={handleStartRecording}
        onPressOut={handleStopRecording}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.white} />
        ) : (
          <IconSymbol name="mic.fill" size={40} color={Colors.white} />
        )}
      </TouchableOpacity>
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
  microphoneButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: Colors.danger,
  },
});