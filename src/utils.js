/**
 * @file This file contains utility functions for handling data.
 */

/** @module date-fns */
import { getISOWeek } from 'date-fns'

/**
 * Adds a week number to each row of the provided data based on the date.
 * @param {Object[]} defaultData - The data to add week numbers to.
 * @returns {Object[]} The data with added week numbers.
 */
export function addWeekNumber(defaultData) {
    return defaultData.map((datum) => {
        const date = parseDate(datum['Data da aula'])
        const weekNumber = getISOWeek(date)
        return { ...datum, 'Semana do ano': isNaN(weekNumber) ? '' : weekNumber }
    })
}

/**
 * Adds a semester week number to each row of the provided data.
 * @param {Object[]} defaultData - The data to add semester week numbers to.
 * @returns {Object[]} The data with added semester week numbers.
 */
export function addSemesterWeekNumber(defaultData) {
    let semesterWeekNumber = 0
    let weekNumber = 0

    return defaultData
        .sort((a, b) => sortDate(a['Data da aula'], b['Data da aula']))
        .map((datum) => {
            if (datum['Semana do ano'] === 0) {
                weekNumber = datum['Semana do ano']
            }
            if (datum['Semana do ano'] !== weekNumber) {
                weekNumber = datum['Semana do ano']
                semesterWeekNumber++
            }
            return { ...datum, 'Semana do semestre': !datum['Semana do ano'] ? '' : semesterWeekNumber }
        })
}

export function parseDate(dateString) {
    if (dateString) {
        // Split the input string into day, month, and year components and returns a new Date object
        const parts = dateString.split('/')
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) // Month is zero-based
        const year = parseInt(parts[2], 10)
        return new Date(year, month - 1, day)
    }
}

export function sortDate(a, b) {
    //a, b - the two values being compared
    if (!a) return 1
    if (!b) return -1
    const dateA = parseDate(a)
    const dateB = parseDate(b)
    return dateA.getTime() - dateB.getTime()
}

export function sortWeekDays(a, b) {
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    return weekDays.indexOf(a) - weekDays.indexOf(b)
}
