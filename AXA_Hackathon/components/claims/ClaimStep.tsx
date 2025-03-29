import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';

interface ClaimStepProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  canProgress: boolean;
  isLastStep: boolean;
}

export function ClaimStep({
  title,
  currentStep,
  totalSteps,
  children,
  onNext,
  onPrevious,
  canProgress,
  isLastStep,
}: ClaimStepProps) {
  // Add these handlers to prevent event bubbling
  const handleNext = (e: any) => {
    // Prevent any default behavior that might affect scrolling
    //console.log('Next button clicked');
    if (e && e.preventDefault) e.preventDefault();
    onNext();
  };

  const handlePrevious = (e: any) => {
    // Prevent any default behavior that might affect scrolling
    if (e && e.preventDefault) e.preventDefault();
    onPrevious();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.stepCount}>
          Step {currentStep} of {totalSteps}
        </ThemedText>
        <ThemedText type="heading" style={styles.title}>
          {title}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {children}
      </ThemedView>

      <ThemedView style={styles.footer}>
        <Button 
          title="Back" 
          onPress={handlePrevious} 
          style={styles.backButton} 
          type="secondary"
        />
        <Button
          title={isLastStep ? "Submit Claim" : "Next"}
          onPress={handleNext}
          disabled={!canProgress}
          style={styles.nextButton}
          type="primary"
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
  },
  stepCount: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666666',
  },
  title: {
    fontSize: 20,
  },
  content: {
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
  },
});