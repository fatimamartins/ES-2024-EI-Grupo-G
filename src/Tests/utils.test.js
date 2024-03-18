import {
    addWeekNumber,
    addSemesterWeekNumber,
    parseDate,
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

    // Adicione mais testes conforme necessário para cobrir outros casos de uso
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
