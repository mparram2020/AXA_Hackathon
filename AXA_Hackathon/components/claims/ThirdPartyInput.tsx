import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThirdParty } from '@/types/claims';
import { useClaimStore } from '@/stores/claimStore';

export function ThirdPartyInput() {
  const { draftClaim, addThirdPartyToDraft, removeThirdPartyFromDraft } = useClaimStore();
  const [thirdParty, setThirdParty] = useState<Partial<ThirdParty>>({
    id: '',
    name: '',
    contact: '',
    insuranceInfo: '',
  });

  const handleAddThirdParty = () => {
    if (thirdParty.name && thirdParty.contact) {
      addThirdPartyToDraft({
        ...thirdParty,
        id: Date.now().toString(), // Generate a unique ID
      } as ThirdParty);
      
      // Reset form
      setThirdParty({
        id: '',
        name: '',
        contact: '',
        insuranceInfo: '',
      });
    }
  };

  const handleRemoveThirdParty = (id: string) => {
    removeThirdPartyFromDraft(id);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Add information about any third parties involved in the incident:
      </ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.inputWrapper}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            style={styles.input}
            value={thirdParty.name}
            onChangeText={(text) => setThirdParty({ ...thirdParty, name: text })}
            placeholder="Full name of the person or company"
          />
        </ThemedView>
        
        <ThemedView style={styles.inputWrapper}>
          <ThemedText style={styles.label}>Contact Information</ThemedText>
          <TextInput
            style={styles.input}
            value={thirdParty.contact}
            onChangeText={(text) => setThirdParty({ ...thirdParty, contact: text })}
            placeholder="Phone number or email"
          />
        </ThemedView>
        
        <ThemedView style={styles.inputWrapper}>
          <ThemedText style={styles.label}>Insurance Information (Optional)</ThemedText>
          <TextInput
            style={styles.input}
            value={thirdParty.insuranceInfo}
            onChangeText={(text) => setThirdParty({ ...thirdParty, insuranceInfo: text })}
            placeholder="Insurance company and policy number if known"
          />
        </ThemedView>
        
        <Button
          title="Add Third Party"
          onPress={handleAddThirdParty}
          type="primary"
          disabled={!thirdParty.name || !thirdParty.contact}
          style={styles.addButton}
        />
      </ThemedView>
      
      <ThemedText style={styles.thirdPartiesListTitle}>
        Added Third Parties ({draftClaim?.thirdParties?.length || 0})
      </ThemedText>
      
      {(!draftClaim?.thirdParties || draftClaim.thirdParties.length === 0) ? (
        <ThemedText style={styles.noThirdPartiesText}>
          No third parties added yet
        </ThemedText>
      ) : (
        <FlatList
          data={draftClaim.thirdParties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.thirdPartyCard}>
              <View style={styles.thirdPartyInfo}>
                <ThemedText style={styles.thirdPartyName}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.thirdPartyContact}>
                  {item.contact}
                </ThemedText>
                {item.insuranceInfo && (
                  <ThemedText style={styles.thirdPartyInsurance}>
                    Insurance: {item.insuranceInfo}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveThirdParty(item.id)}
                style={styles.removeButton}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color="#E53935" />
              </TouchableOpacity>
            </ThemedView>
          )}
          style={styles.thirdPartiesList}
          contentContainerStyle={{ gap: 8 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666666',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    marginTop: 12,
  },
  thirdPartiesListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noThirdPartiesText: {
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  thirdPartiesList: {
    maxHeight: 300,
  },
  thirdPartyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  thirdPartyInfo: {
    flex: 1,
  },
  thirdPartyName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  thirdPartyContact: {
    fontSize: 14,
    color: '#666666',
  },
  thirdPartyInsurance: {
    fontSize: 14,
    color: '#1F448C',
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
});