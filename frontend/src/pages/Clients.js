import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Clients() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
          Clients
        </h1>
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Your Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Client management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
