import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function InsuranceOffer({ offer, onStartOver }) {
  // Format the price with commas and decimals
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(offer.monthlyPrice);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.resultTitle}>Your Custom Insurance Offer</ThemedText>
      
      <ThemedView style={styles.summary}>
        <ThemedText style={styles.infoText}>Vehicle: {offer.vehicleType}</ThemedText>
        <ThemedText style={styles.infoText}>Risk Assessment: {offer.riskLevel}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.offerCard}>
        <View style={[styles.planBadge, getPlanBadgeStyle(offer.plan)]}>
          <ThemedText style={styles.planBadgeText}>{offer.plan}</ThemedText>
        </View>
        
        <ThemedText style={styles.price}>{formattedPrice}<ThemedText style={styles.perMonth}>/month</ThemedText></ThemedText>
        
        <ThemedView style={styles.divider} />
        
        <ThemedText style={styles.coverageHeading}>Coverage Includes:</ThemedText>
        <ThemedText style={styles.coverageText}>{offer.coverage}</ThemedText>
        
        <ThemedView style={styles.divider} />
        
        <ThemedText style={styles.recommendationHeading}>Our Recommendation:</ThemedText>
        <ThemedText style={styles.recommendationText}>{offer.recommendation}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.actionButtons}>
        <TouchableOpacity style={styles.purchaseButton}>
          <ThemedText style={styles.purchaseButtonText}>Purchase This Plan</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.startOverButton} onPress={onStartOver}>
          <ThemedText style={styles.startOverText}>Start Over</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

// Helper function to get style based on plan level
function getPlanBadgeStyle(plan) {
  switch (plan) {
    case 'Premium Plus':
      return styles.premiumPlusBadge;
    case 'Premium':
      return styles.premiumBadge;
    default:
      return styles.standardBadge;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  resultTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  summary: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  offerCard: {
    backgroundColor: '#f8f8f8',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  standardBadge: {
    backgroundColor: '#e0f2ff',
  },
  premiumBadge: {
    backgroundColor: '#103184',
  },
  premiumPlusBadge: {
    backgroundColor: '#FF1721',
  },
  planBadgeText: {
    fontWeight: 'bold',
    color: 'white',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#103184', // AXA blue
    marginBottom: 16,
  },
  perMonth: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  coverageHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  coverageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  recommendationHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtons: {
    gap: 16,
  },
  purchaseButton: {
    backgroundColor: '#FF1721', // AXA red
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startOverButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#103184',
  },
  startOverText: {
    color: '#103184',
    fontWeight: 'bold',
    fontSize: 16,
  },
});