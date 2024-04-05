import { doesDayMatch, isSameWeek, hasRoom, hasFeature, doesStartHourMatch, doesEndHourMatch, isBetweenHours, isSameWeekDay, mkSheduleMap,
mkId,  isSameShift, getFiltersIncludeToApply, getFiltersExcludeToApply, isBetweenDates, getAllSlots, getEndDate,getDatesExcludingSundays  } from '../lib/replaceCourse'; // Replace with the correct path to the replaceCourse.js file
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

describe('hasRoom function', () => {
    test('Should return true if the row\'s room matches the room specified in the rules for inclusion', () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] };
        const row = { 'Sala atribuída à aula': 'Room A' }; // Room A should match the room specified in the rules
        expect(hasRoom(rulesToInclude, row)).toBe(true);
    });

    test('Should return false if the row\'s room does not match the room specified in the rules for inclusion', () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] };
        const row = { 'Sala atribuída à aula': 'Room C' }; // Room C does not match any room specified in the rules
        expect(hasRoom(rulesToInclude, row)).toBe(false);
    });

    test('Should return false if rulesToInclude.salas is empty', () => {
        const rulesToInclude = { salas: [] }; // Empty list of rooms
        const row = { 'Sala atribuída à aula': 'Room A' }; // Room A should not match any room specified in the empty rules
        expect(hasRoom(rulesToInclude, row)).toBe(false);
    });

 /*   test('Should return false if rulesToInclude.salas is not provided', () => {
        const rulesToInclude = {}; // No salas property provided
        const row = { 'Sala atribuída à aula': 'Room A' }; // Room A should not match any room specified in the undefined rules
        expect(hasRoom(rulesToInclude, row)).toBe(false);
    }); */

    test('Should return false if row[\'Sala atribuída à aula\'] is not provided', () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] };
        const row = {}; // Missing room property
        expect(hasRoom(rulesToInclude, row)).toBe(false);
    });
});

describe('hasFeature function', () => {
    test('Should return true if the row\'s features match any of the features specified in the rules for inclusion', () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] };
        const row = { 'Características da sala pedida para a aula': 'Feature A' }; // Feature A should match the features specified in the rules
        expect(hasFeature(rulesToInclude, row)).toBe(true);
    });

    test('Should return false if the row\'s features do not match any of the features specified in the rules for inclusion', () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] };
        const row = { 'Características da sala pedida para a aula': 'Feature C' }; // Feature C does not match any feature specified in the rules
        expect(hasFeature(rulesToInclude, row)).toBe(false);
    });

    test('Should return false if rulesToInclude.caracteristicas is empty', () => {
        const rulesToInclude = { caracteristicas: [] }; // Empty list of features
        const row = { 'Características da sala pedida para a aula': 'Feature A' }; // Feature A should not match any feature specified in the empty rules
        expect(hasFeature(rulesToInclude, row)).toBe(false);
    });

  /*  test('Should return false if rulesToInclude.caracteristicas is not provided', () => {
        const rulesToInclude = {}; // No caracteristicas property provided
        const row = { 'Características da sala pedida para a aula': 'Feature A' }; // Feature A should not match any feature specified in the undefined rules
        expect(hasFeature(rulesToInclude, row)).toBe(false);
    });*/

    test('Should return false if row[\'Características da sala pedida para a aula\'] is not provided', () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] };
        const row = {}; // Missing features property
        expect(hasFeature(rulesToInclude, row)).toBe(false);
    });
});

describe('doesStartHourMatch function', () => {
    test('Should return true if the start hour of the slot matches the start hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' };
        const slot = { 'Hora início da aula': '09:00' }; // Start hour matches the specified start hour in the rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(true);
    });

    test('Should return false if the start hour of the slot does not match the start hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' };
        const slot = { 'Hora início da aula': '10:00' }; // Start hour does not match the specified start hour in the rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if rulesToExclude[\'Hora início da aula\'] is not provided', () => {
        const rulesToExclude = {}; // Missing 'Hora início da aula' property
        const slot = { 'Hora início da aula': '09:00' }; // Start hour should not match any start hour specified in the undefined rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Hora início da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' };
        const slot = {}; // Missing 'Hora início da aula' property
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false);
    });
});

