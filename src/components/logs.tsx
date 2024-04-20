import { getLogs } from '@/actions/getData';
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

export const Logs = () => {
  const {
    data: logs,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: async () => await getLogs(),
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
        <CardTitle>Logs</CardTitle>
        <CardDescription>A list of the most recent logs</CardDescription>
      </CardHeader>
      {isLoading ? (
        <div className="text-center mt-12">Fetching logs...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[500px]">Log Info</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-[400px] overflow-auto">
            {logs?.map((log) => {
              return (
                <TableRow className="h-14" key={log.id}>
                  <TableCell className="font-medium">{log.text}</TableCell>
                  <TableCell>
                    {log.createdAt.toISOString().split('T')[0] +
                      ' ' +
                      log.createdAt.toISOString().split('T')[1].split('.')[0]}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total:</TableCell>
              <TableCell className="text-right">{logs?.length} Logs</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
};
