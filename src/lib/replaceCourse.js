/**
 * @file replaceCourse.js
 * This file defines and exports a function `doesDayMatch` that checks if a given slot matches the rules for inclusion.
 * It uses several utility functions and constants to perform this check.
 */

/**
 * @module date-fns
 * date-fns is a modern JavaScript date utility library. Here, the getDay, getISOWeek, and isSameDay functions are imported for use in the application.
 *
 * @module utils
 * This module exports utility functions for manipulating and parsing dates.
 * Here, the getFormattedDateTime, parseDate, and parseHour functions are imported for use in the application.
 *
 * @module dayjs
 * Day.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers.
 *
 * @module constants
 * This module exports constants used throughout the application.
 * Here, AFTERNOON_SHIFT, COURSE_END_TIMES, COURSE_START_TIMES, MORNING_SHIFT, NIGHT_SHIFT, ROOMS, and WEEKDAYS are imported for use in the application.
 */
import { getDay, getISOWeek, isSameDay } from 'date-fns'
import { getFormattedDateTime, parseDate, parseHour } from '../utils'
import dayjs from 'dayjs'
import {
    AFTERNOON_SHIFT,
    COURSE_END_TIMES,
    COURSE_START_TIMES,
    MORNING_SHIFT,
    NIGHT_SHIFT,
    ROOMS,
    WEEKDAYS,
} from '../constants'

// Inclusion filters

/**
 * @function doesDayMatch
 * This function checks if a given slot matches the rules for inclusion. It uses date-fns to compare dates.
 * @param {Object} rulesToInclude - The rules for inclusion.
 * @param {Object} slot - The slot to check.
 * @returns {boolean} - Returns true if the slot matches the rules for inclusion, false otherwise.
 */
export function doesDayMatch(rulesToInclude, slot) {
    // using date-fns to compare dates
    if (!rulesToInclude || !rulesToInclude.data || !rulesToInclude.data.value || !slot['Data da aula']) return false
    const date1 = parseDate(rulesToInclude?.data?.value.format('DD/MM/YYYY'))
    const date2 = parseDate(slot['Data da aula'])
    return isSameDay(date1, date2)
}

/**
 * @function isSameWeek
 * This function that checks if a given slot falls within the same week as specified by the rules for inclusion.
 * It uses date-fns to compare weeks.
 * @param {Object} rulesToInclude - The rules for inclusion.
 * @param {Object} slot - The slot to check.
 * @returns {boolean} - Returns true if the slot falls within the same week as specified by the rules for inclusion, false otherwise.
 */
export function isSameWeek(rulesToInclude, slot) {
    // using date-fns to compare dates
    if (!rulesToInclude.data.value || !slot['Data da aula']) return false
    const date1 = parseDate(rulesToInclude?.data.value.format('DD/MM/YYYY'))
    const date2 = parseDate(slot['Data da aula'])
    return getISOWeek(date1) === getISOWeek(date2)
}

/**
 * @function isBetweenDates
 * `isBetweenDates` is a function that checks if a given slot falls within the date range specified by the rules for inclusion.
 * It uses date-fns to compare dates.
 * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `startDate` and `endDate` that define the range.
 * @param {Object} slot - The slot to check. This object should include a `date` property.
 * @returns {boolean} - Returns true if the slot's date falls within the specified range, false otherwise.
 */
export function isBetweenDates(rulesToInclude, slot) {
    // using dayjs library
    if (!rulesToInclude.dataInicio || !rulesToInclude.dataFim || !slot['Data da aula']) return false
    const formattedDateTime = dayjs(
        getFormattedDateTime(slot['Data da aula'], slot['Hora início da aula'], "yyyy-MM-dd'T'HH:mm")
    )
    return dayjs(formattedDateTime).isBetween(rulesToInclude.dataInicio, rulesToInclude.dataFim, 'day', '[]')
}

/**
 * @function hasRoom
 * `hasRoom` is a function that checks if a given row (representing a course slot) matches the room specified in the rules for inclusion.
 * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `room` property that specifies the room to check for.
 * @param {Object} row - The row to check. This object should include a `room` property that specifies the room of the course slot.
 * @returns {boolean} - Returns true if the row's room matches the room specified in the rules for inclusion, false otherwise.
 */
export function hasRoom(rulesToInclude, row) {
    return rulesToInclude.salas.includes(row['Sala atribuída à aula'])
}

