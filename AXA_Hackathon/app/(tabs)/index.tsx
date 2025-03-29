import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Bienvenido a AXA Agro</ThemedText>
      <ThemedText style={styles.subtitle}>
        ¿Qué te gustaría hacer hoy?
      </ThemedText>

      <View style={styles.optionsContainer}>
        {/* Opción para Hacer Reporte de Accidente */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/claims/photo')} // Navigate to the photo capture screen
        >
          <IconSymbol name="doc.text.fill" size={40} color="#1F448C" />
          <ThemedText style={styles.optionTitle}>Hacer reporte de accidente</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Reporta un incidente y presenta un reclamo para tu equipo o vehículo agrícola.
          </ThemedText>
        </TouchableOpacity>

        {/* Opción para Adaptar el Seguro */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/insurance/step1')} // Navigate to the insurance flow
        >
          <IconSymbol name="shield.checkerboard" size={40} color="#4CAF50" />
          <ThemedText style={styles.optionTitle}>Adaptar el Seguro</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Obtén una cotización personalizada para tu equipo o vehículo agrícola.
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#103184', // Azul AXA
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F448C',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});