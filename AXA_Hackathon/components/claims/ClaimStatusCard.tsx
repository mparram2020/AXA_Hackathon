import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Claim } from '@/types/claims';

interface ClaimStatusCardProps {
  claim: Claim;
  onPress?: () => void;
}

export function ClaimStatusCard({ claim, onPress }: ClaimStatusCardProps) {
  const getStatusColor = () => {
    switch (claim.status) {
      case 'submitted': return '#3498db';
      case 'under_review': return '#f39c12';
      case 'information_needed': return '#e74c3c';
      case 'approved': return '#2ecc71';
      case 'rejected': return '#e74c3c';
      case 'paid': return '#27ae60';
      default: return '#7f8c8d';
    }
  };
  
  const getStatusText = () => {
    switch (claim.status) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'information_needed': return 'Information Needed';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'paid': return 'Paid';
      default: return 'Draft';
    }
  };
  
  const getEventTypeLabel = () => {
    switch (claim.eventType) {
      case 'agricultural_vehicle_accident': return 'Vehicle Accident';
      case 'theft': return 'Theft';
      case 'fire': return 'Fire';
      case 'natural_events': return 'Natural Event';
      case 'material_damages': return 'Material Damages';
      case 'hydraulic_mechanism_failure': return 'Hydraulic Mechanism Failure';
      case 'liability_coverage': return 'Liability Coverage';
      default: return 'Other';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={styles.statusIndicator(getStatusColor())} />
      <ThemedView style={styles.content}>
        <ThemedView style={styles.row}>
          <ThemedText type="defaultSemiBold" style={styles.reference}>
            {claim.reference || 'Draft Claim'}
          </ThemedText>
          <ThemedView style={styles.statusBadge(getStatusColor())}>
            <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText>{getEventTypeLabel()}</ThemedText>
        <ThemedText style={styles.date}>
          {new Date(claim.eventDate).toLocaleDateString()}
        </ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={16} color="#7f8c8d" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusIndicator: (color: string) => ({
    width: 6,
    height: '100%',
    backgroundColor: color,
  }),
  content: {
    flex: 1,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reference: {
    fontSize: 16,
  },
  statusBadge: (color: string) => ({
    backgroundColor: color,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  }),
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});