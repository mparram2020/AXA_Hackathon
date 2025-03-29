import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { LocationSelector } from '@/components/claims/LocationSelector';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router'; // Import router
import { Colors, Fonts } from '@/constants/theme';

export default function Step4() {
  const { setData, data } = useInsurance();

  const handleLocationChange = (location: { latitude?: number; longitude?: number; address?: string }) => {
    setData({ location });
  };

  const handleParkingSelection = (parking: string) => {
    setData({ location: { ...data.location, parking } });
    router.push('/insurance/offer'); // Use router.push
  };

  return (
    <View style={styles.container}>
      <LocationSelector value={data.location || {}} onChange={handleLocationChange} />
      <Button title="Parked in Garage" onPress={() => handleParkingSelection('Garage')} />
      <Button title="Parked in Field" onPress={() => handleParkingSelection('Field')} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Colors.background,
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