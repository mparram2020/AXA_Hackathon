import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';
import { useClaimStore } from '@/stores/claimStore';
import { Colors, Fonts } from '@/constants/theme';

export function AIPhotoAnalysis({ onAnalysisComplete }) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { updateDraftClaim } = useClaimStore();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('We need camera permissions to analyze damage');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setAnalyzing(true);
    
    try {
      // In a real app, here we would:
      // 1. Upload the image to our AI service
      // 2. Get back detailed analysis of the damage
      
      // Simulating API call and response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Example AI analysis result
      const mockAnalysis = {
        damageDetected: true,
        damageType: 'Mechanical damage to hydraulic system',
        affectedParts: ['Hydraulic arm', 'Pressure valve'],
        damageSeverity: 'Moderate',
        estimatedRepairCost: '€500-€750',
        recommendedAction: 'Repair required, agricultural vehicle temporarily unusable'
      };
      
      setAnalysis(mockAnalysis);
      
      // Update claim with AI findings
      updateDraftClaim({
        aiDamageAssessment: mockAnalysis,
        description: (prevDescription) => 
          `${prevDescription || ''}\n\nAI Damage Assessment: ${mockAnalysis.damageType}. Severity: ${mockAnalysis.damageSeverity}.`
      });
      
      onAnalysisComplete(mockAnalysis);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      alert('We encountered an issue analyzing your image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>AI Damage Assessment</ThemedText>
      
      <ThemedText style={styles.instructions}>
        Take a photo of the damage, and our AI will automatically analyze it to help process your claim faster.
      </ThemedText>
      
      {!image ? (
        <Button
          title="Take Photo for Analysis"
          onPress={takePhoto}
          type="primary"
          icon={<IconSymbol name="camera.fill" size={20} color="#FFFFFF" />}
        />
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          
          {analyzing ? (
            <View style={styles.analysisOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <ThemedText style={styles.analysingText}>
                Analyzing damage...
              </ThemedText>
            </View>
          ) : null}
        </View>
      )}
      
      {analysis && (
        <ThemedView style={styles.analysisContainer}>
          <ThemedText style={styles.analysisTitle}>
            <IconSymbol name="checkmark.shield.fill" size={16} color="#4CAF50" /> 
            AI Analysis Results
          </ThemedText>
          
          <View style={styles.resultRow}>
            <ThemedText style={styles.resultLabel}>Damage Type:</ThemedText>
            <ThemedText style={styles.resultValue}>{analysis.damageType}</ThemedText>
          </View>
          
          <View style={styles.resultRow}>
            <ThemedText style={styles.resultLabel}>Affected Parts:</ThemedText>
            <ThemedText style={styles.resultValue}>{analysis.affectedParts.join(", ")}</ThemedText>
          </View>
          
          <View style={styles.resultRow}>
            <ThemedText style={styles.resultLabel}>Severity:</ThemedText>
            <ThemedText style={styles.resultValue}>{analysis.damageSeverity}</ThemedText>
          </View>
          
          <View style={styles.resultRow}>
            <ThemedText style={styles.resultLabel}>Est. Repair:</ThemedText>
            <ThemedText style={styles.resultValue}>{analysis.estimatedRepairCost}</ThemedText>
          </View>
          
          <ThemedText style={styles.recommendationText}>
            {analysis.recommendedAction}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  title: {
    ...Fonts.title,
    marginBottom: 12,
  },
  instructions: {
    ...Fonts.body,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  analysisOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysingText: {
    color: Colors.white,
    marginTop: 16,
    fontWeight: 'bold',
  },
  analysisContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  analysisTitle: {
    ...Fonts.subtitle,
    marginBottom: 12,
    color: Colors.primary,
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  resultLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  resultValue: {
    flex: 1,
  },
  recommendationText: {
    marginTop: 12,
    fontStyle: 'italic',
    color: Colors.primary,
  },
});