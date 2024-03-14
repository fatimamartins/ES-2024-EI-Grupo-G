import React from 'react'
import CSVReader from 'react-csv-reader'

export default function CsvReader({ setData, id }) {
    const handleFileLoaded = (data, fileInfo) => {
        setData(data)
    }

    return (
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
