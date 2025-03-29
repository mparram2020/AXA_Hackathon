import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useClaimStore } from '@/stores/claimStore';

export function VoiceClaimInput({ onComplete }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { updateDraftClaim } = useClaimStore();

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    
    if (uri) {
      processRecording(uri);
    }
  }

  async function processRecording(uri: string) {
    setProcessingAudio(true);
    
    try {
      // In a real implementation, this would send the audio to a speech-to-text API
      // and then process the text with a large language model
      
      // Simulated AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example AI-generated response
      const aiProcessedData = {
        eventType: 'agricultural_vehicle_accident',
        description: 'My tractor had a mechanical failure in the hydraulic system while working in the north field. The hydraulic arm suddenly dropped, causing damage to the attached implement. This happened yesterday around 3 PM during regular field operations.',
        location: 'North field, approximately 2km from the main barn',
        affectedVehicles: ['John Deere 5075E'],
        suggestedNextSteps: 'Take photos of the damaged hydraulic system and implement.'
      };
      
      setTranscript(aiProcessedData.description);
      
      // Update the claim with AI-processed information
      updateDraftClaim({
        eventType: aiProcessedData.eventType,
        description: aiProcessedData.description,
        eventLocation: { address: aiProcessedData.location }
      });
      
      // Signal that the voice input has provided sufficient information
      onComplete(aiProcessedData);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setProcessingAudio(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Tell Us What Happened
      </ThemedText>
      
      <ThemedText style={styles.instructions}>
        Press the microphone and describe the incident in your own words. 
        Our AI will help fill out the claim details automatically.
      </ThemedText>
      
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording && styles.recordingButton
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <IconSymbol 
          name={isRecording ? "stop.fill" : "mic.fill"} 
          size={36} 
          color="#FFFFFF" 
        />
        <ThemedText style={styles.recordButtonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </ThemedText>
      </TouchableOpacity>
      
      {processingAudio && (
        <ThemedView style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#1F448C" />
          <ThemedText style={styles.processingText}>
            AI is analyzing your report...
          </ThemedText>
        </ThemedView>
      )}
      
      {transcript && (
        <ThemedView style={styles.transcriptContainer}>
          <ThemedText style={styles.transcriptTitle}>AI Processed Report:</ThemedText>
          <ThemedText style={styles.transcriptText}>{transcript}</ThemedText>
        </ThemedView>
      )}
      
      <ThemedText style={styles.tipsText}>
        Tip: Mention what happened, when, where, and which equipment was affected.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  recordButton: {
    backgroundColor: '#1F448C',
    borderRadius: 50,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  recordingButton: {
    backgroundColor: '#E53935',
  },
  recordButtonText: {
    color: 'white',
    marginTop: 8,
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
  },
  transcriptContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginVertical: 16,
  },
  transcriptTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsText: {
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
  },
});