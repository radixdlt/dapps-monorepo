import { getDateParts } from "./DateAndTxIdColumn.svelte";

describe('getDateParts', () => {
    const testCases = [
      {
        dateString: '2024-08-01T07:26:02.821Z',
        result: {
          year: '2024',
          month: 'August',
          day: '01',
          hours: '07',
          minutes: '26'
        }
      },
      {
        dateString: '2024-07-31T22:31:42.812Z',
        result: {
          year: '2024',
          month: 'July',
          day: '31',
          hours: '22',
          minutes: '31'
        }
      },
      {
        dateString: '2024-12-31T23:31:42.812Z',
        result: {
          year: '2024',
          month: 'December',
          day: '31',
          hours: '23',
          minutes: '31'
        }
      }
    ]
    it('should return the correct date parts', () => {
        testCases.forEach(({ dateString, result }) => {
            const { year, month, day, hours, minutes } =
              getDateParts(dateString)
            expect(year).toBe(result.year);
            expect(month).toBe(result.month);
            expect(day).toBe(result.day);
            expect(hours).toBe(result.hours);
            expect(minutes).toBe(result.minutes);
        });
    });
})