/**
 * @function hasFeature
 * `hasFeature` is a function that checks if a given row (representing a course slot) matches the feature specified in the rules for inclusion.
 * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `features` property that specifies the features to check for.
 * @param {Object} row - The row to check. This object should include a `features` property that specifies the features of the course slot.
 * @returns {boolean} - Returns true if the row's features match any of the features specified in the rules for inclusion, false otherwise.
 */
export function hasFeature(rulesToInclude, row) {
    return rulesToInclude?.caracteristicas?.includes(row['Características da sala pedida para a aula'])
}

// Exclusion filters

/**
 * @function hasFeature
 * `hasFeature` is a function that checks if a given row (representing a course slot) matches the feature specified in the rules for inclusion.
 *
 * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `features` property that specifies the features to check for.
 * @param {Object} row - The row to check. This object should include a `features` property that specifies the features of the course slot.
 * @returns {boolean} - Returns true if the row's features match any of the features specified in the rules for inclusion, false otherwise.
 */
export function doesStartHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora início da aula'] || !slot['Hora início da aula']) return false
    return rulesToExclude['Hora início da aula'] === slot['Hora início da aula']
}

/**
 * @function doesEndHourMatch
 * `doesEndHourMatch` is a function that checks if a given slot's end hour matches the end hour specified in the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object should include a `Hora fim da aula` property that specifies the end hour to check for.
 * @param {Object} slot - The slot to check. This object should include a `Hora fim da aula` property that specifies the end hour of the slot.
 * @returns {boolean} - Returns true if the slot's end hour matches the end hour specified in the rules for exclusion, false otherwise.
 */
export function doesEndHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora fim da aula'] || !slot['Hora fim da aula']) return false
    return rulesToExclude['Hora fim da aula'] === slot['Hora fim da aula']
}

/**
 * @function isBetweenHours
 * `isBetweenHours` is a function that checks if a given slot's time falls within the time range specified by the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object should include `Hora início da aula` and `Hora fim da aula` properties that define the range.
 * @param {Object} slot - The slot to check. This object should include `Hora início da aula` and `Hora fim da aula` properties that specify the time of the slot.
 * @returns {boolean} - Returns true if the slot's time falls within the specified range, false otherwise.
 */
export function isBetweenHours(rulesToExclude, slot) {
    if (
        !rulesToExclude['Hora início da aula'] ||
        !rulesToExclude['Hora fim da aula'] ||
        !slot['Hora início da aula'] ||
        !slot['Hora fim da aula']
    )
        return false
    const slotStartHour = parseHour(slot['Hora início da aula'])
    const slotEndHour = parseHour(slot['Hora fim da aula'])
    const appointmentStartHour = parseHour(rulesToExclude['Hora início da aula'])
    const appointmentEndHour = parseHour(rulesToExclude['Hora fim da aula'])
    return (
        (slotStartHour >= appointmentStartHour && slotStartHour <= appointmentEndHour) ||
        (slotEndHour <= appointmentEndHour && slotEndHour >= appointmentStartHour)
    )
}

/**
 * @function isSameWeekDay
 * `isSameWeekDay` is a function that checks if a given slot falls on the same weekday as specified in the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object should include a `diaDaSemana` property that specifies the weekday to check for.
 * @param {Object} slot - The slot to check. This object should include a `Data da aula` property that specifies the date of the slot.
 * @returns {boolean} - Returns true if the slot's date falls on the same weekday as specified in the rules for exclusion, false otherwise.
 */
export function isSameWeekDay(rulesToExclude, slot) {
    if (!rulesToExclude.diaDaSemana || !slot['Data da aula']) return false
    const day1Index = WEEKDAYS.indexOf(rulesToExclude?.diaDaSemana) + 1
    const day2Index = getDay(parseDate(slot?.data)) // getDay returns 0 for Sunday but our WEEKDAYS array starts at Monday
    if (day2Index === 0) return false // skip Sundays
    return day1Index === day2Index
}

/**
 * @function isSameShift
 * `isSameShift` is a function that checks if a given slot falls within the same shift (morning or afternoon) as specified in the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object should include a `turno` property that specifies the shift to check for.
 * @param {Object} slot - The slot to check. This object should include a `Hora início da aula` property that specifies the start hour of the slot.
 * @returns {boolean} - Returns true if the slot's start hour falls within the same shift as specified in the rules for exclusion, false otherwise.
 */
export function isSameShift(rulesToExclude, slot) {
    if (!rulesToExclude.turno || !slot['Hora início da aula']) return false
    if (rulesToExclude.turno === 'Manhã') {
        return MORNING_SHIFT.includes(slot['Hora início da aula'])
    } else if (rulesToExclude.turno === 'Tarde') {
        return AFTERNOON_SHIFT.includes(slot['Hora início da aula'])
    } else if (rulesToExclude.turno === 'Noite') {
        return NIGHT_SHIFT.includes(slot['Hora início da aula'])
    } else {
        return false
    }
}

