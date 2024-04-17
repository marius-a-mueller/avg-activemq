'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
export default function Page() {
  const [message] = useState('');

  return (
    <div className="flex justify-center items-center">
      <Card className="h-[600px] w-[800px] mt-20">
        <CardHeader>
          <CardTitle>Stock Message Broker</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-2">
          <Button className="flex-1" onClick={() => fetch('/api/stockmarket')}>Start Stockmarket</Button>
          <Button className="flex-1" onClick={() => fetch('/api/stockmarketservice')}>Start StockMarketService</Button>
          <Button className="flex-1" onClick={() => fetch('/api/stockholder')}>Start Stockholder</Button>
          <Button className="flex-2" onClick={() => fetch('/api/reset')}>RESET</Button>
        </CardContent>
      </Card>
    </div>
  );
}
