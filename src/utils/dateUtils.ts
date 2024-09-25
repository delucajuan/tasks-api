export const calculateDaysElapsed = (date: Date) => {
  const now = new Date();
  const elapsedTime = now.getTime() - date.getTime();
  return Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
};
