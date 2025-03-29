import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ClaimStatusCard } from '@/components/claims/ClaimStatusCard';
import { useClaimStore } from '@/stores/claimStore';

export default function InsuranceScreen() {
  const { activeClaims } = useClaimStore();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1F448C', dark: '#1F448C' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#ffffff"
          name="shield.checkerboard"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Global Agrícola</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Policy Summary</ThemedText>
        <ThemedView style={styles.policyCard}>
          <ThemedText>Policy Number: GA-123456789</ThemedText>
          <ThemedText>Validity: 01/01/2025 - 31/12/2025</ThemedText>
          <ThemedText>Status: Active</ThemedText>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <ThemedText style={styles.buttonText}>View Details</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Make a Claim</ThemedText>
        <TouchableOpacity 
          style={styles.fileClaimButton} 
          onPress={() => router.push('/claims/new')}>
          <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
          <ThemedText style={styles.fileClaimButtonText}>File a New Claim</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.reminderText}>
          Remember: You must report incidents within 7 days and take all possible measures to minimize damages.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Recent Claims ({activeClaims.length})
        </ThemedText>
        
        {activeClaims.length === 0 ? (
          <ThemedText style={styles.noClaims}>You have no active claims</ThemedText>
        ) : (
          <View style={styles.claimsList}>
            {activeClaims.map(claim => (
              <ClaimStatusCard 
                key={claim.id} 
                claim={claim}
                onPress={() => router.push(`/claims/${claim.id}`)}
              />
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/claims/history')}>
          <ThemedText style={styles.viewAllText}>View All Claims</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    opacity: 0.6,
    bottom: -60,
    right: -100,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  policyCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 4,
  },
  viewDetailsButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#1F448C',
    fontWeight: '600',
  },
  fileClaimButton: {
    backgroundColor: '#1F448C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  fileClaimButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  reminderText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555555',
  },
  noClaims: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  claimsList: {
    gap: 12,
  },
  viewAllButton: {
    alignItems: 'center', 
    marginTop: 12,
    padding: 8,
  },
  viewAllText: {
    color: '#1F448C',
    fontWeight: '600',
  }
});
