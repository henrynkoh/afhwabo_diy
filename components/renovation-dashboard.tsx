'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { RenovationPlan } from '@/types';
import { downloadPlanPDF } from '@/lib/pdf-export';
import { TaskCard } from './task-card';

interface RenovationDashboardProps {
  plan: RenovationPlan;
}

export function RenovationDashboard({ plan }: RenovationDashboardProps) {
  const handleExportPDF = () => {
    const filename = `afh-plan-${plan.property.mlsNumber || plan.property.address.replace(/\s+/g, '-')}.pdf`;
    downloadPlanPDF(plan, filename);
  };

  const criticalIssues = plan.complianceIssues.filter(i => i.severity === 'critical');
  const warnings = plan.complianceIssues.filter(i => i.severity === 'warning');
  const info = plan.complianceIssues.filter(i => i.severity === 'info');

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Renovation Plan</h1>
          <p className="text-muted-foreground mt-1">
            {plan.property.address}, {plan.property.city}, {plan.property.state}
          </p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.summary.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estimated Cost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${plan.summary.totalEstimatedCost.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{plan.summary.criticalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>DIY Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{plan.summary.diyTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plan.property.mlsNumber && (
              <div>
                <p className="text-sm text-muted-foreground">MLS Number</p>
                <p className="font-medium">{plan.property.mlsNumber}</p>
              </div>
            )}
            {plan.property.squareFeet && (
              <div>
                <p className="text-sm text-muted-foreground">Square Feet</p>
                <p className="font-medium">{plan.property.squareFeet.toLocaleString()}</p>
              </div>
            )}
            {plan.property.bedrooms && (
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-medium">{plan.property.bedrooms}</p>
              </div>
            )}
            {plan.property.bathrooms && (
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-medium">{plan.property.bathrooms}</p>
              </div>
            )}
            {plan.property.yearBuilt && (
              <div>
                <p className="text-sm text-muted-foreground">Year Built</p>
                <p className="font-medium">{plan.property.yearBuilt}</p>
              </div>
            )}
            {plan.property.levels && (
              <div>
                <p className="text-sm text-muted-foreground">Levels</p>
                <p className="font-medium">{plan.property.levels}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Issues</CardTitle>
          <CardDescription>
            Issues that must be addressed for DSHS AFH licensing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalIssues.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Critical ({criticalIssues.length})
                </h3>
                <div className="space-y-2">
                  {criticalIssues.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{issue.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {issue.location} • {issue.rule}
                          </p>
                        </div>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warnings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings ({warnings.length})
                </h3>
                <div className="space-y-2">
                  {warnings.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{issue.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {issue.location} • {issue.rule}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-yellow-600">Warning</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {info.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                  <Info className="h-4 w-4" />
                  Information ({info.length})
                </h3>
                <div className="space-y-2">
                  {info.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{issue.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {issue.location} • {issue.rule}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-blue-600">Info</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Renovation Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Renovation Tasks</CardTitle>
          <CardDescription>
            Prioritized list of tasks to complete for AFH compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

