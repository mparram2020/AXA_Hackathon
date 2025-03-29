import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { InsuranceOffer } from '@/components/InsuranceOffer';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router'; // Import router
import { Colors, Fonts } from '@/constants/theme';

export default function OfferScreen() {
  const { data, resetData } = useInsurance();

  const handlePurchase = () => {
    Alert.alert('Success', 'Your insurance plan has been purchased!');
    resetData();
    router.push('/'); // Redirect to home
  };

  return (
    <View style={styles.container}>
      <InsuranceOffer
        offer={{
          vehicleType: data.vehicleDetails?.model || 'Unknown',
          riskLevel: 'Low',
          monthlyPrice: 49.99,
          coverage: 'Full coverage for accidents, theft, and natural disasters.',
          recommendation: 'This plan is ideal for your usage and location.',
          plan: 'Premium',
        }}
        onStartOver={() => {
          resetData();
          router.push('/insurance/step1'); // Use router.push
        }}
      />
      <Button title="Purchase Plan" onPress={handlePurchase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  offerCard: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  offerTitle: {
    ...Fonts.title,
    marginBottom: 8,
  },
  offerDetails: {
    ...Fonts.body,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    ...Fonts.button,
  },
});