import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to AXA Agro</ThemedText>
      <ThemedText style={styles.subtitle}>
        What would you like to do today?
      </ThemedText>

      <View style={styles.optionsContainer}>
        {/* File a Claim Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/claims/selection')}
        >
          <IconSymbol name="doc.text.fill" size={40} color="#1F448C" />
          <ThemedText style={styles.optionTitle}>File a Claim</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Report an incident and file a claim for your agricultural equipment or vehicle.
          </ThemedText>
        </TouchableOpacity>

        {/* Create Insurance Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/insurance/step1')} // Correct route
        >
          <IconSymbol name="shield.checkerboard" size={40} color="#4CAF50" />
          <ThemedText style={styles.optionTitle}>Create Insurance</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Get a personalized insurance quote for your agricultural equipment or vehicle.
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
    color: '#103184', // AXA blue
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