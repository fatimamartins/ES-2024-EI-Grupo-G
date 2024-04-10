/**
 * @file This file contains utility functions for handling data.
 */

/** @module date-fns */
import { format, getISOWeek } from 'date-fns'
/** @module dayjs */

/**
 * Adds a week number to each row of the provided data based on the date.
 *
 * @function
 * @name addWeekNumber
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
 *
 * @function
 * @name addSemesterWeekNumber
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

/**
 * Parses a date string in the format 'dd/mm/yyyy' and returns a Date object.
 *
 * @function
 * @name parseDate
 * @param {string} dateString - The date string to parse.
 * @returns {Date} The parsed date.
 */
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

/**
 * Parses a string representation of an hour into a numerical representation.
 *
 * @function
 * @name parseHour
 * @param {string} hourString - A string representing an hour in the format 'HH:MM:SS'.
 * @returns {number|null} The time value of the parsed hour in milliseconds since the Unix Epoch, or null if the input is not a string.
 */
export function parseHour(hourString) {
    if (hourString) {
        const parts = hourString.split(':')
        const hour = parseInt(parts[0], 10)
        const minute = parseInt(parts[1], 10)
        const second = parts[2] ? parseInt(parts[2], 10) : 0
        const date = new Date(2024, 2, 31)
        date.setHours(hour, minute, second)
        return date.getTime()
    }
    return null
}

/**
 * Parses a string representation of time into a numerical representation.
 *
 * @function
 * @name getCourseDurationToMilliseconds
 * @param {string} start - A string representing the start time for a course in the format 'HH:MM:SS'.
 * * @param {string} end - A string representing the end time for a course in the format 'HH:MM:SS'.
 * @returns {number|null} The duration of a course parsed in milliseconds
 */
export function getCourseDurationToMilliseconds(start, end) {
    if (start && end) {
        const startHour = parseHour(start)
        const endHour = parseHour(end)
        const duration = endHour - startHour
        return duration
    }
    return 0
}

/**
 * Compares two date strings and returns a number indicating their sort order.
 *
 * @function
 * @name sortDate
 * @param {string} a - The first date string to compare.
 * @param {string} b - The second date string to compare.
 * @returns {number} A negative number if `a` is earlier than `b`, a positive number if `a` is later than `b`, or 0 if they are the same.
 */
export function sortDate(a, b) {
    // a, b - the two values being compared
    if (!a) return 1
    if (!b) return -1
    const dateA = parseDate(a)
    const dateB = parseDate(b)
    return dateA.getTime() - dateB.getTime()
}

/**
 * Compares two weekday strings and returns a number indicating their sort order.
 *
 * @function
 * @name sortWeekDays
 * @param {string} a - The first weekday string to compare.
 * @param {string} b - The second weekday string to compare.
 * @returns {number} A negative number if `a` is earlier in the week than `b`, a positive number if `a` is later in the week than `b`, or 0 if they are the same.
 */
export function sortWeekDays(a, b) {
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    return weekDays.indexOf(a) - weekDays.indexOf(b)
}

/**
 * Checks if a room is available at a specific date and hour based on the provided schedule data.
 *
 * @function
 * @name validateRoomAvailability
 * @param {string} room - The room to check availability for.
 * @param {Date} date - The date to check availability for.
 * @param {Object} hour - The hour to check availability for, with hour, minute, and second components.
 * @param {Object[]} horario - The schedule data to check against.
 * @returns {boolean} `true` if the room is available, `false` otherwise.
 */
export function validateRoomAvailability(room, date, hour, horario) {
    const roomData = horario.filter(
        (horario) =>
            horario['Sala atribuída à aula'] === room &&
            parseDate(horario['Data da aula']) === date &&
            !(
                parseHour(horario['Hora início da aula']) <= parseHour(hour) &&
                parseHour(horario['Hora fim da aula']) >= parseHour(hour)
            )
    )
    return roomData.length > 0
}

/**
 * @function getFormattedDateTime
 * `getFormattedDateTime` is a function that formats a given date and time into a specific string format.
 *
 * @param {string} date - The date to format, in 'DD/MM/YYYY' format.
 * @param {string} time - The time to format, in 'HH:mm' format.
 * @returns {string} - Returns the formatted date and time as a string.
 */
export function getFormattedDateTime(date, time, formatStr) {
    if (date && time) {
        const parsedTime = new Date(parseHour(time))
        const parsedDate = parseDate(date)
        const combinedDateTime = new Date(
            parsedDate?.getFullYear(),
            parsedDate?.getMonth(),
            parsedDate?.getDate(),
            parsedTime?.getHours(),
            parsedTime?.getMinutes()
        )
        return format(combinedDateTime, formatStr)
    }
    return ''
}
