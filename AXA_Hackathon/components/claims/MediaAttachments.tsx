import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';
import { MediaItem } from '@/types/claims';
import { useClaimStore } from '@/stores/claimStore';

export function MediaAttachments() {
  const { draftClaim, addMediaToDraft, removeMediaFromDraft } = useClaimStore();
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Insufficient Permissions',
        'You need to grant camera and media library permissions to upload media.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!(await requestPermissions())) return;
    
    try {
      setUploadingMedia(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split('/').pop() || 'photo.jpg';
        
        addMediaToDraft({
          id: Date.now().toString(),
          uri: asset.uri,
          type: 'photo',
          fileName,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error(error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;
    
    try {
      setUploadingMedia(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split('/').pop() || 'media.jpg';
        
        addMediaToDraft({
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'photo',
          fileName,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media. Please try again.');
      console.error(error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const pickDocument = async () => {
    try {
      setUploadingMedia(true);
      const result = await DocumentPicker.getDocumentAsync({ 
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        addMediaToDraft({
          id: Date.now().toString(),
          uri: asset.uri,
          type: 'document',
          fileName: asset.name,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
      console.error(error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeMedia = (id: string) => {
    Alert.alert(
      'Remove Attachment',
      'Are you sure you want to remove this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeMediaFromDraft(id) }
      ]
    );
  };

  const renderMediaPreview = (item: MediaItem) => {
    if (item.type === 'photo') {
      return (
        <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
      );
    } else if (item.type === 'video') {
      return (
        <View style={styles.mediaPreview}>
          <IconSymbol name="play.fill" size={30} color="#FFFFFF" />
        </View>
      );
    } else {
      return (
        <View style={styles.mediaPreview}>
          <IconSymbol name="doc.fill" size={30} color="#1F448C" />
        </View>
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.instructionText}>
        Upload photos, videos, or documents that provide evidence of the incident:
      </ThemedText>
      
      <View style={styles.actionButtons}>
        <Button
          title="Take Photo"
          onPress={takePhoto}
          type="secondary"
          disabled={uploadingMedia}
          icon={<IconSymbol name="camera.fill" size={20} color="#1F448C" style={styles.buttonIcon} />}
          style={styles.actionButton}
        />
        <Button
          title="Upload Media"
          onPress={pickImage}
          type="secondary"
          disabled={uploadingMedia}
          icon={<IconSymbol name="photo.on.rectangle" size={20} color="#1F448C" style={styles.buttonIcon} />}
          style={styles.actionButton}
        />
        <Button
          title="Upload Document"
          onPress={pickDocument}
          type="secondary"
          disabled={uploadingMedia}
          icon={<IconSymbol name="doc.fill" size={20} color="#1F448C" style={styles.buttonIcon} />}
          style={styles.actionButton}
        />
      </View>
      
      <ThemedText style={styles.mediaListTitle}>
        Attached Media ({draftClaim?.mediaItems?.length || 0})
      </ThemedText>
      
      {(!draftClaim?.mediaItems || draftClaim.mediaItems.length === 0) ? (
        <ThemedText style={styles.noMediaText}>
          No media attachments added yet
        </ThemedText>
      ) : (
        <FlatList
          data={draftClaim.mediaItems}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.mediaItem} 
              onLongPress={() => removeMedia(item.id)}
            >
              {renderMediaPreview(item)}
              <ThemedText style={styles.mediaFileName} numberOfLines={1}>
                {item.fileName || item.id}
              </ThemedText>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeMedia(item.id)}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color="#E53935" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.mediaGrid}
        />
      )}
      
      <ThemedText style={styles.helpText}>
        Long press on any attachment to remove it
      </ThemedText>
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
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    marginVertical: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  mediaListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noMediaText: {
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mediaGrid: {
    padding: 4,
  },
  mediaItem: {
    flex: 1/3,
    margin: 4,
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaFileName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});