import { atom } from 'jotai'

// Represents the state of the modal that allows the user get slots for a given class
export const atomModalSlotsClass = atom({ isOpen: false, slots: [] })
