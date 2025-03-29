import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vehicle } from '@/types/claims';
import { useClaimStore } from '@/stores/claimStore';

export function VehicleSelector() {
  const { draftClaim, addVehicleToDraft, removeVehicleFromDraft } = useClaimStore();
  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({
    id: '',
    make: '',
    model: '',
    identifier: '',
    type: 'tractor',
  });
  
  const vehicleTypes = [
    { label: 'Tractor', value: 'tractor' },
    { label: 'Harvester', value: 'harvester' },
    { label: 'Plow', value: 'plow' },
    { label: 'Sprayer', value: 'sprayer' },
    { label: 'Other Equipment', value: 'other' },
  ];

  const handleAddVehicle = () => {
    if (vehicle.make && vehicle.model && vehicle.identifier) {
      addVehicleToDraft({
        ...vehicle,
        id: Date.now().toString(), // Generate a unique ID
      } as Vehicle);
      
      // Reset form
      setVehicle({
        id: '',
        make: '',
        model: '',
        identifier: '',
        type: 'tractor',
      });
    }
  };

  const handleRemoveVehicle = (id: string) => {
    removeVehicleFromDraft(id);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Add details about the agricultural vehicles or equipment involved in the incident:
      </ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <View style={styles.inputRow}>
          <ThemedView style={styles.inputWrapper}>
            <ThemedText style={styles.label}>Type</ThemedText>
            <View style={styles.pickerContainer}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    vehicle.type === type.value && styles.selectedTypeButton
                  ]}
                  onPress={() => setVehicle({ ...vehicle, type: type.value })}
                >
                  <ThemedText 
                    style={[
                      styles.typeButtonText,
                      vehicle.type === type.value && styles.selectedTypeButtonText
                    ]}
                  >
                    {type.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </View>

        <View style={styles.inputRow}>
          <ThemedView style={styles.inputWrapper}>
            <ThemedText style={styles.label}>Make</ThemedText>
            <TextInput
              style={styles.input}
              value={vehicle.make}
              onChangeText={(text) => setVehicle({ ...vehicle, make: text })}
              placeholder="e.g. John Deere"
            />
          </ThemedView>
          
          <ThemedView style={styles.inputWrapper}>
            <ThemedText style={styles.label}>Model</ThemedText>
            <TextInput
              style={styles.input}
              value={vehicle.model}
              onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
              placeholder="e.g. 5075E"
            />
          </ThemedView>
        </View>
        
        <ThemedView style={styles.inputWrapper}>
          <ThemedText style={styles.label}>License Plate/Serial Number</ThemedText>
          <TextInput
            style={styles.input}
            value={vehicle.identifier}
            onChangeText={(text) => setVehicle({ ...vehicle, identifier: text })}
            placeholder="Enter license plate or serial number"
          />
        </ThemedView>
        
        <Button
          title="Add Vehicle"
          onPress={handleAddVehicle}
          type="primary"
          disabled={!vehicle.make || !vehicle.model || !vehicle.identifier}
          style={styles.addButton}
        />
      </ThemedView>
      
      <ThemedText style={styles.vehiclesListTitle}>
        Added Vehicles ({draftClaim?.vehicles?.length || 0})
      </ThemedText>
      
      {(!draftClaim?.vehicles || draftClaim.vehicles.length === 0) ? (
        <ThemedText style={styles.noVehiclesText}>
          No vehicles added yet
        </ThemedText>
      ) : (
        <FlatList
          data={draftClaim.vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.vehicleCard}>
              <View style={styles.vehicleInfo}>
                <ThemedText style={styles.vehicleType}>
                  {vehicleTypes.find(t => t.value === item.type)?.label || 'Other'}
                </ThemedText>
                <ThemedText style={styles.vehicleDetails}>
                  {item.make} {item.model}
                </ThemedText>
                <ThemedText style={styles.vehicleIdentifier}>
                  ID: {item.identifier}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveVehicle(item.id)}
                style={styles.removeButton}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color="#E53935" />
              </TouchableOpacity>
            </ThemedView>
          )}
          style={styles.vehiclesList}
          contentContainerStyle={{ gap: 8 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666666',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedTypeButton: {
    backgroundColor: '#1F448C',
    borderColor: '#1F448C',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  addButton: {
    marginTop: 12,
  },
  vehiclesListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noVehiclesText: {
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  vehiclesList: {
    maxHeight: 300,
  },
  vehicleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 16,
    fontWeight: '500',
  },
  vehicleIdentifier: {
    fontSize: 14,
    color: '#1F448C',
  },
  removeButton: {
    padding: 4,
  },
});