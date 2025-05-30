export const generateTransactionId = (): string => {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 10000);
  return `TXN-${timestamp}-${random}`;
};