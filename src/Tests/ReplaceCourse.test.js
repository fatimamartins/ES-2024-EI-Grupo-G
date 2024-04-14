import {
    doesDayMatch,
    isSameWeek,
    hasRoom,
    hasFeature,
    doesStartHourMatch,
    doesEndHourMatch,
    isBetweenHours,
    isSameWeekDay,
    mkSheduleMap,
    mkId,
    isSameShift,
    getFiltersIncludeToApply,
    getFiltersExcludeToApply,
    isBetweenDates,
    getAllSlots,
    getEndDate,
    getDatesExcludingSundays,
} from '../lib/replaceCourse' // Replace with the correct path to the replaceCourse.js file
import dayjs from 'dayjs'
import { getFormattedDateTime } from '../utils'

describe('doesDayMatch', () => {
    it('returns true when slot matches inclusion rules', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'), // Assuming April 5th, 2024
            },
        }

        // Define a slot that matches the inclusion rules
        const slot = {
            'Data da aula': '05/04/2024', // Assuming the same date format
        }

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot)

        // Assert that the result is true
        expect(result).toBe(true)
    })

    it('returns false when slot does not match inclusion rules', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'), // Assuming April 5th, 2024
            },
        }

        // Define a slot that does not match the inclusion rules
        const slot = {
            'Data da aula': '06/04/2024', // Assuming a different date
        }

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })

    it('returns false when rulesToInclude data value is not provided', () => {
        // Define inclusion rules without data value
        const rulesToInclude = {}

        // Define a slot
        const slot = {
            'Data da aula': '05/04/2024', // Assuming the same date format
        }

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })

    it('returns false when slot data is not provided', () => {
        // Define inclusion rules
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'), // Assuming April 5th, 2024
            },
        }

        // Define a slot without data
        const slot = {}

        // Call doesDayMatch function
        const result = doesDayMatch(rulesToInclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })
})

describe('hasRoom function', () => {
    test("Should return true if the row's room matches the room specified in the rules for inclusion", () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] }
        const row = { 'Sala atribuída à aula': 'Room A' } // Room A should match the room specified in the rules
        expect(hasRoom(rulesToInclude, row)).toBe(true)
    })

    test("Should return false if the row's room does not match the room specified in the rules for inclusion", () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] }
        const row = { 'Sala atribuída à aula': 'Room C' } // Room C does not match any room specified in the rules
        expect(hasRoom(rulesToInclude, row)).toBe(false)
    })

    test('Should return false if rulesToInclude.salas is empty', () => {
        const rulesToInclude = { salas: [] } // Empty list of rooms
        const row = { 'Sala atribuída à aula': 'Room A' } // Room A should not match any room specified in the empty rules
        expect(hasRoom(rulesToInclude, row)).toBe(false)
    })

    /*   test('Should return false if rulesToInclude.salas is not provided', () => {
        const rulesToInclude = {}; // No salas property provided
        const row = { 'Sala atribuída à aula': 'Room A' }; // Room A should not match any room specified in the undefined rules
        expect(hasRoom(rulesToInclude, row)).toBe(false);
    }); */

    test("Should return false if row['Sala atribuída à aula'] is not provided", () => {
        const rulesToInclude = { salas: ['Room A', 'Room B'] }
        const row = {} // Missing room property
        expect(hasRoom(rulesToInclude, row)).toBe(false)
    })
})

describe('hasFeature function', () => {
    test("Should return true if the row's features match any of the features specified in the rules for inclusion", () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] }
        const row = { 'Características da sala pedida para a aula': 'Feature A' } // Feature A should match the features specified in the rules
        expect(hasFeature(rulesToInclude, row)).toBe(true)
    })

    test("Should return false if the row's features do not match any of the features specified in the rules for inclusion", () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] }
        const row = { 'Características da sala pedida para a aula': 'Feature C' } // Feature C does not match any feature specified in the rules
        expect(hasFeature(rulesToInclude, row)).toBe(false)
    })

    test('Should return false if rulesToInclude.caracteristicas is empty', () => {
        const rulesToInclude = { caracteristicas: [] } // Empty list of features
        const row = { 'Características da sala pedida para a aula': 'Feature A' } // Feature A should not match any feature specified in the empty rules
        expect(hasFeature(rulesToInclude, row)).toBe(false)
    })

    /*  test('Should return false if rulesToInclude.caracteristicas is not provided', () => {
        const rulesToInclude = {}; // No caracteristicas property provided
        const row = { 'Características da sala pedida para a aula': 'Feature A' }; // Feature A should not match any feature specified in the undefined rules
        expect(hasFeature(rulesToInclude, row)).toBe(false);
    });*/

    test("Should return false if row['Características da sala pedida para a aula'] is not provided", () => {
        const rulesToInclude = { caracteristicas: ['Feature A', 'Feature B'] }
        const row = {} // Missing features property
        expect(hasFeature(rulesToInclude, row)).toBe(false)
    })
})

