import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClaimStore } from '@/stores/claimStore';
import { EventTypeSelector } from '@/components/claims/EventTypeSelector';
import { DateTimeSelector } from '@/components/claims/DateTimeSelector';
import { LocationSelector } from '@/components/claims/LocationSelector';
import { DescriptionInput } from '@/components/claims/DescriptionInput';
import { VehicleSelector } from '@/components/claims/VehicleSelector';
import { ThirdPartyInput } from '@/components/claims/ThirdPartyInput';
import { PoliceReportInput } from '@/components/claims/PoliceReportInput';
import { MediaAttachments } from '@/components/claims/MediaAttachments';
import { PolicyConfirmation } from '@/components/claims/PolicyConfirmation';
import { DeclarationAcceptance } from '@/components/claims/DeclarationAcceptance';
import { ClaimReviewSubmit } from '@/components/claims/ClaimReviewSubmit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StepProgressBar } from '@/components/claims/StepProgressBar';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';

// Define the steps in the claim filing process
const steps = [
  { key: 'event_type', title: 'Event Type' },
  { key: 'date_time', title: 'Date & Time' },
  { key: 'location', title: 'Location' },
  { key: 'description', title: 'Description' },
  { key: 'vehicles', title: 'Vehicles' },
  { key: 'third_parties', title: 'Third Parties' },
  { key: 'police_report', title: 'Police Report' },
  { key: 'attachments', title: 'Attachments' },
  { key: 'policy', title: 'Policy Review' },
  { key: 'declaration', title: 'Declaration' },
  { key: 'review', title: 'Review & Submit' },
];

export default function NewClaimScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { initDraftClaim, draftClaim, updateDraftClaim } = useClaimStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // Initialize a new draft claim when the screen loads
    if (!draftClaim) {
      initDraftClaim();
    }
  }, [initDraftClaim, draftClaim]);

  // Scroll to top when changing steps
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  if (!draftClaim) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to the insurance screen
      router.back();
    }
  };

  // Check if the current step is complete to enable the next button
  const isStepComplete = () => {
    switch (steps[currentStep].key) {
      case 'event_type':
        return !!draftClaim.eventType;
      case 'date_time':
        return !!draftClaim.eventDate;
      case 'location':
        return !!(draftClaim.eventLocation.address || 
          (draftClaim.eventLocation.latitude && draftClaim.eventLocation.longitude));
      case 'description':
        return !!draftClaim.description && draftClaim.description.length >= 10;
      // For these steps, they're optional or can be completed later
      case 'vehicles':
      case 'third_parties':
      case 'police_report':
      case 'attachments':
        return true;
      case 'policy':
        return true;
      case 'declaration':
        return draftClaim.isSubmittable;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].key) {
      case 'event_type':
        return <EventTypeSelector 
          value={draftClaim.eventType} 
          onChange={(eventType) => updateDraftClaim({ eventType })} 
        />;
      case 'date_time':
        return <DateTimeSelector 
          value={draftClaim.eventDate} 
          onChange={(eventDate) => updateDraftClaim({ eventDate })} 
        />;
      case 'location':
        return <LocationSelector 
          value={draftClaim.eventLocation} 
          onChange={(eventLocation) => updateDraftClaim({ eventLocation })} 
        />;
      case 'description':
        return <DescriptionInput 
          value={draftClaim.description} 
          onChange={(description) => updateDraftClaim({ description })} 
        />;
      case 'vehicles':
        return <VehicleSelector />;
      case 'third_parties':
        return <ThirdPartyInput />;
      case 'police_report':
        return <PoliceReportInput 
          value={draftClaim.policeReport} 
          onChange={(policeReport) => updateDraftClaim({ policeReport })} 
        />;
      case 'attachments':
        return <MediaAttachments />;
      case 'policy':
        return <PolicyConfirmation policyId={draftClaim.policyId} />;
      case 'declaration':
        return <DeclarationAcceptance 
          onChange={(isSubmittable) => updateDraftClaim({ isSubmittable })} 
        />;
      case 'review':
        return <ClaimReviewSubmit claim={draftClaim} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <IconButton 
          name="chevron.left" 
          size={24} 
          onPress={() => router.back()} 
          style={styles.backButton} 
        />
        <ThemedText style={styles.headerTitle}>File a Claim</ThemedText>
      </View>
      
      <StepProgressBar 
        steps={steps.length} 
        currentStep={currentStep} 
        onStepPress={(index) => {
          // Only allow going back to previous steps, not skipping ahead
          if (index <= currentStep) {
            setCurrentStep(index);
          }
        }}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>
              {steps[currentStep].title}
            </ThemedText>
            
            <ThemedView style={styles.stepContent}>
              {renderStep()}
            </ThemedView>
          </ThemedView>
          
          {/* 7-day deadline and damage mitigation reminder */}
          {currentStep === 0 && (
            <ThemedView style={styles.reminderContainer}>
              <ThemedText style={styles.reminderTitle}>Important Reminders:</ThemedText>
              <ThemedText style={styles.reminderText}>
                • You must report incidents within 7 days of occurrence
              </ThemedText>
              <ThemedText style={styles.reminderText}>
                • You are obligated to use all means at your disposal to minimize damages
              </ThemedText>
            </ThemedView>
          )}
          
          {/* Add padding at bottom to prevent content from being hidden behind buttons */}
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Fixed navigation buttons */}
        <View style={styles.navigationBar}>
          <Button 
            title="Back" 
            onPress={handlePrevious} 
            style={styles.navButton} 
            type="secondary" 
          />
          <Button 
            title={currentStep === steps.length - 1 ? "Submit Claim" : "Next"} 
            onPress={handleNext} 
            style={styles.navButton} 
            disabled={!isStepComplete()}
            type="primary" 
          />
        </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 16,
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
  stepContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stepContent: {
    padding: 16,
  },
  reminderContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 236, 179, 0.3)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  reminderTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 80, // Space for the fixed navigation bar
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});