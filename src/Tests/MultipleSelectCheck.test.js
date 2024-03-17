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
})
