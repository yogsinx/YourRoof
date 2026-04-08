import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
          Analytics
        </h1>
        <Card className="rounded-sm border-border/40">
          <CardHeader>
            <CardTitle>Your Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detailed analytics and insights coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
