import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const connectOptions = {
  host: 'localhost',
  port: 61616,
  connectHeaders: {
    host: '/',
    login: 'artemis',
    passcode: 'artemis',
  },
};
