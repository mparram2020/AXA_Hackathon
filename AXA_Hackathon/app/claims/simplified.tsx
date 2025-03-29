import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useClaimStore } from '@/stores/claimStore';
import { VoiceClaimInput } from '@/components/claims/VoiceClaimInput';
import { AIPhotoAnalysis } from '@/components/claims/AIPhotoAnalysis';

export default function SimplifiedClaimScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceInputComplete, setVoiceInputComplete] = useState(false);
  const [photoAnalysisComplete, setPhotoAnalysisComplete] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const { initDraftClaim, draftClaim, updateDraftClaim } = useClaimStore();
  
  useEffect(() => {
    if (!draftClaim) {
      initDraftClaim();
    }
  }, [initDraftClaim, draftClaim]);

  if (!draftClaim) return null;

  const handleVoiceInputComplete = (data) => {
    setVoiceInputComplete(true);
    setAiSuggestions(data);
    
    // Automatically advance to next step after a short delay
    setTimeout(() => {
      setCurrentStep(1);
    }, 1500);
  };

  const handlePhotoAnalysisComplete = (data) => {
    setPhotoAnalysisComplete(true);
  };

  const handleSubmit = () => {
    router.replace('/claims/confirmation');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <VoiceClaimInput onComplete={handleVoiceInputComplete} />;
      case 1:
        return <AIPhotoAnalysis onAnalysisComplete={handlePhotoAnalysisComplete} />;
      case 2:
        return (
          <ThemedView style={styles.reviewContainer}>
            <ThemedText style={styles.stepTitle}>Review & Submit</ThemedText>
            
            <ThemedView style={styles.summaryBox}>
              <ThemedText style={styles.summaryTitle}>Claim Summary</ThemedText>
              
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Type:</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {draftClaim.eventType === 'agricultural_vehicle_accident' ? 
                    'Agricultural Vehicle Accident' : draftClaim.eventType}
                </ThemedText>
              </View>
              
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Location:</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {draftClaim.eventLocation?.address || 'Not specified'}
                </ThemedText>
              </View>
              
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Description:</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {draftClaim.description || 'Not provided'}
                </ThemedText>
              </View>
              
              {draftClaim.aiDamageAssessment && (
                <>
                  <ThemedText style={styles.aiResultsTitle}>AI Assessment</ThemedText>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Damage:</ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {draftClaim.aiDamageAssessment.damageType}
                    </ThemedText>
                  </View>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Severity:</ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {draftClaim.aiDamageAssessment.damageSeverity}
                    </ThemedText>
                  </View>
                </>
              )}
            </ThemedView>
            
            <Button
              title="Submit Claim"
              onPress={handleSubmit}
              type="primary"
              style={styles.submitButton}
            />
            
            <ThemedText style={styles.legalText}>
              By submitting, you confirm all information is accurate and truthful.
            </ThemedText>
          </ThemedView>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / 3) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <IconSymbol name="chevron.left" size={24} color="#1F448C" onPress={() => router.back()} />
        <ThemedText style={styles.headerTitle}>Smart Claim</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <ThemedText style={styles.progressText}>
          Step {currentStep + 1} of 3
        </ThemedText>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {renderStep()}
        </ScrollView>
        
        {currentStep < 2 && (
          <View style={styles.navigationBar}>
            {currentStep > 0 && (
              <Button
                title="Back"
                onPress={() => setCurrentStep(currentStep - 1)}
                type="secondary"
                style={styles.navButton}
              />
            )}
            
            <Button
              title="Next"
              onPress={() => setCurrentStep(currentStep + 1)}
              type="primary"
              style={styles.navButton}
              disabled={
                (currentStep === 0 && !voiceInputComplete) || 
                (currentStep === 1 && !photoAnalysisComplete)
              }
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#1F448C',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  reviewContainer: {
    flex: 1,
  },
  summaryBox: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  summaryValue: {
    flex: 1,
  },
  aiResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1F448C',
  },
  submitButton: {
    marginVertical: 16,
  },
  legalText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  }
});