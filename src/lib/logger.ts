import { db } from './db';

export const getLogger = (name: string): Logger => {
  return {
    info: (message: string) => {
      const text = `[${name}] ${message}`;
      console.log(text);
      logToDb(text);
    },
    error: (message: string) => {
      const text = `[${name}] ${message}`;
      console.error(text);
      logToDb(text);
    },
  };
};

export interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
}

async function logToDb(text: string) {
  const logMessage = {
    text,
  };

  await db.log.create({ data: logMessage });
}