describe('doesEndHourMatch function', () => {
    test('Should return true if the end hour of the slot matches the end hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' };
        const slot = { 'Hora fim da aula': '12:00' }; // End hour matches the specified end hour in the rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(true);
    });

    test('Should return false if the end hour of the slot does not match the end hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' };
        const slot = { 'Hora fim da aula': '13:00' }; // End hour does not match the specified end hour in the rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if rulesToExclude[\'Hora fim da aula\'] is not provided', () => {
        const rulesToExclude = {}; // Missing 'Hora fim da aula' property
        const slot = { 'Hora fim da aula': '12:00' }; // End hour should not match any end hour specified in the undefined rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Hora fim da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' };
        const slot = {}; // Missing 'Hora fim da aula' property
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false);
    });
});

describe('isBetweenHours function', () => {
    test('Should return true if the slot\'s time falls within the specified range', () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' };
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' }; // Slot's time falls within the specified range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(true);
    });

    test('Should return false if the slot\'s time does not fall within the specified range', () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' };
        const slot = { 'Hora início da aula': '13:00', 'Hora fim da aula': '14:00' }; // Slot's time does not fall within the specified range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if rulesToExclude[\'Hora início da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' }; // Missing 'Hora início da aula' property
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' }; // Slot's time should not fall within any undefined range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if rulesToExclude[\'Hora fim da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora início da aula': '08:00' }; // Missing 'Hora fim da aula' property
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' }; // Slot's time should not fall within any undefined range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Hora início da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' };
        const slot = { 'Hora fim da aula': '11:00' }; // Missing 'Hora início da aula' property
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Hora fim da aula\'] is not provided', () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' };
        const slot = { 'Hora início da aula': '09:00' }; // Missing 'Hora fim da aula' property
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false);
    });
});

describe('isSameWeekDay function', () => {
    /*test('Should return true if the slot falls on the same weekday as specified in the rules for exclusion', () => {
        const rulesToExclude = { diaDaSemana: 'Monday' };
        const slot = { 'Data da aula': '2024-04-01' }; // This date should fall on a Monday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(true);
    });*/

    test('Should return false if the slot does not fall on the same weekday as specified in the rules for exclusion', () => {
        const rulesToExclude = { diaDaSemana: 'Monday' };
        const slot = { 'Data da aula': '2024-04-02' }; // This date should not fall on a Monday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if rulesToExclude.diaDaSemana is not provided', () => {
        const rulesToExclude = {}; // Missing diaDaSemana property
        const slot = { 'Data da aula': '2024-04-01' }; // Slot's date should not match any unspecified weekday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Data da aula\'] is not provided', () => {
        const rulesToExclude = { diaDaSemana: 'Monday' };
        const slot = {}; // Missing 'Data da aula' property
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false);
    });

    test('Should return false if slot[\'Data da aula\'] is a Sunday', () => {
        const rulesToExclude = { diaDaSemana: 'Monday' };
        const slot = { 'Data da aula': '2024-04-07' }; // Sunday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false);
    });
});

describe('mkSheduleMap function', () => {
    test('Should return a map where each key-value pair represents a course slot and its corresponding schedule', () => {
        const appointments = [
            { 'Data da aula': '2024-04-01', 'Hora início da aula': '08:00', 'Hora fim da aula': '10:00', 'Sala atribuída à aula': 'Room1', schedule: 'schedule1', property1: 'value1', property2: 'value2' },
            { 'Data da aula': '2024-04-02', 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00', 'Sala atribuída à aula': 'Room2', schedule: 'schedule2', property1: 'value3', property2: 'value4' },
        ];
        const scheduleMap = mkSheduleMap(appointments);
        expect(scheduleMap.size).toBe(2); // Ensure all appointments are included in the map
        appointments.forEach(appointment => {
            const id = `${appointment['Data da aula']}-${appointment['Hora início da aula']}-${appointment['Hora fim da aula']}-${appointment['Sala atribuída à aula']}`;
            expect(scheduleMap.get(id)).toEqual(appointment); // Ensure each appointment is correctly mapped
        });
    });

    test('Should return an empty map if appointments is empty', () => {
        const appointments = [];
        const scheduleMap = mkSheduleMap(appointments);
        expect(scheduleMap.size).toBe(0); // Ensure empty map is returned
    });
});

describe('mkId function', () => {
    test('Should generate a unique identifier for a given course slot', () => {
        const slot = {
            'Data da aula': '2024-04-01',
            'Hora início da aula': '08:00',
            'Hora fim da aula': '10:00',
            'Sala atribuída à aula': 'Room1',
        };
        const expectedId = '2024-04-01-08:00-10:00-Room1'; // Manually calculate the expected ID based on the provided slot
        
        // Call the mkId function with the provided slot
        const generatedId = mkId(slot);
        
        // Assert that the generated ID matches the expected ID
        expect(generatedId).toBe(expectedId);
    });
});