import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { InsuranceQuoteForm } from '@/components/InsuranceQuoteForm';
import { InsuranceOffer } from '@/components/InsuranceOffer';

export default function HomeScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [insuranceOffer, setInsuranceOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Process the completed form data
  const handleComplete = async (formData) => {
    setLoading(true);
    
    // Simulate API call to Gemini for risk assessment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a tailored offer based on the data
    const offer = generateInsuranceOffer(formData);
    setInsuranceOffer(offer);
    setLoading(false);
    setCurrentStep(1); // Move to results step
  };
  
  // Reset and start over
  const handleStartOver = () => {
    setCurrentStep(0);
    setInsuranceOffer(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#103184', dark: '#00008f' }}
      headerImage={
        <Image
          source={require('@/assets/images/axa-logo.png')}
          style={styles.headerLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.mainTitle}>AXA Agro Truck Insurance</ThemedText>
        
        {currentStep === 0 && (
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut}
            style={styles.contentContainer}
          >
            <ThemedText style={styles.subtitle}>
              Tell us about your agricultural vehicle to get a personalized quote
            </ThemedText>
            
            <InsuranceQuoteForm 
              onComplete={handleComplete}
              isLoading={loading}
            />
          </Animated.View>
        )}
        
        {currentStep === 1 && insuranceOffer && (
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut}
            style={styles.contentContainer}
          >
            <InsuranceOffer 
              offer={insuranceOffer}
              onStartOver={handleStartOver}
            />
          </Animated.View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Helper function to generate an insurance offer based on form data
function generateInsuranceOffer(formData) {
  const { vehicleType, vehicleAge, vehicleValue, usage } = formData;
  
  // Calculate risk score (simplified)
  let riskScore = 0;
  
  // Age factor
  if (vehicleAge <= 3) riskScore += 1;
  else if (vehicleAge <= 8) riskScore += 2;
  else riskScore += 3;
  
  // Value factor
  const value = parseInt(vehicleValue, 10);
  if (value <= 30000) riskScore += 1;
  else if (value <= 70000) riskScore += 2;
  else riskScore += 3;
  
  // Usage factor
  if (usage === 'occasional') riskScore += 1;
  else if (usage === 'seasonal') riskScore += 2;
  else riskScore += 3;
  
  // Determine plan and pricing
  let plan, coverage, monthlyPrice;
  
  if (riskScore <= 4) {
    plan = 'Standard';
    coverage = 'Basic liability and collision coverage';
    monthlyPrice = value * 0.0008 + 89;
  } else if (riskScore <= 7) {
    plan = 'Premium';
    coverage = 'Comprehensive coverage with theft protection';
    monthlyPrice = value * 0.001 + 129;
  } else {
    plan = 'Premium Plus';
    coverage = 'Full comprehensive coverage including severe weather damage';
    monthlyPrice = value * 0.0013 + 169;
  }
  
  return {
    plan,
    coverage,
    monthlyPrice,
    riskScore,
    riskLevel: riskScore <= 4 ? 'Low Risk' : riskScore <= 7 ? 'Medium Risk' : 'High Risk',
    vehicleType,
    recommendation: riskScore <= 4 
      ? 'Your agricultural vehicle qualifies for our standard coverage at a competitive rate.'
      : riskScore <= 7 
        ? 'Based on your vehicle profile, we recommend our Premium plan for better protection.'
        : 'For maximum protection of your high-value equipment, we strongly recommend our Premium Plus plan.'
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerLogo: {
    height: 60,
    width: 100,
    bottom: 10,
    right: 10,
    position: 'absolute',
    resizeMode: 'contain'
  },
  mainTitle: {
    color: '#FF1721', // AXA red
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  contentContainer: {
    width: '100%',
  }
});