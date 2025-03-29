import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Mock policy data - in a real app, this would come from an API
const mockPolicy = {
  id: 'GA-123456789',
  name: 'Global Agrícola',
  validFrom: '2025-01-01T00:00:00.000Z',
  validTo: '2025-12-31T23:59:59.999Z',
  coverages: [
    { name: 'Fire', included: true },
    { name: 'Theft', included: true },
    { name: 'Agricultural Vehicle Accident', included: true },
    { name: 'Material Damages', included: true },
    { name: 'Natural Events', included: true },
    { name: 'Hydraulic Mechanism Failure', included: true },
    { name: 'Liability Coverage', included: true },
  ],
  insuredValue: '€100,000',
  deductible: '€500',
};

interface PolicyConfirmationProps {
  policyId: string;
}

export function PolicyConfirmation({ policyId }: PolicyConfirmationProps) {
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState<typeof mockPolicy | null>(null);
  
  // Simulate API request to fetch policy details
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPolicy(mockPolicy);
      } catch (error) {
        console.error('Error fetching policy:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolicy();
  }, [policyId]);
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F448C" />
        <ThemedText style={styles.loadingText}>Loading policy details...</ThemedText>
      </ThemedView>
    );
  }
  
  if (!policy) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={40} color="#E53935" />
        <ThemedText style={styles.errorText}>
          Unable to load policy details. Please try again later.
        </ThemedText>
      </ThemedView>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Please review your policy details before submitting the claim:
      </ThemedText>
      
      <ThemedView style={styles.policyCard}>
        <ThemedView style={styles.policyHeader}>
          <IconSymbol name="shield.checkerboard" size={24} color="#1F448C" />
          <ThemedText style={styles.policyName}>{policy.name}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.policyDetail}>
          <ThemedText style={styles.detailLabel}>Policy Number</ThemedText>
          <ThemedText style={styles.detailValue}>{policy.id}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.policyDetail}>
          <ThemedText style={styles.detailLabel}>Valid Period</ThemedText>
          <ThemedText style={styles.detailValue}>
            {formatDate(policy.validFrom)} to {formatDate(policy.validTo)}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.policyDetail}>
          <ThemedText style={styles.detailLabel}>Insured Value</ThemedText>
          <ThemedText style={styles.detailValue}>{policy.insuredValue}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.policyDetail}>
          <ThemedText style={styles.detailLabel}>Deductible</ThemedText>
          <ThemedText style={styles.detailValue}>{policy.deductible}</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.coveragesLabel}>Coverages</ThemedText>
        {policy.coverages.map((coverage, index) => (
          <ThemedView key={index} style={styles.coverageItem}>
            <IconSymbol 
              name={coverage.included ? "checkmark.circle.fill" : "xmark.circle.fill"} 
              size={20} 
              color={coverage.included ? "#4CAF50" : "#E53935"} 
            />
            <ThemedText style={styles.coverageText}>{coverage.name}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  policyCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  policyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F448C',
  },
  policyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  coveragesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  coverageText: {
    fontSize: 14,
  },
});