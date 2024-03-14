/**
 * @file This file contains a function to report web vitals.
 */

/**
 * Reports web vitals if the provided parameter is a function.
 * @param {Function} onPerfEntry - The function to be called with the performance entries.
 */
const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry)
            getFID(onPerfEntry)
            getFCP(onPerfEntry)
            getLCP(onPerfEntry)
            getTTFB(onPerfEntry)
        })
    }
}

export default reportWebVitals
