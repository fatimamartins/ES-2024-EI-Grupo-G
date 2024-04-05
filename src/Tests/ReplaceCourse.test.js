import { doesDayMatch } from '../lib/replaceCourse'; // Replace with the correct path to the replaceCourse.js file
import dayjs from 'dayjs';

describe('doesDayMatch', () => {
    it('returns true when slot matches inclusion rules', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05') // Assuming April 5th, 2024
            }
        };

        // Define a slot that matches the inclusion rules
        const slot = {
            'Data da aula': '05/04/2024' // Assuming the same date format
        };

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot);

        // Assert that the result is true
        expect(result).toBe(true);
    });

    it('returns false when slot does not match inclusion rules', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05') // Assuming April 5th, 2024
            }
        };

        // Define a slot that does not match the inclusion rules
        const slot = {
            'Data da aula': '06/04/2024' // Assuming a different date
        };

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot);

        // Assert that the result is false
        expect(result).toBe(false);
    });

    it('returns false when rulesToInclude data value is not provided', () => {
        // Define inclusion rules without data value
        const rulesToInclude = {};

        // Define a slot
        const slot = {
            'Data da aula': '05/04/2024' // Assuming the same date format
        };

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot);

        // Assert that the result is false
        expect(result).toBe(false);
    });

    it('returns false when slot data is not provided', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05') // Assuming April 5th, 2024
            }
        };

        // Define a slot without data
        const slot = {};

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot);

        // Assert that the result is false
        expect(result).toBe(false);
    });
});
