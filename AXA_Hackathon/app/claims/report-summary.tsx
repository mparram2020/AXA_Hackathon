import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReportSummaryScreen() {
  const { photo, transcription, coverageAnalysis } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<'covered' | 'not_covered'>('covered');
  const [expandedCovered, setExpandedCovered] = useState<number | null>(null);
  const [expandedNotCovered, setExpandedNotCovered] = useState<number | null>(null);

  // Parse the coverage analysis JSON with error handling
  let coverageData = [];
  try {
    const parsedCoverageAnalysis =
      typeof coverageAnalysis === 'string'
        ? JSON.parse(decodeURIComponent(coverageAnalysis))
        : coverageAnalysis;

    if (Array.isArray(parsedCoverageAnalysis)) {
      coverageData = parsedCoverageAnalysis;
    } else {
      console.warn('Unexpected coverageAnalysis format:', parsedCoverageAnalysis);
    }
  } catch (error) {
    console.error('Error parsing coverageAnalysis:', error);
  }

  console.log('Coverage Analysis:', coverageData);

  // Separate covered and not covered items
  const coveredItems = coverageData.filter((item: any) => item.is_covered);
  const notCoveredItems = coverageData.filter((item: any) => !item.is_covered);

  const handleFinish = () => {
    router.push('/'); // Return to the home screen
  };

  const toggleCoveredExpansion = (index: number) => {
    setExpandedCovered(expandedCovered === index ? null : index);
  };

  const toggleNotCoveredExpansion = (index: number) => {
    setExpandedNotCovered(expandedNotCovered === index ? null : index);
  };

  const renderItem = (
    item: any,
    index: number,
    isCovered: boolean,
    expanded: boolean,
    toggleExpansion: (i: number) => void
  ) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.coverageItem,
        !isCovered && styles.notCoveredItem,
        expanded && styles.expandedItem,
      ]}
      onPress={() => toggleExpansion(index)}
    >
      <View style={styles.itemHeader}>
        <MaterialCommunityIcons
          name={isCovered ? "check-circle" : "close-circle"}
          size={20}
          color={isCovered ? Colors.success : Colors.danger}
        />
        <ThemedText style={styles.itemTitle}>{item.item}</ThemedText>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textSecondary}
        />
      </View>
      {expanded && (
        <View style={styles.itemDetails}>
          <ThemedText style={styles.itemExplanation}>{item.explanation}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  // Get items based on selected tab
  const currentItems = selectedTab === 'covered' ? coveredItems : notCoveredItems;

  return (
    <View style={styles.mainContainer}>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <MaterialCommunityIcons name="check-circle" size={40} color={Colors.success} />
          <ThemedText style={styles.title}>Reporte Completado</ThemedText>
        </View>

        {/* Photo Section */}
        <View style={styles.card}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>


        {/* Coverage Section with Tabs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-check" size={24} color={Colors.primary} />
            <ThemedText style={styles.subtitle}>Cobertura</ThemedText>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'covered' && styles.activeTabButton,
              ]}
              onPress={() => {
                setSelectedTab('covered');
                setExpandedCovered(null);
              }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  selectedTab === 'covered' && styles.activeTabText,
                ]}
              >
                Cubiertos ({coveredItems.length})
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'not_covered' && styles.activeTabButton,
              ]}
              onPress={() => {
                setSelectedTab('not_covered');
                setExpandedNotCovered(null);
              }}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  selectedTab === 'not_covered' && styles.activeTabText,
                ]}
              >
                No Cubiertos ({notCoveredItems.length})
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.coverageContainer}>
            {currentItems.map((item: any, index: number) => {
              if (selectedTab === 'covered') {
                return renderItem(
                  item,
                  index,
                  true,
                  expandedCovered === index,
                  toggleCoveredExpansion
                );
              } else {
                return renderItem(
                  item,
                  index,
                  false,
                  expandedNotCovered === index,
                  toggleNotCoveredExpansion
                );
              }
            })}
          </View>
        </View>

        <Button
          onPress={handleFinish}
          type="primary"
          style={styles.button}
          icon={<MaterialCommunityIcons name="home" size={24} color={Colors.white} />}
          title="Volver al Inicio"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  title: {
    ...Fonts.title,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    ...Fonts.subtitle,
    marginBottom: 16,
    color: Colors.primary,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coverageContainer: {
    gap: 12,
  },
  coverageItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedItem: {
    borderColor: Colors.primary,
  },
  notCoveredItem: {
    borderColor: Colors.danger,
    borderStyle: 'dashed',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemTitle: {
    ...Fonts.body,
    flex: 1,
    fontWeight: '500',
  },
  itemExplanation: {
    ...Fonts.caption,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Fonts.body,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
});