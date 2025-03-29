import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vehicle } from '@/types/claims';
import { useClaimStore } from '@/stores/claimStore';

export function VehicleSelector() {
  const { draftClaim, addVehicleToDraft, removeVehicleFromDraft } = useClaimStore();
  
  // Mock data - in a real app, this would come from an API or context
  const policyVehicles: Vehicle[] = [
    {
      id: 'v1',
      make: 'John Deere',
      model: '5075E',
      identifier: 'JD-5075-8734',
      type: 'tractor',
    },
    {
      id: 'v3',
      make: 'Claas',
      model: 'Lexion 670',
      identifier: 'CL-670-9823',
      type: 'harvester',
    },
    {
      id: 'v4',
      make: 'Kuhn',
      model: 'GMD 310',
      identifier: 'KU-310-4576',
      type: 'plow',
    },
  ];

  // Check if a vehicle is already selected
  const isVehicleSelected = (id: string) => {
    return draftClaim.vehicles.some(v => v.id === id);
  };

  // Toggle selection of a vehicle
  const toggleVehicleSelection = (vehicle: Vehicle) => {
    if (isVehicleSelected(vehicle.id)) {
      removeVehicleFromDraft(vehicle.id);
    } else {
      addVehicleToDraft(vehicle);
    }
  };

  // Get display name for vehicle type
  const getVehicleTypeName = (type: string) => {
    switch (type) {
      case 'tractor': return 'Tractor';
      case 'harvester': return 'Harvester';
      case 'plow': return 'Plow';
      case 'sprayer': return 'Sprayer';
      default: return 'Other Equipment';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Select the insured vehicles or equipment involved in the incident:
      </ThemedText>
      
      <FlatList
        data={policyVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.vehicleCard,
              isVehicleSelected(item.id) && styles.selectedVehicleCard
            ]}
            onPress={() => toggleVehicleSelection(item)}
          >
            <View style={styles.vehicleIconContainer}>
              <IconSymbol 
                name={item.type === 'tractor' ? 'bus' : 
                      item.type === 'harvester' ? 'sunrise' : 
                      item.type === 'plow' ? 'wrench.and.screwdriver' : 'gearshape'} 
                size={24} 
                color={isVehicleSelected(item.id) ? '#FFFFFF' : '#1F448C'} 
              />
            </View>
            
            <View style={styles.vehicleInfo}>
              <ThemedText 
                style={[
                  styles.vehicleType,
                  isVehicleSelected(item.id) && styles.selectedText
                ]}
              >
                {getVehicleTypeName(item.type)}
              </ThemedText>
              <ThemedText 
                style={[
                  styles.vehicleDetails,
                  isVehicleSelected(item.id) && styles.selectedText
                ]}
              >
                {item.make} {item.model}
              </ThemedText>
              <ThemedText 
                style={[
                  styles.vehicleIdentifier,
                  isVehicleSelected(item.id) && styles.selectedText
                ]}
              >
                ID: {item.identifier}
              </ThemedText>
            </View>
            
            <View style={styles.checkboxContainer}>
              {isVehicleSelected(item.id) ? (
                <View style={styles.checkedBox}>
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View style={styles.uncheckedBox} />
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      <ThemedView style={styles.selectedSummary}>
        <ThemedText style={styles.selectedSummaryText}>
          {draftClaim.vehicles.length === 0 
            ? 'No vehicles selected' 
            : `Selected ${draftClaim.vehicles.length} vehicle(s)`}
        </ThemedText>
      </ThemedView>
      
      {draftClaim.vehicles.length === 0 && (
        <ThemedText style={styles.noSelectionNote}>
          If no vehicles were involved in this incident, you can proceed to the next step.
        </ThemedText>
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
  listContainer: {
    gap: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedVehicleCard: {
    backgroundColor: '#1F448C',
    borderColor: '#1F448C',
  },
  vehicleIconContainer: {
    marginRight: 12,
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
  selectedText: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1F448C',
  },
  checkedBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  selectedSummaryText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noSelectionNote: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});