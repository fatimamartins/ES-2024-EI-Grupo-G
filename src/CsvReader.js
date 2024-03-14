import CSVReader from 'react-csv-reader'
import React from 'react'

/**
 * CsvReader component that allows the user to upload a CSV file.
 * The data from the file is then passed to the setHorario function.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setHorario - The function to be called with the data from the CSV file.
 * @returns {JSX.Element} The rendered CSVReader component.
 */
export default function CsvReader({ setData, id }) {
    /**
     * Handles the event when a file is loaded.
     * It calls the setHorario function with the data from the file.
     *
     * @param {Object[]} data - The data from the CSV file.
     * @param {Object} fileInfo - Information about the loaded file.
     */
    const handleFileLoaded = (data, fileInfo) => {
        setData(data)
    }

    return (
        /**
         * The CSVReader component.
         * It calls the handleFileLoaded function when a file is loaded.
         * It skips empty lines and uses the first line of the file as headers.
         */
        <CSVReader
            inputId={id}
            onFileLoaded={handleFileLoaded}
            parserOptions={{
                header: true,
                skipEmptyLines: true,
            }}
            label="Escolher ficheiro"
            cssLabelClass="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary css-sghohy-MuiButtonBase-root-MuiButton-root"
            inputStyle={{ marginLeft: '-83px' }}
        />
    )
}
