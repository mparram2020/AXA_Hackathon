import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

export default function Step2() {
  const { data, setData } = useInsurance();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Confirm Vehicle Details</ThemedText>
      <Image source={{ uri: data.photo }} style={styles.photo} />
      <ThemedText style={styles.details}>
        Model: {data.vehicleDetails?.model}
      </ThemedText>
      <ThemedText style={styles.details}>
        Year: {data.vehicleDetails?.year}
      </ThemedText>
      <ThemedText style={styles.details}>
        Manufacturer: {data.vehicleDetails?.manufacturer}
      </ThemedText>
      <Button
        title="Confirm"
        onPress={() => router.push('/insurance/step3')} // Correct usage
        type="primary"
      />
      <Button
        title="Retake Photo"
        onPress={() => router.push('/insurance/step1')} // Correct usage
        type="secondary"
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
    detailsCard: {
      width: '100%',
      padding: 16,
      backgroundColor: Colors.white,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 16,
    },
    detailsText: {
      ...Fonts.body,
      marginBottom: 8,
    },
  });