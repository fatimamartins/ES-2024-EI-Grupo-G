/**
 * @file modalSlotsClass.js
 * @description This file contains an atom that represents the state of the modal that allows the user to get slots for a given class. It imports the atom function from 'jotai'.
 */

/** @module jotai */
import { atom } from 'jotai'

export const atomModalSlotsClass = atom({ isOpen: false, slots: [] })