describe('doesStartHourMatch function', () => {
    test('Should return true if the start hour of the slot matches the start hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' }
        const slot = { 'Hora início da aula': '09:00' } // Start hour matches the specified start hour in the rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(true)
    })

    test('Should return false if the start hour of the slot does not match the start hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' }
        const slot = { 'Hora início da aula': '10:00' } // Start hour does not match the specified start hour in the rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if rulesToExclude['Hora início da aula'] is not provided", () => {
        const rulesToExclude = {} // Missing 'Hora início da aula' property
        const slot = { 'Hora início da aula': '09:00' } // Start hour should not match any start hour specified in the undefined rules
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Hora início da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora início da aula': '09:00' }
        const slot = {} // Missing 'Hora início da aula' property
        expect(doesStartHourMatch(rulesToExclude, slot)).toBe(false)
    })
})

describe('doesEndHourMatch function', () => {
    test('Should return true if the end hour of the slot matches the end hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' }
        const slot = { 'Hora fim da aula': '12:00' } // End hour matches the specified end hour in the rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(true)
    })

    test('Should return false if the end hour of the slot does not match the end hour specified in the rules for exclusion', () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' }
        const slot = { 'Hora fim da aula': '13:00' } // End hour does not match the specified end hour in the rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if rulesToExclude['Hora fim da aula'] is not provided", () => {
        const rulesToExclude = {} // Missing 'Hora fim da aula' property
        const slot = { 'Hora fim da aula': '12:00' } // End hour should not match any end hour specified in the undefined rules
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Hora fim da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' }
        const slot = {} // Missing 'Hora fim da aula' property
        expect(doesEndHourMatch(rulesToExclude, slot)).toBe(false)
    })
})

describe('isBetweenHours function', () => {
    test("Should return true if the slot's time falls within the specified range", () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' }
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' } // Slot's time falls within the specified range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(true)
    })

    test("Should return false if the slot's time does not fall within the specified range", () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' }
        const slot = { 'Hora início da aula': '13:00', 'Hora fim da aula': '14:00' } // Slot's time does not fall within the specified range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if rulesToExclude['Hora início da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora fim da aula': '12:00' } // Missing 'Hora início da aula' property
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' } // Slot's time should not fall within any undefined range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if rulesToExclude['Hora fim da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora início da aula': '08:00' } // Missing 'Hora fim da aula' property
        const slot = { 'Hora início da aula': '09:00', 'Hora fim da aula': '11:00' } // Slot's time should not fall within any undefined range
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Hora início da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' }
        const slot = { 'Hora fim da aula': '11:00' } // Missing 'Hora início da aula' property
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Hora fim da aula'] is not provided", () => {
        const rulesToExclude = { 'Hora início da aula': '08:00', 'Hora fim da aula': '12:00' }
        const slot = { 'Hora início da aula': '09:00' } // Missing 'Hora fim da aula' property
        expect(isBetweenHours(rulesToExclude, slot)).toBe(false)
    })
})

describe('isSameWeekDay function', () => {
    test('Should return false if the slot does not fall on the same weekday as specified in the rules for exclusion', () => {
        const rulesToExclude = { diaDaSemana: 'Monday' }
        const slot = { 'Data da aula': '2024-04-02' } // This date should not fall on a Monday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false)
    })

    test('Should return false if rulesToExclude.diaDaSemana is not provided', () => {
        const rulesToExclude = {} // Missing diaDaSemana property
        const slot = { 'Data da aula': '2024-04-01' } // Slot's date should not match any unspecified weekday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Data da aula'] is not provided", () => {
        const rulesToExclude = { diaDaSemana: 'Monday' }
        const slot = {} // Missing 'Data da aula' property
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false)
    })

    test("Should return false if slot['Data da aula'] is a Sunday", () => {
        const rulesToExclude = { diaDaSemana: 'Monday' }
        const slot = { 'Data da aula': '2024-04-07' } // Sunday
        expect(isSameWeekDay(rulesToExclude, slot)).toBe(false)
    })
})

