import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors, Fonts } from '@/constants/theme';
import { router } from 'expo-router';

export default function OfferScreen() {
  const { data, resetData } = useInsurance();

  const handlePurchase = () => {
    Alert.alert('¡Éxito!', '¡Tu plan de seguro ha sido adquirido!');
    resetData();
    router.push('/'); // Redirect to home
  };

  const handleStartOver = () => {
    resetData();
    router.push('/insurance/step1'); // Restart the flow
  };

  return (
    <View style={styles.container}>
      <View style={styles.offerCard}>
        <ThemedText style={styles.planTitle}>{data.vehicleDetails?.model || 'Modelo desconocido'}</ThemedText>
        <ThemedText style={styles.planSubtitle}>Plan: Premium</ThemedText>
        <ThemedText style={styles.price}>$49.99/mes</ThemedText>

        <View style={styles.divider} />

        <ThemedText style={styles.detailsTitle}>Cobertura:</ThemedText>
        <ThemedText style={styles.detailsText}>
          Cobertura completa para accidentes, robo y desastres naturales.
        </ThemedText>

        <ThemedText style={styles.detailsTitle}>Recomendación:</ThemedText>
        <ThemedText style={styles.detailsText}>
          Este plan es ideal para tu uso y ubicación.
        </ThemedText>
      </View>

      <Button
        title="Adquirir Plan"
        onPress={handlePurchase}
        type="primary"
        style={styles.purchaseButton}
      />
      <Button
        title="Volver a empezar"
        onPress={handleStartOver}
        type="secondary"
        style={styles.startOverButton}
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
  offerCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  planTitle: {
    ...Fonts.title,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.primary,
  },
  planSubtitle: {
    ...Fonts.body,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  price: {
    ...Fonts.title,
    textAlign: 'center',
    color: Colors.success, // Green for price
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  detailsTitle: {
    ...Fonts.body,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  detailsText: {
    ...Fonts.body,
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  purchaseButton: {
    width: '100%',
    marginBottom: 16,
  },
  startOverButton: {
    width: '100%',
  },
});