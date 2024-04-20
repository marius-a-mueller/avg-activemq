import { getOrders } from '@/actions/getData';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Orders = () => {
  const {
    data: orders,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: async () => await getOrders(),
    queryKey: ['orders'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <Card className="max-h-[600px] w-[1000px] overflow-auto">
      <CardHeader className="sticky top-0 bg-background z-10">
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
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell className="font-medium">{order.symbol}</TableCell>
                <TableCell>
                  {order.createdAt.toISOString().split('T')[0] +
                    ' ' +
                    order.createdAt.toISOString().split('T')[1].split('.')[0]}
                </TableCell>
                <TableCell>${order.price?.toFixed(2) ?? 'N/A'}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{String(order.ack)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total:</TableCell>
              <TableCell className="text-right">
                {orders?.length} Orders
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
};
