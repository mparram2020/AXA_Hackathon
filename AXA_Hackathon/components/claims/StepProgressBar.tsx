import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/theme';


interface StepProgressBarProps {
  steps: number;
  currentStep: number;
  onStepPress?: (step: number) => void;
}

export function StepProgressBar({ steps, currentStep, onStepPress }: StepProgressBarProps) {
  const screenWidth = Dimensions.get('window').width;
  const stepWidth = (screenWidth - 32) / steps; // Subtract padding

  return (
    <View style={styles.container}>
      {/* Progress line that fills according to progress */}
      <View style={styles.progressLineContainer}>
        <View 
          style={[
            styles.progressLine, 
            { width: `${(currentStep / (steps - 1)) * 100}%` }
          ]} 
        />
      </View>
      
      {/* Step indicators */}
      <View style={styles.stepsContainer}>
        {Array.from({ length: steps }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepButtonContainer,
              { width: stepWidth }
            ]}
            onPress={() => onStepPress?.(index)}
            disabled={!onStepPress}
            activeOpacity={0.7}
          >
            <View 
              style={[
                styles.step,
                currentStep === index && styles.currentStep,
                index < currentStep && styles.completedStep,
              ]}
            >
              {index < currentStep ? (
                <View style={styles.checkmark}>
                  <View style={styles.checkmarkStem}></View>
                  <View style={styles.checkmarkKick}></View>
                </View>
              ) : (
                <ThemedText 
                  style={[
                    styles.stepText,
                    (currentStep === index || index < currentStep) && styles.activeStepText
                  ]}
                >
                  {index + 1}
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  progressLineContainer: {
    position: 'absolute',
    top: 22,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: Colors.border,
    zIndex: 1,
  },
  progressLine: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  stepButtonContainer: {
    alignItems: 'center',
  },
  step: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentStep: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  completedStep: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  activeStepText: {
    color: Colors.white,
  },
  checkmark: {
    width: 10,
    height: 10,
  },
  checkmarkStem: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#FFFFFF',
    left: 4,
    top: 0,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkKick: {
    position: 'absolute',
    width: 4,
    height: 2,
    backgroundColor: '#FFFFFF',
    left: 0,
    top: 4,
    transform: [{ rotate: '45deg' }],
  },
});