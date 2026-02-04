// Zustand store for renovation plan state management with Supabase sync

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RenovationPlan } from '@/types';
import { savePlanToCloud, loadPlansFromCloud, isCloudSyncEnabled } from '@/lib/supabase-client';

interface PlanStore {
  currentPlan: RenovationPlan | null;
  isLoading: boolean;
  error: string | null;
  cloudSyncEnabled: boolean;
  setPlan: (plan: RenovationPlan, syncToCloud?: boolean) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPlan: () => void;
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      isLoading: false,
      error: null,
      cloudSyncEnabled: isCloudSyncEnabled(),
      
      setPlan: async (plan, syncToCloud = false) => {
        set({ currentPlan: plan, error: null });
        
        // Auto-sync to cloud if enabled and requested
        if (syncToCloud && get().cloudSyncEnabled) {
          try {
            await savePlanToCloud(plan);
          } catch (error) {
            console.error('Failed to sync to cloud:', error);
            // Don't throw - local save succeeded
          }
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      clearPlan: () => set({ currentPlan: null, error: null }),
      
      syncToCloud: async () => {
        const { currentPlan, cloudSyncEnabled } = get();
        if (!cloudSyncEnabled) {
          throw new Error('Cloud sync not enabled');
        }
        if (!currentPlan) {
          throw new Error('No plan to sync');
        }
        
        try {
          await savePlanToCloud(currentPlan);
          set({ error: null });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to sync to cloud';
          set({ error: message });
          throw error;
        }
      },
      
      loadFromCloud: async () => {
        const { cloudSyncEnabled } = get();
        if (!cloudSyncEnabled) {
          throw new Error('Cloud sync not enabled');
        }
        
        try {
          const plans = await loadPlansFromCloud();
          // For now, load the most recent plan
          if (plans && plans.length > 0) {
            const latestPlan = plans[0] as any; // Supabase types are complex, use any for now
            // Convert from Supabase format to RenovationPlan
            const plan: RenovationPlan = {
              property: latestPlan.property_data,
              complianceIssues: latestPlan.compliance_issues,
              tasks: latestPlan.tasks,
              summary: latestPlan.summary,
              generatedAt: new Date(latestPlan.generated_at),
            };
            set({ currentPlan: plan, error: null });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load from cloud';
          set({ error: message });
          throw error;
        }
      },
    }),
    {
      name: 'afh-renovator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        // Don't persist credentials - use Tauri keyring instead
      }),
    }
  )
);

