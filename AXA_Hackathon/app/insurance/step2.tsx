import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useInsurance } from '@/context/InsuranceContext';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

export default function Step2() {
  const { data, setData } = useInsurance();

  // Local state for editable fields
  const [model, setModel] = useState(data.vehicleDetails?.model || '');
  const [condition, setCondition] = useState(data.vehicleDetails?.condition || '');
  const [color, setColor] = useState(data.vehicleDetails?.color || '');
  const [year, setYear] = useState(data.vehicleDetails?.year || '');
  const [additionalDescription, setAdditionalDescription] = useState(
    data.vehicleDetails?.additionalDescription || ''
  );

  const saveChanges = () => {
    if (!model || !condition || !color || !year || !additionalDescription) {
      Alert.alert('Error', 'Todos los campos deben estar completos.');
      return;
    }

    // Update the context with the edited details
    setData({
      ...data,
      vehicleDetails: {
        model,
        condition,
        color,
        year,
        additionalDescription,
      },
    });

    Alert.alert('Éxito', 'Los detalles del vehículo han sido actualizados.');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Confirma o edita los detalles del vehículo</ThemedText>
      <ThemedText style={styles.subtitle}>
        Verifica que los detalles sean correctos o edítalos si es necesario.
      </ThemedText>

      <View style={styles.card}>
        <Image source={{ uri: data.photo }} style={styles.photo} />
        <View style={styles.detailsContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Modelo:</ThemedText>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="Ingresa el modelo"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Condición:</ThemedText>
            <TextInput
              style={styles.input}
              value={condition}
              onChangeText={setCondition}
              placeholder="Ingresa la condición"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Color:</ThemedText>
            <TextInput
              style={styles.input}
              value={color}
              onChangeText={setColor}
              placeholder="Ingresa el color"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Año:</ThemedText>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Ingresa el año"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Descripción adicional:</ThemedText>
            <TextInput
              style={styles.input}
              value={additionalDescription}
              onChangeText={setAdditionalDescription}
              placeholder="Ingresa una descripción adicional"
              placeholderTextColor={Colors.textSecondary}
              multiline
            />
          </View>
        </View>
      </View>

      <Button
        title="Guardar Cambios"
        onPress={saveChanges}
        type="primary"
        style={styles.button}
      />
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    ...Fonts.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
});