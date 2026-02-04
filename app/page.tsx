'use client';

import { useState, useEffect } from 'react';
import { PropertyInputForm } from '@/components/property-input-form';
import { RenovationDashboard } from '@/components/renovation-dashboard';
import { usePlanStore } from '@/store/use-plan-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { NWMLSFetcher, generateMockPropertyData } from '@/lib/nwmls-fetcher';
import { AFHAnalyzer } from '@/lib/afh-analyzer';
import { PlanGenerator } from '@/lib/plan-generator';
import { getCredentials } from '@/lib/tauri-commands';
import type { PropertyData } from '@/types';

// Check if running in Tauri
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

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
      let property: PropertyData;

      // Step 1: Fetch property data
      if (data.useMock || !isTauri) {
        // Use mock data for development or web mode
        property = generateMockPropertyData(data.mlsNumber);
      } else {
        // Real NWMLS fetch using Playwright
        const credentials = await getCredentials();
        if (!credentials) {
          throw new Error('NWMLS credentials required. Please enter your credentials in settings.');
        }

        const fetcher = new NWMLSFetcher();
        try {
          await fetcher.initialize(credentials);
          
          if (data.mlsNumber) {
            property = await fetcher.fetchByMLS(data.mlsNumber);
          } else if (data.address) {
            property = await fetcher.fetchByAddress(data.address, data.city, data.state);
          } else {
            throw new Error('MLS number or address required');
          }
          
          await fetcher.close();
        } catch (err) {
          await fetcher.close();
          throw err;
        }
      }

      // Step 2: Analyze compliance
      const analyzer = new AFHAnalyzer();
      const issues = analyzer.analyze(property);

      // Step 3: Generate renovation plan
      const generator = new PlanGenerator();
      const plan = generator.generatePlan(property, issues);

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
