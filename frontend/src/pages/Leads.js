import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Leads() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
          Leads
        </h1>
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Your Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Lead management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