describe('mkSheduleMap function', () => {
    test('Should return a map where each key-value pair represents a course slot and its corresponding schedule', () => {
        const appointments = [
            {
                'Data da aula': '2024-04-01',
                'Hora início da aula': '08:00',
                'Hora fim da aula': '10:00',
                'Sala atribuída à aula': 'Room1',
                schedule: 'schedule1',
                property1: 'value1',
                property2: 'value2',
            },
            {
                'Data da aula': '2024-04-02',
                'Hora início da aula': '09:00',
                'Hora fim da aula': '11:00',
                'Sala atribuída à aula': 'Room2',
                schedule: 'schedule2',
                property1: 'value3',
                property2: 'value4',
            },
        ]
        const scheduleMap = mkSheduleMap(appointments)
        expect(scheduleMap.size).toBe(2) // Ensure all appointments are included in the map
        appointments.forEach((appointment) => {
            const id = `${appointment['Data da aula']}-${appointment['Hora início da aula']}-${appointment['Hora fim da aula']}-${appointment['Sala atribuída à aula']}`
            expect(scheduleMap.get(id)).toEqual(appointment) // Ensure each appointment is correctly mapped
        })
    })

    test('Should return an empty map if appointments is empty', () => {
        const appointments = []
        const scheduleMap = mkSheduleMap(appointments)
        expect(scheduleMap.size).toBe(0) // Ensure empty map is returned
    })
})

describe('mkId function', () => {
    test('Should generate a unique identifier for a given course slot', () => {
        const slot = {
            'Data da aula': '2024-04-01',
            'Hora início da aula': '08:00',
            'Hora fim da aula': '10:00',
            'Sala atribuída à aula': 'Room1',
        }
        const expectedId = '2024-04-01-08:00-10:00-Room1' // Manually calculate the expected ID based on the provided slot

        // Call the mkId function with the provided slot
        const generatedId = mkId(slot)

        // Assert that the generated ID matches the expected ID
        expect(generatedId).toBe(expectedId)
    })
})

describe('isSameWeek', () => {
    it('returns false when rulesToInclude data value is not provided', () => {
        const rulesToInclude = {
            data: {}, // Placeholder value for data
        }
        const slot = {
            'Data da aula': '2024-01-01', // Slot date doesn't matter for this test
        }
        const result = isSameWeek(rulesToInclude, slot)
        expect(result).toBe(false)
    })

    it('returns false when slot date is not provided', () => {
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'),
            },
        }
        const slot = {}
        const result = isSameWeek(rulesToInclude, slot)
        expect(result).toBe(false)
    })

    it('returns true when slot falls within the same week as specified by the rules', () => {
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'), // Rules specify a date in the first week of the year 2024
            },
        }
        const slot = {
            'Data da aula': '05/04/2024', // Slot falls within the same week as specified by the rules
        }
        const result = isSameWeek(rulesToInclude, slot)
        console.log('Result of test:', result)
        expect(result).toBe(true)
    })

    it('returns false when slot falls outside the same week as specified by the rules', () => {
        const rulesToInclude = {
            data: {
                value: dayjs('2024-04-05'), // Rules specify a date in the first week of the year 2024
            },
        }
        const slot = {
            'Data da aula': '31-12-2023', // Slot falls outside the same week as specified by the rules
        }
        const result = isSameWeek(rulesToInclude, slot)
        expect(result).toBe(false)
    })
})

