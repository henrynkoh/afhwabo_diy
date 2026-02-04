'use client';

import { useState } from 'react';
import { PropertyInputForm } from '@/components/property-input-form';
import { RenovationDashboard } from '@/components/renovation-dashboard';
import { usePlanStore } from '@/store/use-plan-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const { currentPlan, setPlan, isLoading, setLoading, error, setError } = usePlanStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (data: {
    mlsNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    useMock?: boolean;
  }) => {
    setIsGenerating(true);
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch property data (using API route - server-side only)
      const fetchResponse = await fetch('/api/fetch-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(errorData.error || 'Failed to fetch property data');
      }

      const { property } = await fetchResponse.json();

      // Step 2: Generate renovation plan (using API route - server-side only)
      const planResponse = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property }),
      });

      if (!planResponse.ok) {
        const errorData = await planResponse.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const { plan } = await planResponse.json();
      setPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating plan:', err);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!currentPlan ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <PropertyInputForm onGenerate={handleGenerate} isLoading={isGenerating} />
            {error && (
              <Alert variant="destructive" className="mt-4 max-w-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div>
            <RenovationDashboard plan={currentPlan} />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  usePlanStore.getState().clearPlan();
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Generate New Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
