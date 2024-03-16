import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RemoteFile from '../RemoteFile'

describe('RemoteFile component', () => {
    test('renders input and button', () => {
        const { getByPlaceholderText, getByText } = render(<RemoteFile />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        expect(input).toBeInTheDocument()
        expect(button).toBeInTheDocument()
    })

    //https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv

    test('handles file change', () => {
        const { getByPlaceholderText } = render(<RemoteFile />)
        const input = getByPlaceholderText('CSV File URL')
        fireEvent.change(input, {
            target: {
                value: 'https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv',
            },
        })

        expect(input.value).toBe(
            'https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv'
        )
    })

    test('handles file upload error', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false })

        console.error = jest.fn()
        const { getByPlaceholderText, getByText } = render(<RemoteFile />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        fireEvent.change(input, {
            target: {
                value: 'https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv',
            },
        })
        fireEvent.click(button)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv'
            )
            expect(console.error).toHaveBeenCalledWith('Error fetching CSV:', expect.any(Error))
        })
    })

    it('logs error if file fetch fails', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({ ok: false })
        console.error = jest.fn()
        const { getByPlaceholderText, getByText } = render(<RemoteFile setData={() => {}} />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        fireEvent.change(input, { target: { value: 'example.csv' } })
        fireEvent.click(button)

        await waitFor(() => expect(console.error).toHaveBeenCalled())
    })

    it('updates fileName state when input changes', () => {
        const { getByPlaceholderText } = render(<RemoteFile setData={() => {}} />)
        const input = getByPlaceholderText('CSV File URL')

        fireEvent.change(input, { target: { value: 'example.csv' } })

        expect(input).toHaveValue('example.csv')
    })

    it('calls fetch with the correct file URL', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, text: jest.fn() })
        const { getByPlaceholderText, getByText } = render(<RemoteFile setData={() => {}} />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        fireEvent.change(input, { target: { value: 'https://example.com/file.csv' } })
        fireEvent.click(button)

        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.csv'))
    })
})