describe('isSameShift', () => {
    it('returns true when slot falls within the same morning shift', () => {
        // Define exclusion rules for morning shift
        const rulesToExclude = {
            turno: 'Manhã',
        }

        // Define a slot that falls within the morning shift
        const slot = {
            'Hora início da aula': '08:00:00', // Assuming the start hour of the morning shift
        }

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is true
        expect(result).toBe(true)
    })

    it('returns true when slot falls within the same afternoon shift', () => {
        // Define exclusion rules for afternoon shift
        const rulesToExclude = {
            turno: 'Tarde',
        }

        // Define a slot that falls within the afternoon shift
        const slot = {
            'Hora início da aula': '14:00:00', // Assuming the start hour of the afternoon shift
        }

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is true
        expect(result).toBe(true)
    })

    it('returns true when slot falls within the same night shift', () => {
        // Define exclusion rules for night shift
        const rulesToExclude = {
            turno: 'Noite',
        }

        // Define a slot that falls within the night shift
        const slot = {
            'Hora início da aula': '19:00:00', // Assuming the start hour of the night shift
        }

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is true
        expect(result).toBe(true)
    })

    it('returns false when slot does not fall within the same shift', () => {
        // Define exclusion rules for morning shift
        const rulesToExclude = {
            turno: 'Manhã',
        }

        // Define a slot that does not fall within the morning shift
        const slot = {
            'Hora início da aula': '14:00:00', // Assuming the start hour of the afternoon shift
        }

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })

    it('returns false when turno is not specified in rulesToExclude', () => {
        // Define exclusion rules without specifying turno
        const rulesToExclude = {}

        // Define a slot
        const slot = {
            'Hora início da aula': '08:00:00', // Assuming the start hour of the morning shift
        }

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })

    it('returns false when Hora início da aula is not specified in slot', () => {
        // Define exclusion rules for morning shift
        const rulesToExclude = {
            turno: 'Manhã',
        }

        // Define a slot without specifying Hora início da aula
        const slot = {}

        // Call isSameShift function
        const result = isSameShift(rulesToExclude, slot)

        // Assert that the result is false
        expect(result).toBe(false)
    })
})

describe('getFiltersIncludeToApply', () => {
    it('returns an empty array when rulesToInclude is null', () => {
        const rulesToInclude = null
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toEqual([])
    })

    it('returns an empty array when no rules are provided', () => {
        const rulesToInclude = {}
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toEqual([])
    })

    it('returns an array with hasRoom function when salas are provided', () => {
        const rulesToInclude = {
            salas: ['Room1', 'Room2'],
        }
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toContain(hasRoom)
    })

    it('returns an array with hasFeature function when caracteristicas are provided', () => {
        const rulesToInclude = {
            caracteristicas: ['Feature1', 'Feature2'],
        }
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toContain(hasFeature)
    })

    it('returns an array with doesDayMatch function when data.label is "mesmoDia"', () => {
        const rulesToInclude = {
            data: {
                label: 'mesmoDia',
            },
        }
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toContain(doesDayMatch)
    })

    it('returns an array with isSameWeek function when data.label is "mesmaSemana"', () => {
        const rulesToInclude = {
            data: {
                label: 'mesmaSemana',
            },
        }
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toContain(isSameWeek)
    })

    it('returns an array with isBetweenDates function when data.label is "outro"', () => {
        const rulesToInclude = {
            data: {
                label: 'outro',
            },
        }
        const filters = getFiltersIncludeToApply(rulesToInclude)
        expect(filters).toContain(isBetweenDates)
    })
})

