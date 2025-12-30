import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Mail, Clock, HelpCircle } from 'lucide-react';

import { ApplicantLayout } from '@/components/layouts/ApplicantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const messages = [
  {
    id: '1',
    sender: 'consultant',
    name: 'Sarah Johnson',
    message: 'Hello! I\'ve reviewed your application. Everything looks good so far. Just need the bank statement.',
    time: '10:30 AM',
  },
  {
    id: '2',
    sender: 'user',
    message: 'Thank you! I\'ll upload the bank statement today.',
    time: '10:45 AM',
  },
  {
    id: '3',
    sender: 'consultant',
    name: 'Sarah Johnson',
    message: 'Great! Once you upload it, I\'ll review and forward your application to the embassy.',
    time: '10:47 AM',
  },
];

const faqs = [
  {
    question: 'How long does visa processing take?',
    answer: 'Processing time varies by country, typically 5-15 business days.',
  },
  {
    question: 'What documents do I need?',
    answer: 'Generally: passport, photo, bank statements, and travel itinerary.',
  },
  {
    question: 'Can I track my application?',
    answer: 'Yes, use the Track Application page for real-time status updates.',
  },
];

export function SupportPage() {
  const [newMessage, setNewMessage] = useState('');

  return (
    <ApplicantLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Support</h1>
          <p className="text-muted-foreground mt-1">Get help with your visa applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={18} />
                Chat with Consultant
              </CardTitle>
              <CardDescription>Your assigned consultant: Sarah Johnson</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="h-[400px] overflow-y-auto space-y-4 mb-4 p-4 bg-secondary/30 rounded-xl">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border border-border'
                    } rounded-2xl p-3`}>
                      {msg.sender === 'consultant' && (
                        <p className="text-xs font-medium text-accent mb-1">{msg.name}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                      }`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button variant="hero">
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Phone className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">support@visagate.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hours</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9AM - 6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle size={18} />
                  Quick Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm font-medium mb-1">{faq.question}</p>
                    <p className="text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </ApplicantLayout>
  );
}
