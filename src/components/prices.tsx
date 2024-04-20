import { getPrices } from '@/actions/getData';
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

export const Prices = () => {
  const {
    data: prices,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: async () => await getPrices(),
    queryKey: ['prices'],
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
        <CardTitle>Prices</CardTitle>
        <CardDescription>
          A list of all stocks with recent prices
        </CardDescription>
      </CardHeader>
      {isLoading ? (
        <div className="text-center mt-12">Fetching prices...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Average Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-[400px] overflow-auto">
            {prices?.map((price: any) => (
              <TableRow className="h-14" key={price.symbol}>
                <TableCell className="font-medium">{price.symbol}</TableCell>
                <TableCell>
                  {new Date(Number(price.updatedAt))
                    .toISOString()
                    .split('T')[0] +
                    ' ' +
                    new Date(Number(price.updatedAt))
                      .toISOString()
                      .split('T')[1]
                      .split('.')[0]}
                </TableCell>
                <TableCell>${price.price?.toFixed(2) ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total:</TableCell>
              <TableCell className="text-right">
                {prices?.length} Price Entries
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
};
