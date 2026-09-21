'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGetTravelSettings, apiUpdateTravelSettings, TravelSettingsPatch } from '@/lib/travel-settings-api';
import { useAuthStore } from '@/stores/AuthStore';
import { useCvConfigStore } from '@/stores/cvConfigStore';

export const travelSettingsQueryKeys = {
  all: (tenantId: string) => ['travel-settings', tenantId] as const,
};

function hydrateStore(settings: Awaited<ReturnType<typeof apiGetTravelSettings>>) {
  const { id, generalDetails, createdAt, updatedAt, ...config } = settings;
  void id;
  void createdAt;
  void updatedAt;
  useCvConfigStore.getState().hydrateSettings({ settings: config, generalDetails });
}

export function useTravelSettings() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenantId) ?? '';
  const settingsQuery = useQuery({
    queryKey: travelSettingsQueryKeys.all(tenantId),
    queryFn: async () => {
      const settings = await apiGetTravelSettings();
      hydrateStore(settings);
      return settings;
    },
    enabled: Boolean(tenantId),
  });
  const updateMutation = useMutation({
    mutationFn: (patch: TravelSettingsPatch) => apiUpdateTravelSettings(patch),
    onSuccess: (settings) => {
      hydrateStore(settings);
      queryClient.setQueryData(travelSettingsQueryKeys.all(tenantId), settings);
    },
  });
  return { settings: settingsQuery.data, isLoading: settingsQuery.isLoading, updateMutation };
}
