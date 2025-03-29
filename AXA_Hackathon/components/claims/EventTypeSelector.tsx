import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ClaimEventType } from '@/types/claims';

interface EventTypeSelectorProps {
  value: ClaimEventType;
  onChange: (eventType: ClaimEventType) => void;
}

interface EventOption {
  value: ClaimEventType;
  label: string;
  icon: string;
  description: string;
}

const eventOptions: EventOption[] = [
  {
    value: 'agricultural_vehicle_accident',
    label: 'Agricultural Vehicle Accident',
    icon: 'car.fill',
    description: 'Accident involving tractors, harvesters, or other agricultural vehicles'
  },
  {
    value: 'theft',
    label: 'Theft',
    icon: 'lock.open',
    description: 'Theft of covered equipment or property'
  },
  {
    value: 'fire',
    label: 'Fire',
    icon: 'flame.fill',
    description: 'Fire damage to property, crops, or equipment'
  },
  {
    value: 'natural_events',
    label: 'Natural Events',
    icon: 'cloud.rain.fill',
    description: 'Damage from hail, storms, floods, or other natural events'
  },
  {
    value: 'material_damages',
    label: 'Material Damages',
    icon: 'hammer.fill',
    description: 'Physical damage to covered equipment or property'
  },
  {
    value: 'hydraulic_mechanism_failure',
    label: 'Hydraulic Mechanism Failure',
    icon: 'gearshape.fill',
    description: 'Failure of hydraulic systems in agricultural machinery'
  },
  {
    value: 'liability_coverage',
    label: 'Liability Coverage',
    icon: 'person.2.fill',
    description: 'Claims involving liability to third parties'
  },
  {
    value: 'other',
    label: 'Other',
    icon: 'questionmark.circle.fill',
    description: 'Other incidents covered by your policy'
  }
];

export function EventTypeSelector({ value, onChange }: EventTypeSelectorProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructions}>
        Please select the type of event you want to report:
      </ThemedText>
      
      <View style={styles.optionsGrid}>
        {eventOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              value === option.value && styles.selectedOption
            ]}
            onPress={() => onChange(option.value)}
          >
            <IconSymbol 
              name={option.icon} 
              size={28} 
              color={value === option.value ? '#FFFFFF' : '#1F448C'} 
            />
            <ThemedText 
              style={[
                styles.optionLabel,
                value === option.value && styles.selectedOptionText
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      {value && (
        <ThemedView style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionTitle}>
            {eventOptions.find(o => o.value === value)?.label}:
          </ThemedText>
          <ThemedText style={styles.descriptionText}>
            {eventOptions.find(o => o.value === value)?.description}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 68, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  selectedOption: {
    backgroundColor: '#1F448C',
  },
  optionLabel: {
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  descriptionContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#1F448C',
  },
  descriptionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
  },
});