// Functions to determine which filters to should be applied

/**
 * @function getFiltersIncludeToApply
 * `getFiltersIncludeToApply` is a function that generates an array of filter functions based on the rules for inclusion.
 *
 * @param {Object} rulesToInclude - The rules for inclusion. This object may include `salas`, `caracteristicas`, and `data` properties.
 * @returns {Array} - Returns an array of filter functions to be applied.
 */
export function getFiltersIncludeToApply(rulesToInclude) {
    const filters = []
    if (rulesToInclude?.salas?.length > 0) {
        filters.push(hasRoom)
    }
    if (rulesToInclude?.caracteristicas?.length > 0) {
        filters.push(hasFeature)
    }
    if (rulesToInclude?.data?.label === 'mesmoDia') {
        filters.push(doesDayMatch)
    }
    if (rulesToInclude?.data?.label === 'mesmaSemana') {
        filters.push(isSameWeek)
    }
    if (rulesToInclude?.data?.label === 'outro') {
        filters.push(isBetweenDates)
    }
    return filters
}

/**
 * @function getFiltersExcludeToApply
 * `getFiltersExcludeToApply` is a function that generates an array of filter functions based on the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object may include various properties depending on the exclusion rules.
 * @returns {Array} - Returns an array of filter functions to be applied.
 */
export function getFiltersExcludeToApply(rulesToExclude) {
    const filters = []
    if (rulesToExclude?.['Hora início da aula'] && !rulesToExclude?.['Hora fim da aula']) {
        filters.push(doesStartHourMatch)
    }
    if (rulesToExclude?.['Hora fim da aula'] && !rulesToExclude?.['Hora início da aula']) {
        filters.push(doesEndHourMatch)
    }
    if (rulesToExclude?.['Hora início da aula'] && rulesToExclude?.['Hora fim da aula']) {
        filters.push(isBetweenHours)
    }
    if (rulesToExclude?.diaDaSemana) {
        filters.push(isSameWeekDay)
    }
    if (rulesToExclude?.turno) {
        filters.push(isSameShift)
    }
    if (rulesToExclude?.salas?.length > 0) {
        filters.push(hasRoom)
    }
    return filters
}

// Calculate all slots available for a given time interval

/**
 * @function getFiltersExcludeToApply
 * `getFiltersExcludeToApply` is a function that generates an array of filter functions based on the rules for exclusion.
 *
 * @param {Object} rulesToExclude - The rules for exclusion. This object may include various properties depending on the exclusion rules.
 * @returns {Array} - Returns an array of filter functions to be applied.
 */
export function getAllSlots(rulesToInclude) {
    const combinations = []
    const startDate =
        rulesToInclude?.data?.label === 'outro' ||
        rulesToInclude?.data?.label === 'nenhuma' ||
        !rulesToInclude?.data?.label
            ? rulesToInclude?.dataInicio
            : rulesToInclude?.data?.value
    const endDate = getEndDate(rulesToInclude) //Todo
    const days = getDatesExcludingSundays('10/04/2024', '11/04/2024')
    const daysArray = days.length === 0 ? [startDate.format('DD/MM/YYYY')] : days

    for (let i = 0; i < COURSE_START_TIMES.length; i++) {
        for (let e = 0; e < COURSE_END_TIMES.length; e++) {
            for (let j = 0; j < ROOMS.length; j++) {
                for (let k = 0; k < daysArray.length; k++) {
                    if (COURSE_START_TIMES[i] < COURSE_END_TIMES[e]) {
                        combinations.push({
                            'Hora início da aula': COURSE_START_TIMES[i],
                            'Hora fim da aula': COURSE_END_TIMES[e],
                            'Sala atribuída à aula': ROOMS[j],
                            'Data da aula': daysArray[k],
                        })
                    }
                }
            }
        }
    }
    return combinations
}

/**
 * @function getEndDate
 * `getEndDate` is a function that calculates the end date for a given set of rules for inclusion.
 *
 * @param {Object} rulesToInclude - The rules for inclusion. This object may include `data`, `dataInicio`, and `dataFim` properties that specify the date range.
 * @returns {string} - Returns the end date in 'DD/MM/YYYY' format.
 */
