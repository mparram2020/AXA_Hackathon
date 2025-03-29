import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { InsuranceConditions } from './InsuranceConditions'; // Importa el componente

const VEHICLE_TYPES = [
  { label: 'Selecciona el tipo...', value: '' },
  { label: 'Tractor agrícola estándar', value: 'estandar' },
  { label: 'Tractor viñero o frutero', value: 'frutero' },
  { label: 'Sprayer', value: 'sprayer' },
  { label: 'Other', value: 'other' },
];

export function InsuranceQuoteForm({ isLoading }) {
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleAge: '',
    vehicleModel: '',
  });

  const [errors, setErrors] = useState({});
  const [showConditions, setShowConditions] = useState(false); // Estado para manejar la navegación

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

    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
    if (!formData.vehicleAge) newErrors.vehicleAge = 'Please enter vehicle age';
    if (!formData.vehicleModel) newErrors.vehicleModel = 'Please enter vehicle value';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConditions(true);
    }
  };

  if (showConditions) {
    return <InsuranceConditions onComplete={(data) => console.log(data)} isLoading={isLoading} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Tipo de tractor</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.vehicleType}
            onValueChange={(value) => handleChange('vehicleType', value)}
            style={styles.picker}
          >
            {VEHICLE_TYPES.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
        {errors.vehicleType && <ThemedText style={styles.errorText}>{errors.vehicleType}</ThemedText>}
      </ThemedView>

      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Edad del tractor (años)</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.vehicleAge}
          onChangeText={(text) => handleChange('vehicleAge', text)}
          placeholder="e.g., 5"
          keyboardType="numeric"
        />
        {errors.vehicleAge && <ThemedText style={styles.errorText}>{errors.vehicleAge}</ThemedText>}
      </ThemedView>

      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Marca</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.vehicleModel}
          onChangeText={(text) => handleChange('vehicleModel', text)}
          placeholder="e.g., John Deere"
        />
        {errors.vehicleModel && <ThemedText style={styles.errorText}>{errors.vehicleModel}</ThemedText>}
      </ThemedView>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <ThemedText style={styles.submitButtonText}>
          {isLoading ? 'Analizando datos...' : 'Continuar'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  picker: {
    height: 50,
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