import { addWeekNumber, addSemesterWeekNumber, parseDate, sortDate } from '../utils'
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

    // Adicione mais testes conforme necessário para cobrir outros casos de uso
})
