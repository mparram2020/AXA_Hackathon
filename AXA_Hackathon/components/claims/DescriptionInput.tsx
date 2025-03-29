import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface DescriptionInputProps {
  value: string;
  onChange: (description: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const minLength = 10;
  const characterCount = value.length;
  const isValidLength = characterCount >= minLength;
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Describe what happened
      </ThemedText>
      
      <ThemedText style={styles.instructions}>
        Please provide a detailed description of the incident. Include:
      </ThemedText>
      
      <ThemedView style={styles.bulletPoints}>
        <ThemedText style={styles.bulletPoint}>• What happened and how</ThemedText>
        <ThemedText style={styles.bulletPoint}>• The circumstances surrounding the incident</ThemedText>
        <ThemedText style={styles.bulletPoint}>• Any visible damage or consequences</ThemedText>
        <ThemedText style={styles.bulletPoint}>• Any action you've taken since the incident</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder="Describe what happened in detail..."
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </ThemedView>
      
      <ThemedText style={[
        styles.charCount,
        !isValidLength && styles.invalidCount
      ]}>
        {characterCount}/{minLength} characters minimum
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
  },
  bulletPoints: {
    marginVertical: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555555',
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  textInput: {
    fontSize: 16,
    minHeight: 160,
  },
  charCount: {
    fontSize: 12,
    color: '#666666',
    alignSelf: 'flex-end',
  },
  invalidCount: {
    color: '#E53935',
  },
});