export function getEndDate(rulesToInclude) {
    if (rulesToInclude?.data?.label === 'mesmoDia') {
        return rulesToInclude?.data?.value
    } else if (rulesToInclude?.data?.label === 'mesmaSemana') {
        const dayOfWeek = rulesToInclude?.data?.value.day()
        const daysRemaining = 6 - dayOfWeek
        return rulesToInclude?.data?.value.add(daysRemaining, 'day')
    } else if (rulesToInclude?.data?.label === 'outro') {
        //Todo
        return rulesToInclude?.dataFim
    } else {
        // if the user doesn't specify a time interval we generate slots for the same day
        return rulesToInclude?.dataInicio
    }
}

/**
 * @function getDatesExcludingSundays
 * `getDatesExcludingSundays` is a function that generates an array of dates between two given dates, excluding Sundays.
 *
 * @param {string} startDate - The start date in 'DD/MM/YYYY' format.
 * @param {string} endDate - The end date in 'DD/MM/YYYY' format.
 * @returns {Array} - Returns an array of dates in 'DD/MM/YYYY' format, excluding Sundays.
 */
export function getDatesExcludingSundays(startDate, endDate) {
    const result = []
    let currentDate = startDate
    //Todo
    while (currentDate.isBefore(endDate)) {
        if (currentDate.day() !== 0) {
            // 0 represents Sunday
            result.push(currentDate.format('DD/MM/YYYY'))
        }
        currentDate = currentDate.add(1, 'day')
    }
    result.push(endDate.format('DD/MM/YYYY'))

    return result
}

// Transform schedule and slots array into a map for easier access

/**
 * @function mkId
 * `mkId` is a function that generates a unique identifier for a given course slot.
 *
 * @param {Object} slot - The course slot for which to generate an identifier. This object may include various properties depending on the structure of a course slot.
 * @returns {string} - Returns a unique identifier for the given course slot.
 */
export function mkId(entry) {
    return `${entry['Data da aula']}-${entry['Hora início da aula']}-${entry['Hora fim da aula']}-${entry['Sala atribuída à aula']}`
}

/**
 * @function mkSheduleMap
 * `mkSheduleMap` is a function that generates a map (object) where each key-value pair represents a course slot and its corresponding schedule.
 *
 * @param {Array} slots - An array of course slots. Each slot is an object that may include various properties depending on the structure of a course slot.
 * @returns {Object} - Returns a map where each key is a unique identifier for a course slot, and each value is the corresponding schedule.
 */
export function mkSheduleMap(appointments) {
    const map = new Map()
    appointments.forEach((appointment) => {
        const id = mkId(appointment)
        map.set(id, appointment)
    })
    return map
}

// Remove slots that are already in the schedule
/**
 * @function removeSheduledSlots
 * `removeSheduledSlots` is a function that removes scheduled slots from a given array of slots.
 *
 * @param {Array} slots - An array of course slots. Each slot is an object that may include various properties depending on the structure of a course slot.
 * @param {Object} scheduleMap - A map where each key is a unique identifier for a course slot, and each value is the corresponding schedule.
 * @returns {Array} - Returns a new array of slots, excluding those that are already scheduled.
 */
export function removeSheduledSlots(map, slots) {
    return slots.reduce((acc, slot) => {
        const id = mkId(slot)
        return map.has(id) ? acc : [...acc, slot]
    }, [])
}

// Lookup function which returns the available slots
/**
 * @function lookupSlots
 * `lookupSlots` is a function that retrieves the slots associated with a given course from a schedule map.
 *
 * @param {Object} scheduleMap - A map where each key is a unique identifier for a course slot, and each value is the corresponding schedule.
 * @param {string} course - The course for which to retrieve the slots.
 * @returns {Array} - Returns an array of slots associated with the given course.
 */
export function lookupSlots(rulesToInclude, rulesToExclude, schedule) {
    // Get all available slots for a given interval of time
    const allSlots = getAllSlots(rulesToInclude)

    // Remove all slots that match the exclusion filters
    const filtersExcludeToApply = getFiltersExcludeToApply(rulesToExclude)
    const slotsWithoutExclusionRules = allSlots.filter(
        (slot) => !filtersExcludeToApply.some((filter) => filter(rulesToExclude, slot))
    )

    // Filter the slots that match the inclusion filters
    const filtersIncludeToApply = getFiltersIncludeToApply(rulesToInclude)
    const filteredSlots = slotsWithoutExclusionRules.filter((slot) =>
        filtersIncludeToApply.every((filter) => filter(rulesToInclude, slot))
    )

    const scheduleMap = mkSheduleMap(schedule)

    const slotsWithoutScheduleClasses = removeSheduledSlots(scheduleMap, filteredSlots)

    return slotsWithoutScheduleClasses
}
