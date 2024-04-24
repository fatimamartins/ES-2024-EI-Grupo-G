module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/index.js',
        '!src/App.js',
        '!src/CourseSlotsModal.js',
        '!src/ReplaceCourse.js',
        '!src/RoomsTable.js',
        '!src/ScheduleTable.js',
        '!src/SlotsTable.js',
        '!src/ScheduleTableFilter.js',
        '!src/atoms/*.js',
        '!src/slotsModalComponents/*.js',
        '!src/serviceWorker.js',
        '!src/reportWebVitals.js',
        '!src/setupTests.js',
    ],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
