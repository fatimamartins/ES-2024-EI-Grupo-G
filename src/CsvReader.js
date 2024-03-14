/**
 * CsvReader component that allows the user to upload a CSV file.
 * The data from the file is then passed to the setHorario function.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setHorario - The function to be called with the data from the CSV file.
 * @returns {JSX.Element} The rendered CSVReader component.
 */
export default function CsvReader({ setHorario }) {
    /**
     * Handles the event when a file is loaded.
     * It calls the setHorario function with the data from the file.
     *
     * @param {Object[]} data - The data from the CSV file.
     * @param {Object} fileInfo - Information about the loaded file.
     */
    const handleFileLoaded = (data, fileInfo) => {
        setHorario(data)
    }

    return (
        /**
         * The CSVReader component.
         * It calls the handleFileLoaded function when a file is loaded.
         * It skips empty lines and uses the first line of the file as headers.
         */
        <CSVReader
            onFileLoaded={handleFileLoaded}
            parserOptions={{
                header: true,
                skipEmptyLines: true,
            }}
        />
    )
}
