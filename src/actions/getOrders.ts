'use server';

import { db } from '@/lib/db';

export const getOrders = async () => {
  return await db.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};
