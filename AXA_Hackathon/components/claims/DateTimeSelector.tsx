import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DateTimeSelectorProps {
  value: string;
  onChange: (dateTime: string) => void;
}

export function DateTimeSelector({ value, onChange }: DateTimeSelectorProps) {
  const [date, setDate] = useState<Date>(value ? new Date(value) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    
    // Update the combined date and time
    onChange(currentDate.toISOString());
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === 'ios');
    setDate(currentTime);
    
    // Update the combined date and time
    onChange(currentTime.toISOString());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>When did the incident occur?</ThemedText>

      <ThemedText style={styles.description}>
        Please select the date and time when the incident took place:
      </ThemedText>
      
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <IconSymbol name="calendar" size={24} color="#1F448C" />
          <View style={styles.dateTimeTextContainer}>
            <ThemedText style={styles.dateTimeLabel}>Date</ThemedText>
            <ThemedText style={styles.dateTimeValue}>
              {value ? formatDate(value) : 'Select date'}
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#7F8C8D" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowTimePicker(true)}
        >
          <IconSymbol name="clock.fill" size={24} color="#1F448C" />
          <View style={styles.dateTimeTextContainer}>
            <ThemedText style={styles.dateTimeLabel}>Time</ThemedText>
            <ThemedText style={styles.dateTimeValue}>
              {value ? formatTime(value) : 'Select time'}
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#7F8C8D" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      {value && (
        <ThemedView style={styles.reminderContainer}>
          <IconSymbol name="exclamationmark.triangle" size={18} color="#FFC107" />
          <ThemedText style={styles.reminderText}>
            Remember: Claims must be reported within 7 days of the incident date.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666666',
  },
  dateTimeContainer: {
    gap: 16,
    marginVertical: 8,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  dateTimeValue: {
    fontSize: 16,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 236, 179, 0.2)',
    borderRadius: 8,
    marginTop: 16,
  },
  reminderText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#5D4037',
    flex: 1,
  },
});