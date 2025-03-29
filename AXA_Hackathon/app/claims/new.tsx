import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useClaimStore } from '@/stores/claimStore';
import { ClaimStep } from '@/components/claims/ClaimStep';
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
  
  useEffect(() => {
    // Initialize a new draft claim when the screen loads
    if (!draftClaim) {
      initDraftClaim();
    }
  }, [initDraftClaim, draftClaim]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ClaimStep 
          title={steps[currentStep].title}
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          canProgress={isStepComplete()}
          isLastStep={currentStep === steps.length - 1}
        >
          {renderStep()}
        </ClaimStep>
        
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
      </ScrollView>
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
  backButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  reminderContainer: {
    marginTop: 24,
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
});