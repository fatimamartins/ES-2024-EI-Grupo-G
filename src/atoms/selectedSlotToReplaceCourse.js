import { atom } from 'jotai'

// Represents the state of the slot chosen to replace a course.
// If null, no slot has been chosen. If not null, the slot is selected.
export const atomSeletedSlotToReplaceCourse = atom(null)
