/**
 * @fileoverview Project not found screen
 * @module ProjectNotFound
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

export function ProjectNotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📁</span>
          </div>
          <CardTitle className="text-2xl">Project not found</CardTitle>
          <CardDescription>
            A project with this ID does not exist or has been deleted
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => setLocation('/')}
          >
            <i className="fas fa-list mr-2"></i>
            Back to projects
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation('/')}
          >
            <i className="fas fa-plus mr-2"></i>
            Create a new project
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
          >
            Go to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
