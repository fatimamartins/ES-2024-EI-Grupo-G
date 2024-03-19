import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import MultipleSelectCheckmarks from '../MultipleSelectCheckmarks'

describe('MultipleSelectCheckmarks Component', () => {
    const defaultColumns = [
        { title: 'Curso', visible: true },
        { title: 'Unidade Curricular', visible: true },
        { title: 'Turno', visible: true },
        { title: 'Turma', visible: true },
        { title: 'Inscritos no turno', visible: true },
        { title: 'Dia da semana', visible: true },
        { title: 'Hora início da aula', visible: true },
        { title: 'Hora fim da aula', visible: true },
        { title: 'Data da aula', visible: true },
        { title: 'Características da sala pedida para a aula', visible: true },
        { title: 'Sala atribuída à aula', visible: true },
        { title: 'Semana do ano', visible: true },
        { title: 'Semana do semestre', visible: true },
    ]

    it('renders without crashing', () => {
        render(<MultipleSelectCheckmarks defaultColumns={defaultColumns} setColumns={() => {}} />)
    })

    it('allows selecting columns via checkboxes', () => {
        const setColumnsMock = jest.fn()
        const { getByLabelText, getByText } = render(
            <MultipleSelectCheckmarks defaultColumns={defaultColumns} setColumns={setColumnsMock} />
        )
        const selectInput = getByLabelText('Colunas')

        fireEvent.mouseDown(selectInput)

        const checkboxes = defaultColumns.map((col) => getByText(col.title))
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox)
        })

        expect(setColumnsMock).toHaveBeenCalledTimes(defaultColumns.length)
    })

    it('updates selectedColumns state based on the type of value passed and checks their visibility', () => {
        const setColumnsMock = jest.fn()
        const { getByLabelText, getByText } = render(
            <MultipleSelectCheckmarks defaultColumns={defaultColumns} setColumns={setColumnsMock} />
        )
        const selectInput = getByLabelText('Colunas')

        // Open the dropdown
        fireEvent.mouseDown(selectInput)

        // Select columns with string value
        fireEvent.click(getByText('Curso'))
        fireEvent.click(getByText('Turno'))

        // Check if setColumnsMock is called with expected state
        expect(setColumnsMock).toHaveBeenCalledWith([
            { title: 'Curso', visible: false },
            { title: 'Unidade Curricular', visible: true },
            { title: 'Turno', visible: false },
            { title: 'Turma', visible: true },
            { title: 'Inscritos no turno', visible: true },
            { title: 'Dia da semana', visible: true },
            { title: 'Hora início da aula', visible: true },
            { title: 'Hora fim da aula', visible: true },
            { title: 'Data da aula', visible: true },
            { title: 'Características da sala pedida para a aula', visible: true },
            { title: 'Sala atribuída à aula', visible: true },
            { title: 'Semana do ano', visible: true },
            { title: 'Semana do semestre', visible: true },
        ])

        // Open the dropdown again
        fireEvent.mouseDown(selectInput)

        // Deselect columns with array value
        fireEvent.click(getByText('Unidade Curricular'))
        fireEvent.click(getByText('Turno'))

        // Check if setColumnsMock is called with expected state
        expect(setColumnsMock).toHaveBeenCalledWith([
            { title: 'Curso', visible: false },
            { title: 'Unidade Curricular', visible: false },
            { title: 'Turno', visible: true },
            { title: 'Turma', visible: true },
            { title: 'Inscritos no turno', visible: true },
            { title: 'Dia da semana', visible: true },
            { title: 'Hora início da aula', visible: true },
            { title: 'Hora fim da aula', visible: true },
            { title: 'Data da aula', visible: true },
            { title: 'Características da sala pedida para a aula', visible: true },
            { title: 'Sala atribuída à aula', visible: true },
            { title: 'Semana do ano', visible: true },
            { title: 'Semana do semestre', visible: true },
        ])
    })
})
