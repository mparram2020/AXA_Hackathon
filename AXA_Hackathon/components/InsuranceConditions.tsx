import { useState } from 'react';
import { InsuranceLocation } from './InsuranceLocation'; // Importa el componente
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function InsuranceConditions({ onComplete, isLoading }) {
  const [formData, setFormData] = useState({
    weeklyHours: '',
    primaryUsage: '',
    terrainType: '',
    extremeConditions: '',
  });

  const [errors, setErrors] = useState({});
  const [showLocation, setShowLocation] = useState(false); // Estado para manejar la navegación

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.weeklyHours) newErrors.weeklyHours = 'Please enter weekly hours';
    if (!formData.primaryUsage) newErrors.primaryUsage = 'Please describe the primary usage';
    if (!formData.terrainType) newErrors.terrainType = 'Please specify the terrain type';
    if (!formData.extremeConditions) newErrors.extremeConditions = 'Please answer if the tractor operates in extreme conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowLocation(true); // Cambia a mostrar el siguiente formulario
    }
  };

  if (showLocation) {
    return <InsuranceLocation onComplete={(data) => console.log(data)} isLoading={isLoading} />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>¿Cuántas horas a la semana usas tu tractor?</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.weeklyHours}
          onChangeText={(value) => handleChange('weeklyHours', value)}
          placeholder="Ejemplo: 40"
          keyboardType="numeric"
        />
        {errors.weeklyHours && <ThemedText style={styles.errorText}>{errors.weeklyHours}</ThemedText>}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>¿Para qué trabajos lo usas principalmente?</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.primaryUsage}
          onChangeText={(value) => handleChange('primaryUsage', value)}
          placeholder="Ejemplo: Agricultura"
        />
        {errors.primaryUsage && <ThemedText style={styles.errorText}>{errors.primaryUsage}</ThemedText>}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>¿En qué tipo de terreno trabajas?</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.terrainType}
          onChangeText={(value) => handleChange('terrainType', value)}
          placeholder="Ejemplo: Montañoso"
        />
        {errors.terrainType && <ThemedText style={styles.errorText}>{errors.terrainType}</ThemedText>}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>¿Tu tractor opera en condiciones extremas?</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.extremeConditions}
          onChangeText={(value) => handleChange('extremeConditions', value)}
          placeholder="Ejemplo: Sí o No"
        />
        {errors.extremeConditions && <ThemedText style={styles.errorText}>{errors.extremeConditions}</ThemedText>}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <ThemedText style={styles.submitButtonText}>
          {isLoading ? 'Guardando...' : 'Continuar'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#FF1721',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#103184', // AXA blue
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});