import { calculateDaysElapsed } from './dateUtils';

describe('calculateDaysElapsed', () => {
  it('should return 0 when the date is today', () => {
    const today = new Date();
    const result = calculateDaysElapsed(today);
    expect(result).toBe(0);
  });

  it('should return the correct number of days for a date in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
    const result = calculateDaysElapsed(pastDate);
    expect(result).toBe(5);
  });
});
