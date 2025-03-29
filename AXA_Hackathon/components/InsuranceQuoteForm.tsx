import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const VEHICLE_TYPES = [
  { label: 'Select type...', value: '' },
  { label: 'Tractor', value: 'tractor' },
  { label: 'Harvester', value: 'harvester' },
  { label: 'Sprayer', value: 'sprayer' },
  { label: 'Loader', value: 'loader' },
  { label: 'Transport Truck', value: 'truck' },
  { label: 'Other', value: 'other' },
];

const USAGE_TYPES = [
  { label: 'Select usage...', value: '' },
  { label: 'Daily (Heavy Use)', value: 'daily' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Occasional', value: 'occasional' },
];

export function InsuranceQuoteForm({ onComplete, isLoading }) {
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleAge: '',
    vehicleValue: '',
    usage: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when field is updated
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
    if (!formData.vehicleValue) newErrors.vehicleValue = 'Please enter vehicle value';
    if (!formData.usage) newErrors.usage = 'Please select usage pattern';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Vehicle Type</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.vehicleType}
            onValueChange={(value) => handleChange('vehicleType', value)}
            style={styles.picker}
          >
            {VEHICLE_TYPES.map(type => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
        {errors.vehicleType && <ThemedText style={styles.errorText}>{errors.vehicleType}</ThemedText>}
      </ThemedView>
      
      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Vehicle Age (years)</ThemedText>
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
        <ThemedText style={styles.label}>Vehicle Value (€)</ThemedText>
        <TextInput
          style={styles.input}
          value={formData.vehicleValue}
          onChangeText={(text) => handleChange('vehicleValue', text)}
          placeholder="e.g., 50000"
          keyboardType="numeric"
        />
        {errors.vehicleValue && <ThemedText style={styles.errorText}>{errors.vehicleValue}</ThemedText>}
      </ThemedView>
      
      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Usage Pattern</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.usage}
            onValueChange={(value) => handleChange('usage', value)}
            style={styles.picker}
          >
            {USAGE_TYPES.map(type => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
        {errors.usage && <ThemedText style={styles.errorText}>{errors.usage}</ThemedText>}
      </ThemedView>
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <ThemedText style={styles.submitButtonText}>
          {isLoading ? 'Analyzing Risk...' : 'Get My Quote'}
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