describe('getFiltersExcludeToApply', () => {
    it('returns an empty array when rulesToExclude is null', () => {
        const rulesToExclude = null
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toEqual([])
    })

    it('returns an empty array when no rules are provided', () => {
        const rulesToExclude = {}
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toEqual([])
    })

    it('returns an array with doesStartHourMatch function when Hora início da aula is provided but Hora fim da aula is not provided', () => {
        const rulesToExclude = {
            'Hora início da aula': '08:00',
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(doesStartHourMatch)
    })

    it('returns an array with doesEndHourMatch function when Hora fim da aula is provided but Hora início da aula is not provided', () => {
        const rulesToExclude = {
            'Hora fim da aula': '10:00',
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(doesEndHourMatch)
    })

    it('returns an array with isBetweenHours function when both Hora início da aula and Hora fim da aula are provided', () => {
        const rulesToExclude = {
            'Hora início da aula': '08:00',
            'Hora fim da aula': '10:00',
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(isBetweenHours)
    })

    it('returns an array with isSameWeekDay function when diaDaSemana is provided', () => {
        const rulesToExclude = {
            diaDaSemana: 'Monday',
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(isSameWeekDay)
    })

    it('returns an array with isSameShift function when turno is provided', () => {
        const rulesToExclude = {
            turno: 'Manhã',
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(isSameShift)
    })

    it('returns an array with hasRoom function when salas are provided', () => {
        const rulesToExclude = {
            salas: ['Room1', 'Room2'],
        }
        const filters = getFiltersExcludeToApply(rulesToExclude)
        expect(filters).toContain(hasRoom)
    })
})

describe('getAllSlots', () => {
    it('generates all possible slot combinations based on the provided rules for inclusion', () => {
        // Mocking the rulesToInclude object
        const rulesToInclude = {
            data: {
                label: 'outro',
                value: dayjs(getFormattedDateTime('01/04/2024', '08:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' }),
            },
            dataInicio: dayjs(getFormattedDateTime('01/04/2024', '08:00:00', "yyyy-MM-dd'T'HH:mm"), {
                timeZone: 'GMT',
            }), // Example start date, adjust as needed
            dataFim: dayjs(getFormattedDateTime('01/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' }), // Example end date, adjust as needed
            'Sala atribuída à aula': ['Auditório Afonso de Barros'], // Example room, adjust as needed
        }

        // Mocking the expected output
        const expectedCombinationsLength = 52924

        // Call the function with the mocked rulesToInclude
        const generatedCombinations = getAllSlots(rulesToInclude)

        // Assert that the generated combinations match the expected ones
        expect(generatedCombinations.length).toBe(expectedCombinationsLength)
    })
})

describe('getEndDate', () => {
    test('returns the same date if label is "mesmoDia"', () => {
        const rulesToInclude = {
            data: {
                label: 'mesmoDia',
                value: dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' }), // Example date
            },
        }
        expect(getEndDate(rulesToInclude)).toEqual(
            dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' })
        )
    })

    test('calculates the end date correctly for "mesmaSemana"', () => {
        const rulesToInclude = {
            data: {
                label: 'mesmaSemana',
                value: dayjs(getFormattedDateTime('02/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' }), // Example date falling on Tuesday
            },
        }
        // Expected end date should be 6 days after the provided date, i.e., Sunday of the same week
        expect(getEndDate(rulesToInclude)).toEqual(
            dayjs(getFormattedDateTime('06/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' })
        )
    })

    test('returns the provided end date if label is "outro"', () => {
        const rulesToInclude = {
            data: {
                label: 'outro',
            },
            //Todo
            dataFim: dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' }),
        }
        expect(getEndDate(rulesToInclude)).toEqual(
            dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' })
        )
    })

    test('returns the start date if no specific interval is provided', () => {
        const rulesToInclude = {
            dataInicio: dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
                timeZone: 'GMT',
            }),
        }
        expect(getEndDate(rulesToInclude)).toEqual(
            dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), { timeZone: 'GMT' })
        )
    })

    test('returns undefined if no rules are provided', () => {
        expect(getEndDate(undefined)).toBeUndefined()
    })
})

describe('getDatesExcludingSundays', () => {
    test('generates dates excluding Sundays within the same week', () => {
        const startDate = dayjs(getFormattedDateTime('30/03/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Saturday

        const endDate = dayjs(getFormattedDateTime('05/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Friday
        const expectedDates = ['30/03/2024', '01/04/2024', '02/04/2024', '03/04/2024', '04/04/2024', '05/04/2024']
        expect(getDatesExcludingSundays(startDate, endDate)).toEqual(expectedDates)
    })

    test('generates dates excluding Sundays across multiple weeks', () => {
        const startDate = dayjs(getFormattedDateTime('28/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Sunday
        const endDate = dayjs(getFormattedDateTime('12/05/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Sunday
        const expectedDates = [
            '29/04/2024',
            '30/04/2024',
            '01/05/2024',
            '02/05/2024',
            '03/05/2024',
            '04/05/2024',
            '06/05/2024',
            '07/05/2024',
            '08/05/2024',
            '09/05/2024',
            '10/05/2024',
            '11/05/2024',
        ]
        expect(getDatesExcludingSundays(startDate, endDate)).toEqual(expectedDates)
    })

    test('returns single date if start and end dates are the same and not a Sunday', () => {
        const startDate = dayjs(getFormattedDateTime('01/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Monday
        const endDate = dayjs(getFormattedDateTime('01/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Monday
        expect(getDatesExcludingSundays(startDate, endDate)).toEqual(['01/04/2024'])
    })

    test('returns empty arrray if start and end dates are the same and it is a Sunday', () => {
        const startDate = dayjs(getFormattedDateTime('07/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Sunday
        const endDate = dayjs(getFormattedDateTime('07/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        }) // Sunday
        expect(getDatesExcludingSundays(startDate, endDate)).toEqual([])
    })

    test('returns empty array if end date is before start date', () => {
        const startDate = dayjs(getFormattedDateTime('01/04/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        })
        const endDate = dayjs(getFormattedDateTime('30/03/2024', '10:00:00', "yyyy-MM-dd'T'HH:mm"), {
            timeZone: 'GMT',
        })
        expect(getDatesExcludingSundays(startDate, endDate)).toEqual([])
    })
})
