import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Claim, ClaimEventType } from '@/types/claims';
import { useClaimStore } from '@/stores/claimStore';

interface ClaimReviewSubmitProps {
  claim: Claim;
}

export function ClaimReviewSubmit({ claim }: ClaimReviewSubmitProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { submitClaim } = useClaimStore();

  const getEventTypeName = (type: ClaimEventType) => {
    switch (type) {
      case 'agricultural_vehicle_accident': return 'Agricultural Vehicle Accident';
      case 'theft': return 'Theft';
      case 'fire': return 'Fire';
      case 'natural_events': return 'Natural Events';
      case 'material_damages': return 'Material Damages';
      case 'hydraulic_mechanism_failure': return 'Hydraulic Mechanism Failure';
      case 'liability_coverage': return 'Liability Coverage';
      case 'other': return 'Other';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await submitClaim();
      
      // Navigate to success screen or show success message
      router.replace('/claims/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Event Information</ThemedText>
        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Type of Event:</ThemedText>
          <ThemedText style={styles.value}>{getEventTypeName(claim.eventType)}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Date & Time:</ThemedText>
          <ThemedText style={styles.value}>{formatDate(claim.eventDate)}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Location:</ThemedText>
          <ThemedText style={styles.value}>
            {claim.eventLocation.address || 
              (claim.eventLocation.latitude && claim.eventLocation.longitude ? 
                `Lat: ${claim.eventLocation.latitude.toFixed(4)}, Long: ${claim.eventLocation.longitude.toFixed(4)}` : 
                'Not specified')}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedView style={styles.descriptionBox}>
          <ThemedText>{claim.description || 'No description provided'}</ThemedText>
        </ThemedView>
      </ThemedView>

      {claim.vehicles.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Vehicles Involved ({claim.vehicles.length})</ThemedText>
          {claim.vehicles.map((vehicle) => (
            <ThemedView key={vehicle.id} style={styles.itemCard}>
              <ThemedText style={styles.itemTitle}>
                {vehicle.make} {vehicle.model}
              </ThemedText>
              <ThemedText style={styles.itemDetail}>
                Type: {vehicle.type}
              </ThemedText>
              <ThemedText style={styles.itemDetail}>
                Identifier: {vehicle.identifier}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {claim.thirdParties.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Third Parties Involved ({claim.thirdParties.length})</ThemedText>
          {claim.thirdParties.map((party) => (
            <ThemedView key={party.id} style={styles.itemCard}>
              <ThemedText style={styles.itemTitle}>{party.name}</ThemedText>
              <ThemedText style={styles.itemDetail}>Contact: {party.contact}</ThemedText>
              {party.insuranceInfo && (
                <ThemedText style={styles.itemDetail}>
                  Insurance: {party.insuranceInfo}
                </ThemedText>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Police Report</ThemedText>
        {claim.policeReport.filed ? (
          <View>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.label}>Report Number:</ThemedText>
              <ThemedText style={styles.value}>{claim.policeReport.reportNumber}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.label}>Police Station:</ThemedText>
              <ThemedText style={styles.value}>{claim.policeReport.policeStation}</ThemedText>
            </ThemedView>
          </View>
        ) : (
          <ThemedText style={styles.noDataText}>No police report filed</ThemedText>
        )}
      </ThemedView>

      {claim.mediaItems.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Attachments ({claim.mediaItems.length})
          </ThemedText>
          <ThemedText style={styles.attachmentsNote}>
            {claim.mediaItems.length} file(s) attached to this claim
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Policy Information</ThemedText>
        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Policy ID:</ThemedText>
          <ThemedText style={styles.value}>{claim.policyId}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.submitSection}>
        <ThemedView style={styles.confirmationBox}>
          <IconSymbol name="checkmark.shield.fill" size={24} color="#4CAF50" />
          <ThemedText style={styles.confirmationText}>
            I confirm that all information provided is true and complete to the best of my knowledge
          </ThemedText>
        </ThemedView>
        
        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}
        
        <Button
          title={submitting ? "Submitting..." : "Submit Claim"}
          onPress={handleSubmit}
          type="primary"
          disabled={submitting}
          loading={submitting}
          style={styles.submitButton}
        />
        
        <ThemedText style={styles.noteText}>
          Note: Once submitted, you'll receive a claim reference number and can track the status in the app.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F448C',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  value: {
    flex: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionBox: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  itemCard: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: '#666666',
  },
  attachmentsNote: {
    fontStyle: 'italic',
    color: '#666666',
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#666666',
  },
  submitSection: {
    marginTop: 12,
    marginBottom: 40,
  },
  confirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  confirmationText: {
    flex: 1,
    fontSize: 14,
  },
  submitButton: {
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
  },
  noteText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});