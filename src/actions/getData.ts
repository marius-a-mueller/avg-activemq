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
      createdAt: 'desc',
    },
  });
};

export const getPrices = async () => {
  return await db.price.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getLogs = async () => {
  return await db.log.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};
