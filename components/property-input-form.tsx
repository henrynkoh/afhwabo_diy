'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Home } from 'lucide-react';

interface PropertyInputFormProps {
  onGenerate: (data: { mlsNumber?: string; address?: string; city?: string; state?: string; useMock?: boolean }) => void;
  isLoading: boolean;
}

export function PropertyInputForm({ onGenerate, isLoading }: PropertyInputFormProps) {
  const [inputType, setInputType] = useState<'mls' | 'address'>('mls');
  const [mlsNumber, setMlsNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Seattle');
  const [state, setState] = useState('WA');
  const [useMock, setUseMock] = useState(true); // Default to mock for development

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === 'mls' && mlsNumber) {
      onGenerate({ mlsNumber, useMock });
    } else if (inputType === 'address' && address) {
      onGenerate({ address, city, state, useMock });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Home className="h-6 w-6" />
          AFH Renovator Pro
        </CardTitle>
        <CardDescription>
          Enter property information to generate a customized AFH renovation plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={inputType === 'mls' ? 'default' : 'outline'}
              onClick={() => setInputType('mls')}
            >
              MLS Number
            </Button>
            <Button
              type="button"
              variant={inputType === 'address' ? 'default' : 'outline'}
              onClick={() => setInputType('address')}
            >
              Address
            </Button>
          </div>

          {inputType === 'mls' ? (
            <div className="space-y-2">
              <Label htmlFor="mls">MLS Number</Label>
              <Input
                id="mls"
                type="text"
                placeholder="e.g., 9876543"
                value={mlsNumber}
                onChange={(e) => setMlsNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="e.g., 1234 Example St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useMock"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
              disabled={isLoading}
              className="rounded"
            />
            <Label htmlFor="useMock" className="text-sm font-normal">
              Use mock data (for testing without NWMLS credentials)
            </Label>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> In production, you'll need NWMLS broker credentials. 
              Mock data is enabled by default for development.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              'Generate Renovation Plan'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

