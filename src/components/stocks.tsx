import { getStocks } from '@/actions/getData';
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

export const Stocks = () => {
  const {
    data: stocks,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: async () => await getStocks(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 200);

    return () => clearInterval(interval);
  });

  return (
    <Card className="max-h-[600px] w-[1000px] overflow-auto">
      <CardHeader className="sticky top-0 bg-background z-10">
        <CardTitle>Stocks</CardTitle>
        <CardDescription>A list of the recent stock data</CardDescription>
      </CardHeader>
      {isLoading ? (
        <div className="text-center mt-12">Fetching stocks...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market ID</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-[400px] overflow-auto">
            {stocks?.map((stock) => (
              <TableRow className="h-14" key={stock.id}>
                <TableCell className="font-medium">{stock.marketId}</TableCell>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>
                  {stock.createdAt.toISOString().split('T')[0] +
                    ' ' +
                    stock.createdAt.toISOString().split('T')[1].split('.')[0]}
                </TableCell>
                <TableCell>${stock.price?.toString() ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total:</TableCell>
              <TableCell className="text-right">
                {stocks?.length} Stocks
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
};
