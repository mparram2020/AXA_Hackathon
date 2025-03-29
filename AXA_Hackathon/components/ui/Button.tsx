import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface ButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
}

export function Button({ 
    title, 
    onPress, 
    type = 'primary', 
    disabled = false, 
    loading = false,
    style,
    icon
}: ButtonProps) {
    
    const getBackgroundColor = () => {
        if (disabled) return '#CCCCCC';
        
        switch (type) {
            case 'primary': return '#1F448C';
            case 'secondary': return 'transparent';
            case 'danger': return '#E53935';
            default: return '#1F448C';
        }
    };
    
    const getBorderColor = () => {
        if (disabled) return '#CCCCCC';
        
        switch (type) {
            case 'primary': return '#1F448C';
            case 'secondary': return '#1F448C';
            case 'danger': return '#E53935';
            default: return '#1F448C';
        }
    };
    
    const getTextColor = () => {
        if (disabled) return '#FFFFFF';
        
        switch (type) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return '#1F448C';
            case 'danger': return '#FFFFFF';
            default: return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled || loading} 
            style={[styles.button, { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() }, style]}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <ThemedText style={[styles.text, { color: getTextColor() }]}>
                        {title}
                    </ThemedText>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
