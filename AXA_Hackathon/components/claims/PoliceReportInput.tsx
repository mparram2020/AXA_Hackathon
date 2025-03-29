import React from 'react';
import { StyleSheet, View, TextInput, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface PoliceReportInputProps {
  value: {
    filed: boolean;
    reportNumber?: string;
    policeStation?: string;
  };
  onChange: (value: {
    filed: boolean;
    reportNumber?: string;
    policeStation?: string;
  }) => void;
}

export function PoliceReportInput({ value, onChange }: PoliceReportInputProps) {
  const handleFiledChange = (filed: boolean) => {
    onChange({
      ...value,
      filed,
      // Clear the fields if not filed
      reportNumber: filed ? value.reportNumber : '',
      policeStation: filed ? value.policeStation : '',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Please indicate if a police report has been filed for this incident:
      </ThemedText>
      
      <ThemedView style={styles.switchContainer}>
        <ThemedText style={styles.switchLabel}>Police report filed?</ThemedText>
        <Switch
          value={value.filed}
          onValueChange={handleFiledChange}
          trackColor={{ false: '#E0E0E0', true: '#1F448C' }}
          thumbColor={value.filed ? '#FFFFFF' : '#F5F5F5'}
        />
      </ThemedView>
      
      {value.filed && (
        <ThemedView style={styles.formContainer}>
          <ThemedView style={styles.inputWrapper}>
            <ThemedText style={styles.label}>Police Report Number</ThemedText>
            <TextInput
              style={styles.input}
              value={value.reportNumber}
              onChangeText={(text) => onChange({ ...value, reportNumber: text })}
              placeholder="Enter the police report number"
            />
          </ThemedView>
          
          <ThemedView style={styles.inputWrapper}>
            <ThemedText style={styles.label}>Police Station</ThemedText>
            <TextInput
              style={styles.input}
              value={value.policeStation}
              onChangeText={(text) => onChange({ ...value, policeStation: text })}
              placeholder="Enter the name of the police station"
            />
          </ThemedView>
        </ThemedView>
      )}
      
      {!value.filed && (
        <ThemedView style={styles.noteContainer}>
          <ThemedText style={styles.noteText}>
            Note: Filing a police report is recommended for theft, accidents with injuries, or significant property damage.
          </ThemedText>
        </ThemedView>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  inputWrapper: {
    marginBottom: 12,
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
  noteContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 236, 179, 0.3)',
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#795548',
  },
});