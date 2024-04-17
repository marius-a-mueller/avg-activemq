'use client';

import { Button } from './ui/button';

export const Control = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => fetch('/api/stockmarket')}>
        Start Stockmarket
      </Button>
      <Button onClick={() => fetch('/api/stockmarketservice')}>
        Start StockMarketService
      </Button>
      <Button onClick={() => fetch('/api/stockholder')}>
        Start Stockholder
      </Button>
      <Button onClick={() => fetch('/api/reset')}>RESET</Button>
    </div>
  );
};
