import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors, Fonts } from '@/constants/theme';

interface LocationSelectorProps {
  value: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  onChange: (location: {
    latitude?: number;
    longitude?: number;
    address?: string;
  }) => void;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(value.address || '');
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Check for location permission when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    })();
  }, []);

  const getCurrentLocation = async () => {
    if (!hasLocationPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow location access to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings',
            onPress: () => {
              // Ideally open settings, but for now just request again
              Location.requestForegroundPermissionsAsync();
            }
          }
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      
      // Get address from coordinates
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      
      const formattedAddress = [
        addressResult.street,
        addressResult.city,
        addressResult.region,
        addressResult.postalCode,
        addressResult.country
      ].filter(Boolean).join(', ');
      
      setAddress(formattedAddress);
      
      onChange({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: formattedAddress
      });
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or enter the location manually.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    onChange({
      ...value,
      address: text
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Where did it happen?</ThemedText>
      
      <ThemedView style={styles.addressContainer}>
        <TextInput
          style={styles.addressInput}
          placeholder="Enter the address or location"
          value={address}
          onChangeText={handleAddressChange}
          multiline
          numberOfLines={3}
        />
      </ThemedView>
      
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={getCurrentLocation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <IconSymbol name="location.fill" size={18} color="#FFFFFF" />
            <ThemedText style={styles.locationButtonText}>
              Use Current Location
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
      
      {value.latitude && value.longitude && (
        <ThemedView style={styles.coordinatesContainer}>
          <ThemedText style={styles.coordinatesText}>
            Latitude: {value.latitude.toFixed(6)}
          </ThemedText>
          <ThemedText style={styles.coordinatesText}>
            Longitude: {value.longitude.toFixed(6)}
          </ThemedText>
        </ThemedView>
      )}
      
      <ThemedText style={styles.note}>
        Note: Providing accurate location information helps us process your claim more efficiently.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  title: {
    ...Fonts.title,
    marginBottom: 8,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
  },
  addressInput: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  locationButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  coordinatesContainer: {
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  coordinatesText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
});