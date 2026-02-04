'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hammer, Wrench, DollarSign, Clock, MapPin, FileText } from 'lucide-react';
import type { RenovationTask } from '@/types';

interface TaskCardProps {
  task: RenovationTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <Badge className={priorityColors[task.priority]}>
                {task.priority.toUpperCase()}
              </Badge>
              {task.diyFriendly ? (
                <Badge variant="outline" className="border-green-600">
                  <Hammer className="h-3 w-3 mr-1" />
                  DIY
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-600">
                  <Wrench className="h-3 w-3 mr-1" />
                  Professional
                </Badge>
              )}
              {task.requiresPermit && (
                <Badge variant="outline" className="border-purple-600">
                  <FileText className="h-3 w-3 mr-1" />
                  Permit Required
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Location:</span>
            <span>{task.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cost:</span>
            <span>${task.estimatedCost.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Time:</span>
            <span>{task.estimatedTime}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Category:</span>
            <span className="ml-2">{task.category}</span>
          </div>
        </div>

        {task.materials.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Materials Needed:</p>
            <div className="flex flex-wrap gap-2">
              {task.materials.map((material, idx) => (
                <Badge key={idx} variant="secondary">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {task.visualPlacement && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-1">Placement Notes:</p>
            <p className="text-sm text-muted-foreground">{task.visualPlacement}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

