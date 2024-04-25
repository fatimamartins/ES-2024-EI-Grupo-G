/**
 * @file constants
 * This file exports constants used throughout the application, such as COURSE_START_TIMES, which represents the time the courses start.
 */

/**
 * @typedef {Object} COURSE_START_TIMES - Object representing the time the courses start
 * */
export const COURSE_START_TIMES = [
    '08:00:00',
    '08:30:00',
    '09:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '12:00:00',
    '12:30:00',
    '13:00:00',
    '13:30:00',
    '14:00:00',
    '14:30:00',
    '15:00:00',
    '15:30:00',
    '16:00:00',
    '16:30:00',
    '17:00:00',
    '17:30:00',
    '18:00:00',
    '18:30:00',
    '19:00:00',
    '19:30:00',
    '20:00:00',
    '20:30:00',
    '21:00:00',
    '21:30:00',
]

/**
 * @typedef {Object} COURSE_END_TIMES - Object representing the time the courses end
 * */
export const COURSE_END_TIMES = [
    '09:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '12:00:00',
    '12:30:00',
    '13:00:00',
    '13:30:00',
    '14:00:00',
    '14:30:00',
    '15:00:00',
    '15:30:00',
    '16:00:00',
    '16:30:00',
    '17:00:00',
    '17:30:00',
    '18:00:00',
    '18:30:00',
    '19:00:00',
    '19:30:00',
    '20:00:00',
    '20:30:00',
    '21:00:00',
    '21:30:00',
    '22:00:00',
    '22:30:00',
]

/**
 * @typedef {Object} WEEKDAYS - Object representing the days of the week
 * */
export const WEEKDAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

/**
 * @typedef {Object} DAY_PERIODS - Object representing the periods of the day
 */
export const DAY_PERIODS = ['Manhã', 'Tarde', 'Noite']

/**
 * @typedef {Object} ROOMS - Object representing a list of rooms.
 */
export const ROOMS = [
    'Auditório Afonso de Barros',
    'Auditório Silva Leal',
    'AA2.23',
    'AA2.24',
    'AA2.25',
    'AA2.26',
    'AA2.28',
    'AA2.29',
    'AA3.23',
    'AA3.24',
    'AA3.25',
    'AA3.26',
    'AA3.28',
    'AA3.29',
    'AA3.30',
    'AA3.32',
    'AA3.40',
    'AA4.07',
    'C0.08',
    'D0.01',
    'D0.03',
    'D0.05',
    'Espaço Exposições',
    'A1',
    'Auditório B1.03',
    'Auditório B1.04',
    'Auditório C1.03',
    'Auditório C1.04',
    'B1',
    'B1.01',
    'B1.02',
    'Balcão Recepção',
    'C1',
    'C1.01',
    'D1.01',
    'D1.02',
    'D1.03',
    'D1.04',
    'D1.05',
    'D1.06',
    'D1.07',
    'D1.08',
    'D1.09',
    'D1.10',
    'D1.11',
    'D1.12',
    'D1.14',
    'Grande Auditório',
    'Auditório B2.03',
    'Auditório B2.04',
    'B2',
    'B2.01',
    'B2.02',
    'C2.01',
    'C2.02',
    'C2.03',
    'C2.05',
    'D2.16',
    'B3.01',
    'B3.02',
    'B3.03',
    'B3.04',
    'B3.05',
    'B3.06',
    'C3.01',
    'C3.02',
    'C3.03',
    'D3.16',
    'C4.01',
    'C4.02',
    'C4.03',
    'C4.04',
    'C4.05',
    'C4.06',
    'C4.07',
    'C4.08',
    'C4.09',
    'C5.01',
    'C5.02',
    'C5.03',
    'C5.04',
    'C5.05',
    'C5.06',
    'C5.07',
    'C5.08',
    'C5.09',
    'C6.01',
    'C6.02',
    'C6.06',
    'C6.07',
    'C6.08',
    'C6.09',
    'C6.10',
    'C7.05',
    'C7.06',
    'C7.07',
    'C7.08',
    'C7.09',
    'C7.10',
    '0E00',
    '0E07.1',
    '0NE',
    '0S01',
    '0S02',
    'Auditório 0NE01',
    'Auditório 0NE02-Caiano Pereira',
    'Auditório 0NE03 - Mário Murteira',
    '1E02',
    '1E03',
    '1E04',
    '1E05',
    '1E06',
    '1E07',
    '1E08',
    '1E10',
    '1NE00',
    'Auditório 1',
    'Auditório 1NE03 - JJ Laginha',
    '2E02',
    '2E03',
    '2E04',
    '2E05',
    '2E06',
    '2E07',
    '2E08',
    '2E10',
    'Auditório 2',
    'Auditório 4',
    'Balneário feminino',
    'Balneário masculino',
    'Campo',
]

