import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/appointments`, { withCredentials: true });
      setAppointments(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
          Appointments
        </h1>
        {appointments.length === 0 ? (
          <Card className="rounded-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              No appointments scheduled
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt, idx) => (
              <Card key={idx} className="rounded-sm">
                <CardContent className="py-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">Site Visit</div>
                      <div className="text-sm text-muted-foreground">{appt.date} at {appt.time}</div>
                    </div>
                    <div className="px-3 py-1 rounded-sm text-xs bg-accent/10 text-accent h-fit">
                      {appt.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
