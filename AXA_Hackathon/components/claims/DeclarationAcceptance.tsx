import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DeclarationAcceptanceProps {
  onChange: (isSubmittable: boolean) => void;
}

export function DeclarationAcceptance({ onChange }: DeclarationAcceptanceProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);

  const handleTermsChange = (value: boolean) => {
    setAcceptedTerms(value);
    onChange(value && acceptedDeclaration);
  };

  const handleDeclarationChange = (value: boolean) => {
    setAcceptedDeclaration(value);
    onChange(acceptedTerms && value);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Declaration and Terms
      </ThemedText>

      <ThemedText style={styles.instructionText}>
        Before submitting your claim, please read and accept the following declarations:
      </ThemedText>

      <ThemedView style={styles.declarationBox}>
        <ThemedText style={styles.declarationTitle}>Declaration of Truthfulness</ThemedText>
        <ThemedText style={styles.declarationText}>
          I declare that the information provided in this claim is true, accurate, and complete 
          to the best of my knowledge. I understand that providing false information may result 
          in the denial of my claim and potential legal consequences.
        </ThemedText>

        <TouchableOpacity 
          style={styles.checkboxRow}
          onPress={() => handleDeclarationChange(!acceptedDeclaration)}
        >
          <View style={[styles.checkbox, acceptedDeclaration && styles.checkboxChecked]}>
            {acceptedDeclaration && <IconSymbol name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <ThemedText style={styles.checkboxText}>
            I affirm that all information provided is true and complete
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.declarationBox}>
        <ThemedText style={styles.declarationTitle}>Terms and Conditions</ThemedText>
        <ThemedText style={styles.declarationText}>
          By submitting this claim, I agree to AXA's claims processing terms and conditions. 
          I understand that AXA may need to share information with third parties for the 
          purpose of claim assessment and processing. I also acknowledge my obligation to 
          cooperate with any investigation and provide additional information if requested.
        </ThemedText>

        <TouchableOpacity 
          style={styles.checkboxRow}
          onPress={() => handleTermsChange(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <IconSymbol name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <ThemedText style={styles.checkboxText}>
            I accept the terms and conditions related to claims processing
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.noticeContainer}>
        <IconSymbol name="info.circle.fill" size={20} color="#1F448C" />
        <ThemedText style={styles.noticeText}>
          You must accept both declarations before proceeding to submit your claim.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  declarationBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  declarationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F448C',
  },
  declarationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#1F448C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#1F448C',
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 68, 140, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: '#1F448C',
    marginLeft: 8,
    flex: 1,
  },
});