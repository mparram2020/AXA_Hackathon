import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ClaimTypeSelection() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <IconSymbol 
          name="chevron.left" 
          size={24} 
          color="#1F448C" 
          onPress={() => router.back()} 
        />
        <ThemedText style={styles.headerTitle}>File a Claim</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>
          Choose how you'd like to file your claim
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          We offer two ways to report your agricultural incident:
        </ThemedText>
        
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('/claims/simplified')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol name="mic.fill" size={24} color="#1F448C" />
            <ThemedText style={styles.optionTitle}>Voice & Photo</ThemedText>
            <ThemedView style={styles.recommendedTag}>
              <ThemedText style={styles.recommendedText}>RECOMMENDED</ThemedText>
            </ThemedView>
          </View>
          
          <View style={styles.iconContainer}>
            <IconSymbol 
              name="waveform.and.mic" 
              size={70} 
              color="#1F448C" 
            />
            <IconSymbol 
              name="camera.fill" 
              size={50} 
              color="#4CAF50" 
              style={styles.secondaryIcon}
            />
          </View>
          
          <ThemedText style={styles.optionDescription}>
            Speak naturally about what happened and take photos. Our AI will fill out the claim for you.
          </ThemedText>
          
          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
              <ThemedText style={styles.benefitText}>Just 3 simple steps</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
              <ThemedText style={styles.benefitText}>No typing required</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
              <ThemedText style={styles.benefitText}>Automatic damage assessment</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, styles.standardOption]} 
          onPress={() => router.push('/claims/new')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol name="doc.text.fill" size={24} color="#666666" />
            <ThemedText style={[styles.optionTitle, styles.standardTitle]}>Standard Form</ThemedText>
          </View>
          
          <View style={[styles.iconContainer, styles.standardIconContainer]}>
            <IconSymbol 
              name="doc.text.fill" 
              size={70} 
              color="#666666" 
            />
          </View>
          
          <ThemedText style={styles.optionDescription}>
            Fill out a detailed form with all the information about your claim step by step.
          </ThemedText>
          
          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
              <IconSymbol name="info.circle.fill" size={20} color="#1F448C" />
              <ThemedText style={styles.benefitText}>Complete at your own pace</ThemedText>
            </View>
            <View style={styles.benefitRow}>
              <IconSymbol name="info.circle.fill" size={20} color="#1F448C" />
              <ThemedText style={styles.benefitText}>More detailed information</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflowY: 'scroll',
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1F448C',
  },
  standardOption: {
    borderColor: '#E0E0E0',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1F448C',
  },
  standardTitle: {
    color: '#666666',
  },
  recommendedTag: {
    backgroundColor: '#1F448C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: '100%',
    height: 120,
    marginVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  standardIconContainer: {
    backgroundColor: 'rgba(102, 102, 102, 0.05)',
  },
  secondaryIcon: {
    position: 'absolute',
    bottom: 20,
    right: '30%',
  },
  optionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  benefits: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 14,
  },
});