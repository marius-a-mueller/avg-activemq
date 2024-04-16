'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { test } from '@/lib/broker';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export default function Page() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex justify-center items-center">
      <Card className="h-[600px] w-[800px] mt-20">
        <CardHeader>
          <CardTitle>Stock Message Broker</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={() => fetch('/api/stockmarket')}>Start Stockmarket</Button>
          <Button onClick={() => fetch('/api/stockmarketservice')}>Start StockMarketService</Button>
          <Button onClick={() => fetch('/api/stockholder')}>Start Stockholder</Button>
        </CardContent>
      </Card>
    </div>
  );
}
