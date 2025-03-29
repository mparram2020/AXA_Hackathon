import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Claim, ClaimStatus, MediaItem, ThirdParty, Vehicle } from '@/types/claims';

interface ClaimState {
  activeClaims: Claim[];
  draftClaim: Claim | null;
  
  // Draft claim management
  initDraftClaim: () => void;
  updateDraftClaim: (updates: Partial<Claim>) => void;
  addMediaToDraft: (media: MediaItem) => void;
  removeMediaFromDraft: (mediaId: string) => void;
  addVehicleToDraft: (vehicle: Vehicle) => void;
  removeVehicleFromDraft: (vehicleId: string) => void;
  addThirdPartyToDraft: (thirdParty: ThirdParty) => void;
  removeThirdPartyFromDraft: (thirdPartyId: string) => void;
  
  // Claim submission
  submitClaim: () => Promise<string>;
  
  // Claim management
  getClaim: (id: string) => Claim | undefined;
  updateClaimStatus: (id: string, status: ClaimStatus) => void;
}

export const useClaimStore = create<ClaimState>()(
  persist(
    (set, get) => ({
      activeClaims: [],
      draftClaim: null,
      
      initDraftClaim: () => {
        const newClaim: Claim = {
          id: `draft-${Date.now()}`,
          userId: 'current-user', // This would come from authentication
          policyId: 'GA-123456789',
          createdAt: new Date().toISOString(),
          status: 'draft',
          eventType: 'agricultural_vehicle_accident',
          eventDate: new Date().toISOString(),
          eventLocation: {},
          description: '',
          vehicles: [],
          thirdParties: [],
          mediaItems: [],
          policeReport: {
            filed: false
          },
          isSubmittable: false
        };
        
        set({ draftClaim: newClaim });
      },
      
      updateDraftClaim: (updates) => {
        set(state => {
          if (!state.draftClaim) return state;
          
          const updated = {
            ...state.draftClaim,
            ...updates
          };
          
          // Determine if claim is submittable (basic validation)
          const isSubmittable = Boolean(
            updated.eventType && 
            updated.eventDate && 
            updated.description &&
            (updated.eventLocation.address || 
              (updated.eventLocation.latitude && updated.eventLocation.longitude))
          );
          
          return {
            draftClaim: {
              ...updated,
              isSubmittable
            }
          };
        });
      },
      
      addMediaToDraft: (media) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              mediaItems: [...state.draftClaim.mediaItems, media]
            }
          };
        });
      },
      
      removeMediaFromDraft: (mediaId) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              mediaItems: state.draftClaim.mediaItems.filter(m => m.id !== mediaId)
            }
          };
        });
      },
      
      addVehicleToDraft: (vehicle) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              vehicles: [...state.draftClaim.vehicles, vehicle]
            }
          };
        });
      },
      
      removeVehicleFromDraft: (vehicleId) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              vehicles: state.draftClaim.vehicles.filter(v => v.id !== vehicleId)
            }
          };
        });
      },
      
      addThirdPartyToDraft: (thirdParty) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              thirdParties: [...state.draftClaim.thirdParties, thirdParty]
            }
          };
        });
      },
      
      removeThirdPartyFromDraft: (thirdPartyId) => {
        set(state => {
          if (!state.draftClaim) return state;
          return {
            draftClaim: {
              ...state.draftClaim,
              thirdParties: state.draftClaim.thirdParties.filter(tp => tp.id !== thirdPartyId)
            }
          };
        });
      },
      
      submitClaim: async () => {
        const { draftClaim } = get();
        if (!draftClaim || !draftClaim.isSubmittable) {
          throw new Error('Claim is not ready for submission');
        }
        
        // This would be an API call in a real application
        const reference = `AXA-${Math.floor(Math.random() * 1000000)}`;
        
        const submittedClaim: Claim = {
          ...draftClaim,
          id: `claim-${Date.now()}`,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          reference
        };
        
        set(state => ({
          activeClaims: [...state.activeClaims, submittedClaim],
          draftClaim: null
        }));
        
        return reference;
      },
      
      getClaim: (id) => {
        return get().activeClaims.find(claim => claim.id === id);
      },
      
      updateClaimStatus: (id, status) => {
        set(state => ({
          activeClaims: state.activeClaims.map(claim => 
            claim.id === id ? { ...claim, status } : claim
          )
        }));
      }
    }),
    {
      name: 'claim-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);