'use client';

import { useQuery } from '@tanstack/react-query';
import { assignmentsApi } from '@/lib/api/assignments';

export function useUtilization() {
  const { data: utilization = [], isLoading } = useQuery({
    queryKey: ['utilization'],
    queryFn: assignmentsApi.getUtilization,
  });

  return {
    utilization,
    isLoading,
  };
}
