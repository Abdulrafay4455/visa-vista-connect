import { motion } from 'framer-motion';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const embassyData = [
  { country: '🇺🇸 USA', count: 5, status: 'Processing' },
  { country: '🇬🇧 UK', count: 3, status: 'Decision pending' },
  { country: '🇨🇦 Canada', count: 4, status: 'Interview scheduled' },
];

export function EmbassyPage() {
  return (
    <ConsultantLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Embassy Tracking</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {embassyData.map((embassy) => (
            <Card key={embassy.country}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe size={18} />{embassy.country}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">{embassy.count}</p>
                <p className="text-sm text-muted-foreground">{embassy.status}</p>
                <Button variant="outline" size="sm" className="mt-4">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </ConsultantLayout>
  );
}
