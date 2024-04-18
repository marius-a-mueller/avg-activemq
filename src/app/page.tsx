'use client';

import { Control } from '@/components/control';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Orders } from '@/components/orders';
import { Stocks } from '@/components/stocks';
import { Prices } from '@/components/prices';
import { Logs } from '@/components/logs';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-3xl">Stock Message Broker</h2>
        <ThemeToggle />
      </div>
      <div className="flex gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Control</CardTitle>
            <CardDescription>Control the stock market</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Control />
          </CardContent>
        </Card>

        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="prices">Prices</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Orders />
          </TabsContent>
          <TabsContent value="stocks">
            <Stocks />
          </TabsContent>
          <TabsContent value="prices">
            <Prices />
          </TabsContent>
          <TabsContent value="logs">
            <Logs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
