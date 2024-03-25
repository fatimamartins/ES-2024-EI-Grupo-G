import { atom } from 'jotai'

// Represents the state of the modal that allows the user to replace a course.
// If null, the modal is closed. If not null, the modal is open with the info of the selected course.
export const atomModalReplaceCourse = atom(null)
