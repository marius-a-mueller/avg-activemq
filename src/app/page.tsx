'use client';

import { getOrders } from '@/actions/getOrders';
import { Control } from '@/components/control';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Page() {
  const {
    data: orders,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: async () => await getOrders(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col gap-4 p-10">
      <h2 className="font-semibold text-3xl">Stock Message Broker</h2>
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

        <Card className="max-h-[600px] w-[1000px] overflow-auto">
          <CardHeader className="sticky top-0 bg-white z-10">
            <CardTitle>Orders</CardTitle>
            <CardDescription>A list of the recent orders</CardDescription>
          </CardHeader>
          {isLoading ? (
            <div className="text-center mt-12">Fetching orders...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HID</TableHead>
                  <TableHead>OID</TableHead>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Ack</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-[400px] overflow-auto">
                {orders?.map((order) => (
                  <TableRow className="h-14" key={order.id}>
                    <TableCell className="font-medium">
                      {order.stockholderId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.symbol}
                    </TableCell>
                    <TableCell>
                      {order.createdAt.toISOString().split('T')[0] +
                        ' ' +
                        order.createdAt.toISOString().split('T')[1].split('.')[0]}
                    </TableCell>
                    <TableCell>{order.price.toString()}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{String(order.ack)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total:</TableCell>
                  <TableCell className="text-right">
                    {orders?.length} Orders
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
