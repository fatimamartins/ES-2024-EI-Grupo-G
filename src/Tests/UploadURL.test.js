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

    /*test('handles file upload', async () => {
        const mockData = [
            {
                Curso: 'Engenharia de Software',
                'Unidade Curricular': 'Programação',
                Turno: 'Manhã',
                Turma: 'A',
                'Inscritos no turno': 30,
                'Dia da semana': 'Seg',
                'Hora início da aula': '08:00:00',
                'Hora fim da aula': '10:00:00',
                'Data da aula': '01/03/2024',
                'Características da sala pedida para a aula': 'Laboratório de Informática',
                'Sala atribuída à aula': 'Sala 101',
                'Semana do ano': 9,
                'Semana do semestre': 3,
            },
        ]

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('Name,Age\nJohn,30\nJane,25\n'),
        })

        const setDataMock = jest.fn()
        const { getByPlaceholderText, getByText } = render(<RemoteFile setData={setDataMock} />)
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
            expect(setDataMock).toHaveBeenCalledWith(mockData)
        })
    })

    test('handles file upload', async () => {
        // Mock data
        const mockData = [
            {
                Curso: 'Engenharia de Software',
                'Unidade Curricular': 'Programação',
                Turno: 'Manhã',
                Turma: 'A',
                'Inscritos no turno': 30,
                'Dia da semana': 'Seg',
                'Hora início da aula': '08:00:00',
                'Hora fim da aula': '10:00:00',
                'Data da aula': '01/03/2024',
                'Características da sala pedida para a aula': 'Laboratório de Informática',
                'Sala atribuída à aula': 'Sala 101',
                'Semana do ano': 9,
                'Semana do semestre': 3,
            },
            // Adicione mais objetos conforme necessário para representar mais linhas de dados
        ]

        // Simulando a função setData
        const setDataMock = jest.fn()

        // Renderizando o componente
        const { getByPlaceholderText, getByText } = render(<RemoteFile setData={setDataMock} />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        // Simulando a mudança e o clique no botão de upload
        fireEvent.change(input, {
            target: {
                value: 'https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv',
            },
        })
        fireEvent.click(button)

        // Esperando pela chamada de fetch e setData
        await waitFor(() => {
            expect(setDataMock).toHaveBeenCalledWith(mockData)
        })
    })

    test('handles file upload error', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false })

        console.error = jest.fn()
        const { getByPlaceholderText, getByText } = render(<RemoteFile />)
        const input = getByPlaceholderText('CSV File URL')
        const button = getByText('Upload')

        fireEvent.change(input, { target: { value: 'https://example.com/nonexistent.csv' } })
        fireEvent.click(button)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('https://example.com/nonexistent.csv')
            expect(console.error).toHaveBeenCalledWith('Error fetching CSV:', expect.any(Error))
        })
    })*/
})
