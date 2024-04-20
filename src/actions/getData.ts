'use server';

import { db } from '@/lib/db';

export const getOrders = async () => {
  return await db.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getStocks = async () => {
  return await db.stock.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

export const getPrices = async () => {
  const result = await db.$queryRaw`SELECT 
    symbol,
    MAX(updatedAt) as updatedAt,
    AVG(price) AS price
  FROM 
    Stock
  GROUP BY 
    symbol`;
  return result as any;
};

export const getLogs = async () => {
  return await db.log.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};
