/**
 * @file This is the entry point for the React application.
 */

// Import necessary modules and stylesheets
/** @module react */
import React from 'react'
/** @module react-dom/client */
import ReactDOM from 'react-dom/client'
/** @module index.css */
import './index.css'
/** @module react-tabulator/lib/styles.css */
import 'react-tabulator/lib/styles.css'
/** @module react-tabulator/lib/css/tabulator.min.css */
import 'react-tabulator/lib/css/tabulator.min.css' // theme
/** @module App */
import App from './App'
/** @module reportWebVitals */
import reportWebVitals from './reportWebVitals'
// Import font styles
/** @module @fontsource/roboto/300.css */
import '@fontsource/roboto/300.css'
/** @module @fontsource/roboto/400.css */
import '@fontsource/roboto/400.css'
/** @module @fontsource/roboto/500.css */
import '@fontsource/roboto/500.css'
/** @module @fontsource/roboto/700.css */
import '@fontsource/roboto/700.css'
import { BrowserRouter } from 'react-router-dom'

/**
 * This is the entry point for the React application.
 * It renders the App component into the root element.
 */
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
