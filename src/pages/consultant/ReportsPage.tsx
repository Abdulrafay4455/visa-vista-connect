import { motion } from 'framer-motion';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';

export function ReportsPage() {
  return (
    <ConsultantLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Processed', value: '156', icon: Users },
            { title: 'Approval Rate', value: '92%', icon: CheckCircle },
            { title: 'This Month', value: '38', icon: TrendingUp },
            { title: 'Avg. Processing', value: '4.2d', icon: BarChart3 },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="text-accent" size={24} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Monthly Overview</CardTitle></CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart visualization would go here
          </CardContent>
        </Card>
      </motion.div>
    </ConsultantLayout>
  );
}
