import {
    addWeekNumber,
    addSemesterWeekNumber,
    parseDate,
    parseHour,
    sortDate,
    validateRoomAvailability,
    sortWeekDays,
} from '../utils'
describe('addWeekNumber', () => {
    it('adiciona corretamente o número da semana à data da aula', () => {
        const defaultData = [
            { 'Data da aula': '01/01/2024' },
            { 'Data da aula': '08/01/2024' },
            { 'Data da aula': '15/01/2024' },
        ]

        const expectedData = [
            { 'Data da aula': '01/01/2024', 'Semana do ano': 1 },
            { 'Data da aula': '08/01/2024', 'Semana do ano': 2 },
            { 'Data da aula': '15/01/2024', 'Semana do ano': 3 },
        ]

        const result = addWeekNumber(defaultData)
        expect(result).toEqual(expectedData)
    })

    it('lida corretamente com datas inválidas', () => {
        const defaultData = [{ 'Data da aula': 'data inválida' }, { 'Data da aula': '08/01/2024' }]

        const expectedData = [
            { 'Data da aula': 'data inválida', 'Semana do ano': '' },
            { 'Data da aula': '08/01/2024', 'Semana do ano': 2 },
        ]

        const result = addWeekNumber(defaultData)
        expect(result).toEqual(expectedData)
    })
})

describe('addSemesterWeekNumber', () => {
    it('lida corretamente com uma matriz vazia de dados', () => {
        const defaultData = []
        const result = addSemesterWeekNumber(defaultData)
        expect(result).toEqual([])
    })

    // Adicione mais testes conforme necessário para cobrir outros casos de uso
})

test('parseDate should return a valid Date object', () => {
    const dateString = '10/05/2022'
    const expectedDate = new Date(2022, 4, 10)
    expect(parseDate(dateString)).toEqual(expectedDate)
})

describe('sortDate', () => {
    it('classifica corretamente as datas', () => {
        const date1 = '01/01/2024'
        const date2 = '08/01/2024'

        const result = sortDate(date1, date2)
        expect(result).toBeLessThan(0) // date1 deve vir antes de date2
    })

    test('sorts dates in chronological order', () => {
        const dates = ['01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024']
        const shuffledDates = ['03/01/2024', '01/01/2024', '04/01/2024', '02/01/2024']
        expect(shuffledDates.sort(sortDate)).toEqual(dates)
    })

    test('handles dates with same value gracefully', () => {
        const dates = ['01/01/2024', '01/01/2024', '02/01/2024', '03/01/2024']
        const sameDates = ['02/01/2024', '01/01/2024', '03/01/2024', '01/01/2024']
        expect(sameDates.sort(sortDate)).toEqual(dates)
    })

    it('should return a negative number if a is earlier than b', () => {
        const a = '01/01/2022'
        const b = '01/02/2022'

        const result = sortDate(a, b)

        expect(result).toBeLessThan(0)
    })

    it('should return a positive number if a is later than b', () => {
        const a = '01/02/2022'
        const b = '01/01/2022'

        const result = sortDate(a, b)

        expect(result).toBeGreaterThan(0)
    })

    it('should return 0 if a and b are the same', () => {
        const a = '01/01/2022'
        const b = '01/01/2022'

        const result = sortDate(a, b)

        expect(result).toBe(0)
    })

    it('should handle cases where only one of a or b is a valid date string', () => {
        const a = '01/01/2022'
        const b = null

        const result1 = sortDate(a, b)
        const result2 = sortDate(b, a)

        expect(result1).toBeLessThan(0)
        expect(result2).toBeGreaterThan(0)
    })

    it('should handle cases where both a and b are empty strings', () => {
        const a = ''
        const b = ''

        const result = sortDate(a, b)

        expect(result).toBe(1)
    })
})

describe('validateRoomAvailability', () => {
    const sampleSchedule = [
        {
            'Sala atribuída à aula': 'Sala A',
            'Data da aula': '01/01/2024',
            'Hora início da aula': '09:00:00',
            'Hora fim da aula': '10:30:00',
        },
        {
            'Sala atribuída à aula': 'Sala B',
            'Data da aula': '01/01/2024',
            'Hora início da aula': '11:00:00',
            'Hora fim da aula': '12:30:00',
        },
        {
            'Sala atribuída à aula': 'Sala A',
            'Data da aula': '02/01/2024',
            'Hora início da aula': '09:00:00',
            'Hora fim da aula': '10:30:00',
        },
    ]

    test('room is available at specified date and hour', () => {
        expect(
            validateRoomAvailability('Sala A', new Date('2024-01-01'), new Date('2024-01-01T10:00:00'), sampleSchedule)
        ).toBe(false)
    })
})

describe('sortWeekDays', () => {
    test('sorts days in order (Mon to Sun)', () => {
        const sortedDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        const shuffledDays = ['Ter', 'Dom', 'Qui', 'Seg', 'Qua', 'Sáb', 'Sex']
        expect(shuffledDays.sort(sortWeekDays)).toEqual(sortedDays)
    })

    test('sorts days with repeated days', () => {
        const sortedDays = ['Seg', 'Seg', 'Ter', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        const shuffledDays = ['Dom', 'Seg', 'Ter', 'Qui', 'Qua', 'Seg', 'Sáb', 'Ter', 'Sex']
        expect(shuffledDays.sort(sortWeekDays)).toEqual(sortedDays)
    })
})

describe('addSemesterWeekNumber function', () => {
    it('should add semester week numbers to data', () => {
        const defaultData = [
            { 'Data da aula': '01/01/2024', 'Semana do ano': 1 },
            { 'Data da aula': '02/01/2024', 'Semana do ano': 1 },
            { 'Data da aula': '03/01/2024', 'Semana do ano': 2 },
            { 'Data da aula': '04/01/2024', 'Semana do ano': 2 },
            { 'Data da aula': '05/01/2024', 'Semana do ano': 0 },
            { 'Data da aula': '06/01/2024', 'Semana do ano': 3 },
        ]

        const expectedResult = [
            { 'Data da aula': '01/01/2024', 'Semana do ano': 1, 'Semana do semestre': 1 },
            { 'Data da aula': '02/01/2024', 'Semana do ano': 1, 'Semana do semestre': 1 },
            { 'Data da aula': '03/01/2024', 'Semana do ano': 2, 'Semana do semestre': 2 },
            { 'Data da aula': '04/01/2024', 'Semana do ano': 2, 'Semana do semestre': 2 },
            { 'Data da aula': '05/01/2024', 'Semana do ano': 0, 'Semana do semestre': '' },
            { 'Data da aula': '06/01/2024', 'Semana do ano': 3, 'Semana do semestre': 3 },
        ]

        const result = addSemesterWeekNumber(defaultData)

        expect(result).toEqual(expectedResult)
    })
})

describe('parseHour function', () => {
    it('should parse hour string into milliseconds since Unix Epoch', () => {
        const hourString = '12:30:45'
        const expectedHourMilliseconds = 12 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000 // Calculate expected milliseconds for the time portion only

        const result = parseHour(hourString)
        const receivedDate = new Date(result)
        const receivedHourMilliseconds =
            receivedDate.getUTCHours() * 60 * 60 * 1000 +
            receivedDate.getUTCMinutes() * 60 * 1000 +
            receivedDate.getUTCSeconds() * 1000 // Calculate milliseconds for the time portion only from the received date

        expect(receivedHourMilliseconds).toEqual(expectedHourMilliseconds)
    })

    it('should return null if input is not a string', () => {
        const hourString = null

        const result = parseHour(hourString)

        expect(result).toBeNull()
    })
})
