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
import { addWeeks, format, getDay, startOfWeek } from 'date-fns'
import { getFormattedDateTime, parseDate, parseHour } from '../utils'
import {
    AFTERNOON_SHIFT,
    COURSE_END_TIMES,
    COURSE_START_TIMES,
    MORNING_SHIFT,
    NIGHT_SHIFT,
    ROOMS,
    WEEKDAYS,
} from '../constants'
import dayjs from 'dayjs'

// Inclusion filters

// /**
//  * @function doesDayMatch
//  * This function checks if a given slot matches the rules for inclusion. It uses date-fns to compare dates.
//  * @param {Object} rulesToInclude - The rules for inclusion.
//  * @param {Object} slot - The slot to check.
//  * @returns {boolean} - Returns true if the slot matches the rules for inclusion, false otherwise.
//  */
// export function doesDayMatch(rulesToInclude, slot) {
//     // using date-fns to compare dates
//     if (!rulesToInclude || !rulesToInclude.data || !rulesToInclude.data.value || !slot['Data da aula']) return false
//     const date1 = parseDate(rulesToInclude?.data?.value.format('DD/MM/YYYY'))
//     const date2 = parseDate(slot['Data da aula'])
//     return isSameDay(date1, date2)
// }

// /**
//  * @function isSameWeek
//  * This function that checks if a given slot falls within the same week as specified by the rules for inclusion.
//  * It uses date-fns to compare weeks.
//  * @param {Object} rulesToInclude - The rules for inclusion.
//  * @param {Object} slot - The slot to check.
//  * @returns {boolean} - Returns true if the slot falls within the same week as specified by the rules for inclusion, false otherwise.
//  */
// export function isSameWeek(rulesToInclude, slot) {
//     // using date-fns to compare dates
//     if (!rulesToInclude?.data?.value || !slot['Data da aula']) return false
//     const date1 = parseDate(rulesToInclude.data.value.format('DD/MM/YYYY'))
//     const date2 = parseDate(slot['Data da aula'])
//     return getISOWeek(date1) === getISOWeek(date2)
// }

// /**
//  * @function isBetweenDates
//  * `isBetweenDates` is a function that checks if a given slot falls within the date range specified by the rules for inclusion.
//  * It uses date-fns to compare dates.
//  * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `startDate` and `endDate` that define the range.
//  * @param {Object} slot - The slot to check. This object should include a `date` property.
//  * @returns {boolean} - Returns true if the slot's date falls within the specified range, false otherwise.
//  */
// export function isBetweenDates(rulesToInclude, slot) {
//     // using dayjs library
//     if (!rulesToInclude.dataInicio || !rulesToInclude.dataFim || !slot['Data da aula']) return false
//     const formattedDateTime = dayjs(
//         getFormattedDateTime(slot['Data da aula'], slot['Hora início da aula'], "yyyy-MM-dd'T'HH:mm")
//     )
//     return dayjs(formattedDateTime).isBetween(rulesToInclude.dataInicio, rulesToInclude.dataFim, 'day', '[]')
// }

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

