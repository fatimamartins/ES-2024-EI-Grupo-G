/**
 * @file This is the CsvReader component of the application.
 */

/** @module react */
import React from 'react'
/** @module react-csv-reader */
import CSVReader from 'react-csv-reader'
import { useSetAtom } from 'jotai'
import { atomSchedule } from './atoms/schedule'
import { atomRooms } from './atoms/rooms'

/**
 * This is the CsvReader component of the application.
 * It manages the loading of CSV files and passes the data to the parent component.
 *
 * @function
 * @name CsvReader
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setData - The function to call with the data from the CSV file.
 * @param {string} props.id - The id of the input element.
 * @returns {JSX.Element} The rendered CsvReader component.
 */
export default function CsvReader({ id }) {
    const setData = useSetAtom(id === 'scheduleReader' ? atomSchedule : atomRooms)
    /**
     * This function is called when a file is loaded.
     * It calls the setData function with the data from the file.
     *
     * @param {Object[]} data - The data from the CSV file.
     * @param {Object} fileInfo - Information about the loaded file.
     */
    const handleFileLoaded = (data, fileInfo) => {
        const dataWithIndex = data.map((item, index) => {
            if (id === 'scheduleReader') {
                const parseInscritos = parseInt(item['Inscritos no turno'])
                return { ...item, id: index, 'Inscritos no turno': parseInscritos }
            } else if (id === 'roomsReader') {
                const parseNormal = parseInt(item['Capacidade Normal'])
                const parseExame = parseInt(item['Capacidade Exame'])
                const parseCaracteristicas = parseInt(item['Nº características'])

                return {
                    ...item,
                    id: index,
                    'Capacidade Normal': parseNormal,
                    'Capacidade Exame': parseExame,
                    'Nº características': parseCaracteristicas,
                }
            }
            return { ...item, id: index }
        })
        setData(dataWithIndex)
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
