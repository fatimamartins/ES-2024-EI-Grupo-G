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
