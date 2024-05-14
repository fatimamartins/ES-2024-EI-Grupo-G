/**
 * @file reportWebVitals.js
 * This file contains a function to report web vitals.
 */

/**
 * @function
 * @name reportWebVitals
 * @description This function reports web vitals if the provided parameter is a function. The web vitals reported are: Cumulative Layout Shift (CLS), First Input Delay (FID), First Contentful Paint (FCP), Largest Contentful Paint (LCP), Time to First Byte (TTFB).
 * @param {Function} onPerfEntry - The function to be called with the performance entries. If this parameter is not a function, the function will not do anything.
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
