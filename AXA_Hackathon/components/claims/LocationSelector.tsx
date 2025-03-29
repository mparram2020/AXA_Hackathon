import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
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
        'Permiso requerido',
        'Por favor, permite el acceso a la ubicación para usar esta función.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Configuración',
            onPress: () => {
              Location.requestForegroundPermissionsAsync();
            },
          },
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      // Get address from coordinates
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const formattedAddress = [
        addressResult.street,
        addressResult.city,
        addressResult.region,
        addressResult.postalCode,
        addressResult.country,
      ]
        .filter(Boolean)
        .join(', ');

      setAddress(formattedAddress);

      onChange({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: formattedAddress,
      });
    } catch (error) {
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación actual. Por favor, inténtalo de nuevo o ingresa la ubicación manualmente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    onChange({
      ...value,
      address: text,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.addressContainer}>
          <TextInput
            style={styles.addressInput}
            placeholder="Ingresa la dirección o ubicación"
            value={address}
            onChangeText={handleAddressChange}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textSecondary}
          />
        </ThemedView>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <IconSymbol name="location.fill" size={18} color={Colors.white} />
              <ThemedText style={styles.locationButtonText}>Usar ubicación actual</ThemedText>
            </>
          )}
        </TouchableOpacity>

        {value.latitude && value.longitude && (
          <ThemedView style={styles.coordinatesContainer}>
            <ThemedText style={styles.coordinatesText}>
              Latitud: {value.latitude.toFixed(6)}
            </ThemedText>
            <ThemedText style={styles.coordinatesText}>
              Longitud: {value.longitude.toFixed(6)}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedText style={styles.note}>
          Nota: Proporcionar información precisa de la ubicación nos ayuda a procesar tu reclamo de manera más eficiente.
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    ...Fonts.title,
    marginBottom: 8,
    textAlign: 'center',
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.white,
  },
  addressInput: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: Colors.textPrimary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  locationButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  coordinatesContainer: {
    backgroundColor: 'rgba(31, 68, 140, 0.05)',
    borderRadius: 12,
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
    textAlign: 'center',
  },
});