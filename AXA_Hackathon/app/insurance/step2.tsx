import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

export default function Step2() {
  const { data } = useInsurance();

  // Log the data from the context
  console.log('Context data:', data);

  // Ensure vehicleDetails exists
  const vehicleDetails = data?.vehicleDetails || {};

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Confirma los detalles del vehículo</ThemedText>
      <ThemedText style={styles.subtitle}>
        Verifica que los detalles sean correctos o toma otra foto si es necesario.
      </ThemedText>

      <View style={styles.card}>
        <Image source={{ uri: data.photo }} style={styles.photo} />
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.detailsText}>
            <ThemedText style={styles.label}>Modelo: </ThemedText>
            {vehicleDetails.model || 'Desconocido'}
          </ThemedText>
          <ThemedText style={styles.detailsText}>
            <ThemedText style={styles.label}>Condición: </ThemedText>
            {vehicleDetails.condition || 'Desconocido'}
          </ThemedText>
          <ThemedText style={styles.detailsText}>
            <ThemedText style={styles.label}>Color: </ThemedText>
            {vehicleDetails.color || 'Desconocido'}
          </ThemedText>
          <ThemedText style={styles.detailsText}>
            <ThemedText style={styles.label}>Año: </ThemedText>
            {vehicleDetails.year || 'Desconocido'}
          </ThemedText>
          <ThemedText style={styles.detailsText}>
            <ThemedText style={styles.label}>Descripción adicional: </ThemedText>
            {vehicleDetails.additionalDescription || 'No disponible'}
          </ThemedText>
        </View>
      </View>

      <Button
        title="Confirmar"
        onPress={() => router.push('/insurance/step3')}
        type="primary"
        style={styles.button}
      />
      <Button
        title="Tomar otra foto"
        onPress={() => router.push('/insurance/step1')}
        type="secondary"
        style={styles.button}
      />
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
    marginBottom: 16,
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  detailsText: {
    ...Fonts.body,
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
});