/**
 * @typedef {Object} ROOM_FEATURES - Object representing a list of rooms characteristics.
 */
export const ROOM_FEATURES = [
    'Anfiteatro aulas',
    'Apoio técnico eventos',
    'Arq 1',
    'Arq 2',
    'Arq 3',
    'Arq 4',
    'Arq 5',
    'Arq 6',
    'Arq 9',
    'BYOD (Bring Your Own Device)',
    'Focus Group',
    'Horário sala visível portal público',
    'Laboratório de Arquitectura de Computadores I',
    'Laboratório de Arquitectura de Computadores II',
    'Laboratório de Bases de Engenharia',
    'Laboratório de Electrónica',
    'Laboratório de Informática',
    'Laboratório de Jornalismo',
    'Laboratório de Redes de Computadores I',
    'Laboratório de Redes de Computadores II',
    'Laboratório de Telecomunicações',
    'Sala Aulas Mestrado',
    'Sala Aulas Mestrado Plus',
    'Sala NEE',
    'Sala Provas',
    'Sala Reunião',
    'Sala de Arquitectura',
    'Sala de Aulas normal',
    'videoconferência',
    'Átrio',
]

/**
 * @typedef {Object} TYPE_FILTER_COMPARISON - Object representing a list of type filters comparison.
 */
export const TYPE_FILTER_COMPARISON = ['=', '!=', 'like', 'starts', 'ends', '<', '>', '<=', '>=']

/**
 * @typedef {Object} MORNING_SHIFT - Object representing the morning shift.
 */
export const MORNING_SHIFT = [
    '08:00:00',
    '08:30:00',
    '09:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '12:00:00',
    '12:30:00',
]

/**
 * @typedef {Object} AFTERNOON_SHIFT - Object representing the afternoon shift.
 */
export const AFTERNOON_SHIFT = [
    '13:00:00',
    '13:30:00',
    '14:00:00',
    '14:30:00',
    '15:00:00',
    '15:30:00',
    '16:00:00',
    '16:30:00',
    '17:00:00',
    '17:30:00',
]

/**
 * @typedef {Object} NIGHT_SHIFT - Object representing the night shift.
 */
export const NIGHT_SHIFT = [
    '18:00:00',
    '18:30:00',
    '19:00:00',
    '19:30:00',
    '20:00:00',
    '20:30:00',
    '21:00:00',
    '21:30:00',
    '22:00:00',
    '22:30:00',
]

export const COURSE_DURATION = [
    { key: '00:30:00', value: '1800000' },
    { key: '01:00:00', value: '3600000' },
    { key: '01:30:00', value: '5400000' },
    { key: '02:00:00', value: '7200000' },
    { key: '02:30:00', value: '9000000' },
    { key: '03:00:00', value: '10800000' },
    { key: '03:30:00', value: '12600000' },
    { key: '04:00:00', value: '14400000' },
    { key: '04:30:00', value: '16200000' },
]
