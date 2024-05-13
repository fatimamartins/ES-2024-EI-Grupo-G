/**
 * @file replaceCourse.js
 * This file defines and exports a function `doesDayMatch` that checks if a given slot matches the rules for inclusion.
 */

/** @module date-fns */
import { addWeeks, format, getDay, startOfWeek } from 'date-fns'
/** @module utils */
import { getFormattedDateTime, parseDate, parseHour } from '../utils'
/** @module constants */
import {
    AFTERNOON_SHIFT,
    COURSE_END_TIMES,
    COURSE_START_TIMES,
    MORNING_SHIFT,
    NIGHT_SHIFT,
    ROOMS,
    WEEKDAYS,
} from '../constants'
/** @module dayjs */
import dayjs from 'dayjs'

/**
 * @function
 * @name hasRoom
 * @description This function checks if a room is available for a given slot.
 * @param {Object} slot - The slot to check room availability for.
 * @returns {boolean} Returns true if the room is available, false otherwise.
 */
export function hasRoom(rulesToInclude, row) {
    return rulesToInclude.salas.includes(row['Sala atribuída à aula'])
}

// Exclusion filters

/**
 * @function
 * @name doesStartHourMatch
 * @description This function checks if the start hour of a given slot matches the rules for inclusion.
 * @param {Object} slot - The slot to check the start hour for.
 * @returns {boolean} Returns true if the start hour matches the rules, false otherwise.
 */
export function doesStartHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora início da aula'] || !slot['Hora início da aula']) return false
    return rulesToExclude['Hora início da aula'] === slot['Hora início da aula']
}

/**
 * @function
 * @name doesEndHourMatch
 * @description This function checks if the end hour of a given slot matches the rules for inclusion.
 * @param {Object} slot - The slot to check the end hour for.
 * @returns {boolean} Returns true if the end hour matches the rules, false otherwise.
 */
export function doesEndHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora fim da aula'] || !slot['Hora fim da aula']) return false
    return rulesToExclude['Hora fim da aula'] === slot['Hora fim da aula']
}

/**
 * @function
 * @name isBetweenHours
 * @description This function checks if a given time is between two specified hours.
 * @param {Object} rulesToExclude - The rules that specify the start and end hours.
 * @param {Object} slot - The slot to check.
 * @returns {boolean} Returns true if the slot is between the hours specified in the rulesToExclude, false otherwise.
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
 * @function
 * @name isSameWeekDay
 * @description This function checks if two dates fall on the same day of the week.
 * @param {Object} rulesToExclude - The rules that specify the weekday.
 * @param {Object} slot - The slot to check.
 * @returns {boolean} Returns true if the slot falls on the same weekday as specified in the rulesToExclude, false otherwise.
 */
export function isSameWeekDay(rulesToExclude, slot) {
    if (!rulesToExclude.diaDaSemana || !slot['Data da aula']) return false
    const day1Index = WEEKDAYS.indexOf(rulesToExclude?.diaDaSemana) + 1
    const day2Index = getDay(parseDate(slot?.data)) // getDay returns 0 for Sunday but our WEEKDAYS array starts at Monday
    if (day2Index === 0) return false // skip Sundays
    return day1Index === day2Index
}

/**
 * @function
 * @name isSameShift
 * @description This function checks if a given slot falls within the same shift as specified in the rules.
 * @param {Object} rules - The rules that specify the shift.
 * @param {Object} slot - The slot to check.
 * @returns {boolean} Returns true if the slot falls within the same shift as specified in the rules, false otherwise.
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

/**
 * @function
 * @name getFiltersExcludeToApply
 * @description This function retrieves the filters to be applied for exclusion based on the provided rules.
 * @param {Object} rulesToExclude - The rules that specify the filters for exclusion.
 * @returns {Array<Function>} Returns an array of filter functions to be applied for exclusion.
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
 * @function
 * @name getAllSlots
 * @description This function retrieves all slots based on the provided parameters.
 * @param {Object} rulesToInclude - The rules that specify the criteria for retrieving slots.
 * @param {Array<string>} rooms - The rooms in which to check for available slots.
 * @returns {Array<Object>} Returns an array of slots that match the provided criteria and are available in the provided rooms.
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

/**
 * @function
 * @name getSlotTime
 * @description This function retrieves the time of a given slot.
 * @param {Date} start - The start time of the slot.
 * @param {Date} end - The end time of the slot.
 * @returns {Date} Returns the time of the slot with the provided start and end times.
 */
function getSlotTime(start, end) {
    const startHour = parseHour(start)
    const endHour = parseHour(end)
    return endHour - startHour
}

/**
 * @function
 * @name getRoomsWithSelectedFeature
 * @description This function retrieves all rooms that have a specific feature.
 * @param {Object} rulesToInclude - The rules that specify the features to check for in the rooms.
 * @param {Array<string>} rooms - The rooms to check for the specified features.
 * @returns {Array<string>} Returns an array of rooms that have the features specified in rulesToInclude.
 */
function getRoomsWithSelectedFeature(rulesToInclude, rooms) {
    return rooms.filter((room) =>
        rulesToInclude?.caracteristicas?.some((caracteristica) => room[caracteristica] === 'X')
    )
}

/**
 * @function
 * @name getRoomsToIterate
 * @description This function retrieves the rooms that need to be iterated over based on the provided parameters.
 * @param {Object} rulesToInclude - The rules that specify the criteria for retrieving rooms.
 * @param {Array<string>} rooms - The rooms to check against the specified criteria.
 * @returns {Array<string>} Returns an array of rooms that match the criteria specified in rulesToInclude.
 */
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

