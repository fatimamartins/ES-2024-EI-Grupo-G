/**
 * @file utils.js
 * This file contains utility functions for handling data. It imports necessary modules such as format, getISOWeek, isSameDay, getDay from 'date-fns' and WEEKDAYS from './constants'.
 */

/** @module date-fns */
import { format, getISOWeek, isSameDay, getDay } from 'date-fns'
/** @module constants */
import { WEEKDAYS } from './constants'

/**
 * @function
 * @name addWeekNumber
 * @description This function adds a week number to each row of the provided data based on the date.
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
 * @function
 * @name addSemesterWeekNumber
 * @description This function adds a semester week number to each row of the provided data.
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
 * @function
 * @name parseDate
 * @description This function parses a string representation of a date into a Date object.
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
 * @function
 * @name parseHour
 * @description This function parses a string representation of an hour into a numerical representation.
 * @param {string} hourString - The hour string to parse.
 * @returns {number} The parsed hour.
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
 * @function
 * @name getCourseDurationToMilliseconds
 * @description This function calculates the duration of a course in milliseconds.
 * @param {Object} course - The course object containing the start and end times.
 * @returns {number} The duration of the course in milliseconds.
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
 * @function
 * @name sortDate
 * @description This function sorts an array of dates in ascending order.
 * @param {Date[]} dates - The array of dates to sort.
 * @returns {Date[]} The sorted array of dates.
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
 * @function
 * @name sortWeekDays
 * @description This function sorts an array of weekdays in ascending order.
 * @param {string[]} weekdays - The array of weekdays to sort.
 * @returns {string[]} The sorted array of weekdays.
 */
export function sortWeekDays(a, b) {
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    return weekDays.indexOf(a) - weekDays.indexOf(b)
}

/**
 * @function
 * @name validateRoomAvailability
 * @description This function validates the availability of a room based on the provided schedule.
 * @param {Object} room - The room object to validate.
 * @param {Object[]} schedule - The schedule to validate against.
 * @returns {boolean} Returns true if the room is available, false otherwise.
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
 * @function
 * @name getFormattedDateTime
 * @description This function formats a Date object into a string representation.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
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

/**
 * @function
 * @name getWeek
 * @description This function gets the week number of a given date.
 * @param {Date} date - The date to get the week number from.
 * @returns {number} The week number.
 */
export function getWeek(date) {
    return getISOWeek(parseDate(date))
}

/**
 * @function
 * @name getSemesterWeek
 * @description This function gets the semester week number of a given date.
 * @param {Date} date - The date to get the semester week number from.
 * @returns {number} The semester week number.
 */
export function getSemesterWeek(oldDate, semesterWeek, newDate) {
    const dif = getWeek(newDate) - getWeek(oldDate)
    return semesterWeek + dif
}

/**
 * @function
 * @name getDayOfTheWeek
 * @description This function gets the day of the week for a given date.
 * @param {Date} date - The date to get the day of the week from.
 * @returns {string} The day of the week.
 */
export function getDayOfTheWeek(date) {
    const index = getDay(parseDate(date))
    if (index === 0) return null // 0 is Sunday but is not a valid day for the application
    return WEEKDAYS[index - 1] // Adjust the index to match the WEEKDAYS array. 0 is Monday
}

/**
 * @function
 * @name isSameDate
 * @description This function checks if two dates are the same.
 * @param {Date} date1 - The first date to compare.
 * @param {Date} date2 - The second date to compare.
 * @returns {boolean} Returns true if the dates are the same, false otherwise.
 */
export function isSameDate(date1, date2) {
    return isSameDay(parseDate(date1), parseDate(date2))
}

/**
 * @function
 * @name randomColor
 * @description This function generates a random color in hexadecimal format.
 * @returns {string} The generated random color.
 */
export const randomColor = () => {
    const digits = '0123456789abcdef'
    let code = '#'
    for (let i = 0; i < 6; i++) {
        code += digits.charAt(Math.floor(Math.random() * 16))
    }
    return code
}
