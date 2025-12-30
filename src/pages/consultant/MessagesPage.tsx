import { motion } from 'framer-motion';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function MessagesPage() {
  return (
    <ConsultantLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Conversations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {['John Smith', 'Sarah Johnson', 'Michael Brown'].map((name) => (
                <div key={name} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer">
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">Last message...</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Chat with John Smith</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px] bg-secondary/30 rounded-lg mb-4 p-4">
                <p className="text-sm text-muted-foreground text-center">Select a conversation</p>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button variant="hero"><Send size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </ConsultantLayout>
  );
}