/**
 * @function
 * @name getStartTime
 * @description This function retrieves the start time of a given course.
 * @param {Object} rulesToInclude - The rules that specify the start time.
 * @returns {Date} Returns the start time specified in the rulesToInclude.
 */
function getStartTime(rulesToInclude) {
    if (rulesToInclude?.dataInicio) {
        const selectedStartTime = rulesToInclude?.dataInicio.format('HH:mm:ss')
        return COURSE_START_TIMES.filter((time) => time >= selectedStartTime)
    }
    return COURSE_START_TIMES
}

/**
 * @function
 * @name getEndTime
 * @description This function retrieves the end time specified in the rules.
 * @param {Object} rulesToInclude - The rules that specify the end time.
 * @returns {Date} Returns the end time specified in the rulesToInclude.
 */
function getEndTime(rulesToInclude) {
    if (rulesToInclude?.dataFim) {
        const selectedEndTime = rulesToInclude?.dataFim.format('HH:mm:ss')
        return COURSE_END_TIMES.filter((time) => time <= selectedEndTime)
    }
    return COURSE_END_TIMES
}

/**
 * @function
 * @name getEndDate
 * @description This function retrieves the end date specified in the rules.
 * @param {Object} rulesToInclude - The rules that specify the end date.
 * @returns {Date} Returns the end date specified in the rulesToInclude.
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
 * @function
 * @name getDatesExcludingSundays
 * @description This function retrieves all dates within a specified range, excluding Sundays.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Array<Date>} Returns an array of dates within the specified range, excluding Sundays.
 */
export function getDatesExcludingSundays(startDate, endDate) {
    const result = []

    let currentDate = startDate

    // Loop through the dates and add them to the result array excluding Sundays
    // this loop doesn't include the end date
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
 * @function
 * @name mkId
 * @description This function generates a unique identifier.
 * @param {Object} entry - The entry based on which the unique identifier is to be generated.
 * @returns {string} Returns a unique identifier based on the provided entry.
 */
export function mkId(entry) {
    return `${entry['Data da aula']}-${entry['Hora início da aula']}-${entry['Hora fim da aula']}-${entry['Sala atribuída à aula']}`
}

/**
 * @function
 * @name mkSheduleMap
 * @description This function generates a schedule map based on the provided parameters.
 * @param {Array<Object>} appointments - The appointments to include in the schedule map.
 * @returns {Map<string, Object>} Returns a schedule map based on the provided appointments.
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
 * @function
 * @name removeSheduledSlots
 * @description This function removes scheduled slots from the provided schedule map.
 * @param {Map<string, Object>} map - The map to remove slots from.
 * @param {Array<Object>} slots - The slots to remove from the map.
 * @returns {Map<string, Object>} Returns the updated map after removing the specified slots.
 */
export function removeSheduledSlots(map, slots) {
    return slots.reduce((acc, slot) => {
        const id = mkId(slot)
        return map.has(id) ? acc : [...acc, slot]
    }, [])
}

/**
 * @function
 * @name isOverlapping
 * @description This function checks if two time periods overlap.
 * @param {Object} slot - The slot to check for overlap.
 * @param {Array<Object>} schedule - The schedule to check against.
 * @returns {boolean} Returns true if the slot overlaps with any slot in the schedule, false otherwise.
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

/**
 * @function
 * @name getNextWeekDate
 * @description This function retrieves the date of the same day of the week in the next week.
 * @param {Date} date - The date to get the next week's date for.
 * @param {string} time - The time to get the next week's time for.
 * @returns {Date} Returns the date and time of the same day of the week in the next week.
 */
export function getNextWeekDate(date, time) {
    const currentWeekStartDate = startOfWeek(parseDate(date), { weekStartsOn: 1 }) // Assuming Monday is the start of the week (change as needed)
    // Add 1 week to get the start date of the next week
    const nextWeekStartDate = format(addWeeks(currentWeekStartDate, 1), 'dd/MM/yyyy')
    return dayjs(getFormattedDateTime(nextWeekStartDate, time, "yyyy-MM-dd'T'HH:mm"))
}

// Lookup function which returns the available slots
/**
 * @function
 * @name lookupSlots
 * @description This function looks up the slots in a given schedule.
 * @param {Array<Object>} rulesToInclude - The rules to include when looking up slots.
 * @param {Array<Object>} rulesToExclude - The rules to exclude when looking up slots.
 * @param {Array<Object>} schedule - The schedule to look up slots in.
 * @param {Array<Object>} rooms - The rooms to consider when looking up slots.
 * @param {string} selectedLessonID - The ID of the selected lesson to consider when looking up slots.
 * @returns {Array<Object>} Returns an array of slots found in the schedule based on the provided rules and selected lesson ID.
 */
export function lookupSlots(rulesToInclude, rulesToExclude, schedule, rooms, selectedLessonID) {
    // Get all available slots based on the rules to include
    const allSlots = getAllSlots(rulesToInclude, rooms)

    // Remove all slots that match the exclusion filters
    const filtersExcludeToApply = getFiltersExcludeToApply(rulesToExclude)
    const slotsWithoutExclusionRules = allSlots.filter(
        (slot) => !filtersExcludeToApply.some((filter) => filter(rulesToExclude, slot))
    )

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