// /**
//  * @function hasFeature
//  * `hasFeature` is a function that checks if a given row (representing a course slot) matches the feature specified in the rules for inclusion.
//  * @param {Object} rulesToInclude - The rules for inclusion. This object should include a `features` property that specifies the features to check for.
//  * @param {Object} row - The row to check. This object should include a `features` property that specifies the features of the course slot.
//  * @returns {boolean} - Returns true if the row's features match any of the features specified in the rules for inclusion, false otherwise.
//  */
// function hasFeature(rulesToInclude, slot, rooms) {
//     const selectedRoom = rooms.find((room) => room['Nome sala'] === slot['Sala atribuída à aula'])
//     // if selectedRoom includes the features specified in the rulesToInclude, return true
//     return rulesToInclude?.caracteristicas?.filter((caracteristica) => selectedRoom[caracteristica] === 'X').length > 0
// }

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
    ) {
        return false
    }
    const slotStartHour = parseHour(slot['Hora início da aula'])
    const slotEndHour = parseHour(slot['Hora fim da aula'])
    const appointmentStartHour = parseHour(rulesToExclude['Hora início da aula'])
    const appointmentEndHour = parseHour(rulesToExclude['Hora fim da aula'])
    return (
        (slotStartHour >= appointmentStartHour && slotStartHour < appointmentEndHour) ||
        (slotEndHour <= appointmentEndHour && slotEndHour > appointmentStartHour) ||
        (slotStartHour < appointmentStartHour && slotEndHour > appointmentEndHour)
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

// /**
//  * @function getFiltersIncludeToApply
//  * `getFiltersIncludeToApply` is a function that generates an array of filter functions based on the rules for inclusion.
//  *
//  * @param {Object} rulesToInclude - The rules for inclusion. This object may include `salas`, `caracteristicas`, and `data` properties.
//  * @returns {Array} - Returns an array of filter functions to be applied.
//  */
// export function getFiltersIncludeToApply(rulesToInclude) {
//     const filters = []
//     // if (rulesToInclude?.salas?.length > 0) {
//     //     filters.push(hasRoom)
//     // }
//     // if (rulesToInclude?.caracteristicas?.length > 0) {
//     //     filters.push(hasFeature)
//     // }
//     // if (rulesToInclude?.data?.label === 'mesmoDia') {
//     //     filters.push(doesDayMatch)
//     // }
//     // if (rulesToInclude?.data?.label === 'mesmaSemana') {
//     //     filters.push(isSameWeek)
//     // }
//     // if (rulesToInclude?.data?.label === 'outro') {
//     //     filters.push(isBetweenDates)
//     // }
//     return filters
// }

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
export function getAllSlots(rulesToInclude, rooms) {
    const combinations = []

    // 1. Get the time range to iterate over based on the rules to include
    const startTimeRange = getStartTime(rulesToInclude)
    const endTimeRange = getEndTime(rulesToInclude)
    // 2. Get the rooms to iterate based on the rules to include. If no rules are specified, iterate over all rooms.
    const roomsToIterate = getRoomsToIterate(rulesToInclude, rooms)

    // 3. Get the date range to iterate over based on the rules to include
    const startDate = rulesToInclude?.dataInicio
    const endDate = getEndDate(rulesToInclude)
    // Check if the end date is before the start date or if the end date is a Sunday. If true, return an empty array because the date is not valid.
    if (endDate.isBefore(startDate) || (endDate.isSame(startDate) && endDate.day() === 0)) {
        return []
    }
    const days = getDatesExcludingSundays(startDate, endDate)
    const dateRange = days.length === 0 ? [startDate.format('DD/MM/YYYY')] : days

    for (let i = 0; i < startTimeRange.length; i++) {
        for (let e = 0; e < endTimeRange.length; e++) {
            for (let j = 0; j < roomsToIterate.length; j++) {
                for (let k = 0; k < dateRange.length; k++) {
                    // Verificar a duração da aula
                    if (startTimeRange[i] < endTimeRange[e]) {
                        const slotTime = getSlotTime(startTimeRange[i], endTimeRange[e])
                        if (slotTime === rulesToInclude.duracao) {
                            // é obrigatório ter a duração da aula
                            combinations.push({
                                'Hora início da aula': startTimeRange[i],
                                'Hora fim da aula': endTimeRange[e],
                                'Sala atribuída à aula': roomsToIterate[j],
                                'Data da aula': dateRange[k],
                            })
                        }
                    }
                }
            }
        }
    }
    return combinations
}

function getSlotTime(start, end) {
    const startHour = parseHour(start)
    const endHour = parseHour(end)
    return endHour - startHour
}

function getRoomsWithSelectedFeature(rulesToInclude, rooms) {
    return rooms.filter((room) =>
        rulesToInclude?.caracteristicas?.some((caracteristica) => room[caracteristica] === 'X')
    )
}

function getRoomsToIterate(rulesToInclude, rooms) {
    // The application only allows filtering by rooms if no features are selected and vice versa.
    // So if the user has selected rooms, return those rooms. If the user has selected features, return the rooms that have those features.
    if (rulesToInclude?.salas?.length > 0) {
        return rulesToInclude.salas
    } else if (rulesToInclude?.caracteristicas?.length > 0) {
        return getRoomsWithSelectedFeature(rulesToInclude, rooms).map((room) => room['Nome sala'])
    } else {
        return ROOMS
    }
}

function getStartTime(rulesToInclude) {
    if (rulesToInclude?.dataInicio) {
        const selectedStartTime = rulesToInclude?.dataInicio.format('HH:mm:ss')
        return COURSE_START_TIMES.filter((time) => time >= selectedStartTime)
    }
    return COURSE_START_TIMES
}

function getEndTime(rulesToInclude) {
    if (rulesToInclude?.dataFim) {
        const selectedEndTime = rulesToInclude?.dataFim.format('HH:mm:ss')
        return COURSE_END_TIMES.filter((time) => time <= selectedEndTime)
    }
    return COURSE_END_TIMES
}

/**
 * @function getEndDate
 * `getEndDate` is a function that calculates the end date for a given set of rules for inclusion.
 *
 * @param {Object} rulesToInclude - The rules for inclusion. This object may include `data`, `dataInicio`, and `dataFim` properties that specify the date range.
 * @returns {string} - Returns the end date in 'DD/MM/YYYY' format.
 */
export function getEndDate(rulesToInclude) {
    if (rulesToInclude?.data === 'mesmaSemana') {
        const dayOfWeek = rulesToInclude?.dataInicio.day() // 0 represents Sunday and 6 represents Saturday
        const daysRemaining = 6 - dayOfWeek
        return rulesToInclude?.dataInicio.add(daysRemaining, 'day')
    } else if (rulesToInclude?.data === 'outro') {
        return rulesToInclude?.dataFim
    } else {
        // rulesToInclude?.data === 'mesmoDia' or no data specified
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

    // Loop through the dates and add them to the result array excluding Sundays
    // this loop doens't include the end date
    while (currentDate.isBefore(endDate)) {
        if (currentDate.day() !== 0) {
            // 0 represents Sunday
            result.push(currentDate.format('DD/MM/YYYY'))
        }
        currentDate = currentDate.add(1, 'day')
    }

    // Add the end date if it's not a Sunday
    if (endDate.isSame(currentDate) && endDate.day() !== 0) {
        // if the end date is the same as the start date and it's not a Sunday
        result.push(endDate.format('DD/MM/YYYY'))
    }
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

/**
 * @function isOverlapping
 * `isOverlapping` is a function that returns true if the slot overlaps with the schedule
 *
 * @param {Object} slot - The slot to check. This object should include `Hora início da aula` and `Hora fim da aula` properties that specify the time of the slot.
 * @param {Array} schedule - An array of course slots. Each slot is an object that may include various properties depending on the structure of a course slot.
 * @returns {boolean} - Returns true if the slot's time overlaps with the schedule, false otherwise.
 */
function isOverlapping(slot, schedule) {
    return schedule.some((appointment) => {
        if (
            appointment['Data da aula'] === slot['Data da aula'] &&
            appointment['Sala atribuída à aula'] === slot['Sala atribuída à aula']
        ) {
            return isBetweenHours(appointment, slot)
        }
        return false
    })
}

export function getNextWeekDate(date, time) {
    const currentWeekStartDate = startOfWeek(parseDate(date), { weekStartsOn: 1 }) // Assuming Monday is the start of the week (change as needed)
    // Add 1 week to get the start date of the next week
    const nextWeekStartDate = format(addWeeks(currentWeekStartDate, 1), 'dd/MM/yyyy')
    return dayjs(getFormattedDateTime(nextWeekStartDate, time, "yyyy-MM-dd'T'HH:mm"))
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
export function lookupSlots(rulesToInclude, rulesToExclude, schedule, rooms, selectedLessonID) {
    // Get all available slots based on the rules to include
    const allSlots = getAllSlots(rulesToInclude, rooms)

    // Remove all slots that match the exclusion filters
    const filtersExcludeToApply = getFiltersExcludeToApply(rulesToExclude)
    const slotsWithoutExclusionRules = allSlots.filter(
        (slot) => !filtersExcludeToApply.some((filter) => filter(rulesToExclude, slot))
    )

    // // Filter the slots that match the inclusion filters
    // const filtersIncludeToApply = getFiltersIncludeToApply(rulesToInclude)
    // const filteredSlots = slotsWithoutExclusionRules.filter((slot) =>
    //     filtersIncludeToApply.every((filter) => filter(rulesToInclude, slot, rooms))
    // )

    // Convert the schedule array into a map for easier access
    const scheduleMap = mkSheduleMap(schedule)

    // Remove slots that are already in the schedule
    const slotsWithoutScheduleClasses = removeSheduledSlots(scheduleMap, slotsWithoutExclusionRules)

    // Remove slots that overlap (time wise) with the schedule appointments exepct for the selected lesson
    const scheduleWithoutSelectedLesson =
        selectedLessonID !== undefined
            ? schedule.filter((appointment) => {
                  return appointment.id !== selectedLessonID
              })
            : schedule
    return slotsWithoutScheduleClasses.filter((slot) => !isOverlapping(slot, scheduleWithoutSelectedLesson))
}
