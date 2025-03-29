import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router'; // Importar router
import { Colors, Fonts } from '@/constants/theme';

export default function Step3() {
  const { setData } = useInsurance();

  const selectUsage = (usage: string) => {
    setData({ usage });
    router.push('/insurance/step4'); // Navegar a la siguiente pantalla
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>¿Con qué frecuencia usas el vehículo?</ThemedText>
      <TouchableOpacity style={styles.option} onPress={() => selectUsage('Diario')}>
        <ThemedText style={styles.optionText}>Diario</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => selectUsage('Semanal')}>
        <ThemedText style={styles.optionText}>Semanal</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => selectUsage('Mensual')}>
        <ThemedText style={styles.optionText}>Mensual</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  title: {
    ...Fonts.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    ...Fonts.body,
    fontWeight: '600',
    color: Colors.primary, // Azul de AXA
  },
});