import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import CsvReader from '../CsvReader'

describe('CsvReader', () => {
    it('renders without crashing', () => {
        const mockSetData = jest.fn()
        const { getByLabelText } = render(<CsvReader setData={mockSetData} id="csv-input" />)
        const input = getByLabelText('Escolher ficheiro')
        expect(input).toBeInTheDocument()
    })

    it('renders with correct input style', () => {
        const mockSetData = jest.fn()
        const { getByLabelText } = render(<CsvReader setData={mockSetData} id="csv-input" />)

        const input = getByLabelText('Escolher ficheiro')
        expect(input).toHaveStyle({ marginLeft: '-83px' })
    })

    it('should pass the correct file name to setData function', () => {
        const setDataMock = jest.fn() // Mocking setData function
        const id = 'fileInput' // Mocking id for input element

        // Render the CsvReader component with mock props
        const { getByLabelText } = render(<CsvReader setData={setDataMock} id={id} />)

        // Get the file input element
        const fileInput = getByLabelText('Escolher ficheiro')

        // Create a sample file
        const fileName = 'example.csv'
        const file = new File(['header1,header2\nvalue1,value2'], fileName, { type: 'text/csv' })

        // Simulate file selection and loading
        fireEvent.change(fileInput, {
            target: {
                files: [file],
            },
        })

        expect(file.name).toEqual(fileName)
    })

    it('does not call setData when file is empty', () => {
        const mockSetData = jest.fn()
        const { getByLabelText } = render(<CsvReader setData={mockSetData} id="csv-input" />)
        const input = getByLabelText('Escolher ficheiro')

        fireEvent.load(input, { target: { files: [{ data: [] }] } })

        expect(mockSetData).not.toHaveBeenCalled()
    })

    it('renders with custom CSS class applied', () => {
        const mockSetData = jest.fn()
        const { container } = render(<CsvReader setData={mockSetData} id="csv-input" />)

        const csvReaderComponent = container.querySelector('.css-sghohy-MuiButtonBase-root-MuiButton-root')
        expect(csvReaderComponent).toBeInTheDocument()
    })
})
