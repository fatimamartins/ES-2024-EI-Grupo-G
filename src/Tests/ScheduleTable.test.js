jest.mock('tabulator-tables', () => {
    return { TabulatorFull: jest.fn() }
})

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleTable from '../ScheduleTable'
import TabulatorFull from 'tabulator-tables'
import { act } from 'react-dom/test-utils'

describe('ScheduleTable', () => {
    const defaultData = [
        {
            Curso: 'ME',
            'Unidade Curricular': 'Teoria dos Jogos e dos Contratos',
            Turno: '01789TP01',
            Turma: 'MEA1',
            'Inscritos no turno': '30',
            'Dia da semana': 'Seg',
            'Hora início da aula': '13:00:00',
            'Hora fim da aula': '14:30:00',
            'Data da aula': '14/11/2022',
            'Características da sala pedida para a aula': 'Sala Aulas Mestrado',
            'Sala atribuída à aula': 'AA2.25',
        },
        {
            Curso: 'ME',
            'Unidade Curricular': 'Teoria dos Jogos e dos Contratos',
            Turno: '01789TP01',
            Turma: 'MEA1',
            'Inscritos no turno': '30',
            'Dia da semana': 'Ter',
            'Hora início da aula': '13:00:00',
            'Hora fim da aula': '14:30:00',
            'Data da aula': '15/11/2022',
            'Características da sala pedida para a aula': 'Sala Aulas Mestrado',
            'Sala atribuída à aula': 'AA2.25',
        },
        {
            Curso: 'LETI, LEI, LEI-PL',
            'Unidade Curricular': 'Cálculo I',
            Turno: '03703TP02',
            Turma: 'EI-A6, EI-A5, EI-A4, EI-A3, EI-A2, EI-A1',
            'Inscritos no turno': '52',
            'Dia da semana': 'Qua',
            'Hora início da aula': '13:00:00',
            'Hora fim da aula': '14:30:00',
            'Data da aula': '26/10/2022',
            'Características da sala pedida para a aula': 'Sala/anfiteatro aulas',
            'Sala atribuída à aula': 'C6.10',
        },
        {
            Curso: 'LGRH',
            'Unidade Curricular': 'Relações Laborais',
            Turno: 'RLTP01',
            Turma: 'GRHB1',
            'Inscritos no turno': '47',
            'Dia da semana': 'Sex',
            'Hora início da aula': '08:00:00',
            'Hora fim da aula': '09:30:00',
            'Data da aula': '25/11/2022',
            'Características da sala pedida para a aula': 'Sala/anfiteatro aulas',
            'Sala atribuída à aula': 'C4.07\r',
        },
        {
            Curso: 'LETI, LEI, LEI-PL, LIGE, LIGE-PL',
            'Unidade Curricular': 'Programação Orientada para Objectos',
            Turno: 'L5315PL10',
            Turma: 'EI-B8, EI-B7, EI-B6, EI-B5',
            'Inscritos no turno': '13',
            'Dia da semana': 'Ter',
            'Hora início da aula': '11:00:00',
            'Hora fim da aula': '12:30:00',
            'Data da aula': '13/09/2022',
            'Características da sala pedida para a aula': 'Laboratório de Informática',
            'Sala atribuída à aula': '0S02\r',
        },
        {
            Curso: 'LCP, LS, LS-PL',
            'Unidade Curricular': 'Análise de Dados em Ciências Sociais - Descritiva',
            Turno: 'L5400TP06',
            Turma: 'S-PL-A2',
            'Inscritos no turno': '30',
            'Dia da semana': 'Ter',
            'Hora início da aula': '19:30:00',
            'Hora fim da aula': '21:00:00',
            'Data da aula': '22/11/2022',
            'Características da sala pedida para a aula': 'Laboratório de Informática',
            'Sala atribuída à aula': 'D1.11\r',
        },
        {
            Curso: 'LEI, LEI-PL',
            'Unidade Curricular': 'Agentes Autónomos',
            Turno: '03727PL06',
            Turma: 'EI-C3, EI-C2, EI-C1',
            'Inscritos no turno': '58',
            'Dia da semana': 'Qua',
            'Hora início da aula': '14:30:00',
            'Hora fim da aula': '16:00:00',
            'Data da aula': '19/10/2022',
            'Características da sala pedida para a aula': 'Sala de Aulas normal',
            'Sala atribuída à aula': 'C5.08',
        },
        {
            Curso: 'METI, MEI',
            'Unidade Curricular': 'Segurança em Redes e Sistemas de Informação',
            Turno: '00010TP07',
            Turma: 'MEI-A1',
            'Inscritos no turno': '39',
            'Dia da semana': 'Qui',
            'Hora início da aula': '14:30:00',
            'Hora fim da aula': '16:00:00',
            'Data da aula': '20/10/2022',
            'Características da sala pedida para a aula': 'Sala Aulas Mestrado',
            'Sala atribuída à aula': 'B1.02',
        },
        // Add more data as needed
    ]

    const salas = [
        {
            'Edif�cio': 'Ala Aut�noma (ISCTE-IUL)',
            'Nome sala': 'Audit�rio Afonso de Barros',
            'Capacidade Normal': '80',
            'Capacidade Exame': '39',
            'N� caracter�sticas': '4',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': '',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': '',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': 'X',
            'Sala Aulas Mestrado Plus': 'X',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': '',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': 'X',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        {
            'Edif�cio': 'Ala Aut�noma (ISCTE-IUL)',
            'Nome sala': 'Audit�rio Silva Leal',
            'Capacidade Normal': '54',
            'Capacidade Exame': '27',
            'N� caracter�sticas': '4',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': '',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': '',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': 'X',
            'Sala Aulas Mestrado Plus': 'X',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': '',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': 'X',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        {
            'Edif�cio': 'Edif�cio II (ISCTE-IUL)',
            'Nome sala': 'B1.02',
            'Capacidade Normal': '1',
            'Capacidade Exame': '0',
            'N� caracter�sticas': '2',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': '',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': '',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': '',
            'Sala Aulas Mestrado Plus': '',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': 'X',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': '',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        {
            'Edif�cio': 'Edif�cio II (ISCTE-IUL)',
            'Nome sala': 'D1.07',
            'Capacidade Normal': '27',
            'Capacidade Exame': '18',
            'N� caracter�sticas': '5',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': 'X',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': '',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': 'X',
            'Sala Aulas Mestrado Plus': 'X',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': '',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': 'X',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        {
            'Edif�cio': 'Edif�cio Sedas Nunes (ISCTE-IUL)',
            'Nome sala': '0S02',
            'Capacidade Normal': '41',
            'Capacidade Exame': '23',
            'N� caracter�sticas': '2',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': '',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': 'X',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': '',
            'Sala Aulas Mestrado Plus': '',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': '',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': '',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        {
            'Edif�cio': 'Edif�cio Sedas Nunes (ISCTE-IUL)',
            'Nome sala': '2E07',
            'Capacidade Normal': '50',
            'Capacidade Exame': '25',
            'N� caracter�sticas': '4',
            'Anfiteatro aulas': '',
            'Apoio t�cnico eventos': '',
            'Arq 1': '',
            'Arq 2': '',
            'Arq 3': '',
            'Arq 4': '',
            'Arq 5': '',
            'Arq 6': '',
            'Arq 9': '',
            'BYOD (Bring Your Own Device)': '',
            'Focus Group': '',
            'Hor�rio sala vis�vel portal p�blico': 'X',
            'Laborat�rio de Arquitectura de Computadores I': '',
            'Laborat�rio de Arquitectura de Computadores II': '',
            'Laborat�rio de Bases de Engenharia': '',
            'Laborat�rio de Electr�nica': '',
            'Laborat�rio de Inform�tica': '',
            'Laborat�rio de Jornalismo': '',
            'Laborat�rio de Redes de Computadores I': '',
            'Laborat�rio de Redes de Computadores II': '',
            'Laborat�rio de Telecomunica��es': '',
            'Sala Aulas Mestrado': 'X',
            'Sala Aulas Mestrado Plus': 'X',
            'Sala NEE': '',
            'Sala Provas': '',
            'Sala Reuni�o': '',
            'Sala de Arquitectura': '',
            'Sala de Aulas normal': 'X',
            'videoconfer�ncia': '',
            '�trio': '',
        },
        // Add more sala data as needed
    ]

    /*test('renders table with correct columns', () => {
      render(<ScheduleTable defaultData={defaultData} salas={salas} />);
    
      // Assert that the table is rendered
      const tableElement = screen.getByRole('table');
      expect(tableElement).toBeInTheDocument();
    
      // Assert that the columns are rendered correctly
      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(14); // Update this value if the number of columns changes
      expect(columns[0]).toHaveTextContent('Curso');
      expect(columns[1]).toHaveTextContent('Unidade Curricular');
      // Add assertions for other columns
    }); */

    /*test('downloads CSV file when "Download CSV" button is clicked', () => {
      render(<ScheduleTable defaultData={defaultData} salas={salas} />);
    
      // Mock the download function
      const downloadMock = jest.fn();
      Object.defineProperty(global.document, 'createElement', {
        value: () => ({
          download: '',
          href: '',
          click: downloadMock,
        }),
      });
    
      // Click the "Download CSV" button
      const downloadCsvButton = screen.getByRole('button', { name: 'Download CSV' });
      userEvent.click(downloadCsvButton);
    
      // Assert that the download function is called with the correct arguments
      expect(downloadMock).toHaveBeenCalledWith('csv', 'horario.csv', { delimiter: ';', bom: true });
    });
  
    // Add more tests as needed
  });*/

    /*test('renders table with correct data', () => {
      render(<ScheduleTable defaultData={defaultData} salas={salas} />)
      
      // Assert that the table is rendered with the correct data
      expect(screen.getByText('Engenharia de Software')).toBeInTheDocument()
      expect(screen.getByText('Engenharia de Requisitos')).toBeInTheDocument()
      // Add more assertions for other data fields
    })*/

    /*test('allows downloading CSV file', () => {
      render(<ScheduleTable defaultData={defaultData} salas={salas} />)
      
      // Simulate clicking the download CSV button
      userEvent.click(screen.getByText('Download CSV'))
  
      // Assert that the download function is called with the correct arguments
      // You can use a mocking library like jest-fetch-mock to mock the download function and assert its usage
      // For example:
      // expect(fetch).toHaveBeenCalledWith('/api/download', { method: 'POST', body: 'csv data' })
    })*/

    test('renders the table with correct data and columns', async () => {
        render(<ScheduleTable defaultData={defaultData} salas={salas} />)

        // Wait for the table to be rendered
        await waitFor(() => {
            const table = screen.getByTestId('schedule-table') // Assuming you have a data-testid="schedule-table" on your table element
            expect(table).toBeInTheDocument()

            // Assuming there are specific cells you want to test within the table
            const cell1 = screen.getByText('14/11/2022')
            const cell2 = screen.getByText('C6.10')
            expect(cell1).toBeInTheDocument()
            expect(cell2).toBeInTheDocument()
        })
    })

    /*test('updates columns when salas prop changes', () => {
      const { rerender } = render(<ScheduleTable defaultData={defaultData} salas={salas} />);
      
      // Assert that the initial columns are rendered
      expect(screen.getByText('Sala A')).toBeInTheDocument();
      expect(screen.getByText('Sala B')).toBeInTheDocument();
  
      // Update the salas prop
      const updatedSalas = ['Sala C', 'Sala D'];
      rerender(<ScheduleTable defaultData={defaultData} salas={updatedSalas} />);
      
      // Assert that the updated columns are rendered
      expect(screen.getByText('Sala C')).toBeInTheDocument();
      expect(screen.getByText('Sala D')).toBeInTheDocument();
    })*/

    /*test('triggers download when buttons are clicked', () => {
      render(<ScheduleTable defaultData={defaultData} salas={salas} />);
      
      // Mock the download function
      const mockDownload = jest.fn();
      const tableRef = { current: { download: mockDownload } };
      jest.spyOn(React, 'useRef').mockReturnValue(tableRef);
  
      // Click the download buttons
      fireEvent.click(screen.getByText('Download CSV'));
      fireEvent.click(screen.getByText('Download JSON'));
  
      // Assert that the download function was called with the correct arguments
      expect(mockDownload).toHaveBeenCalledWith('csv', 'horario.csv', { delimiter: ';', bom: true });
      expect(mockDownload).toHaveBeenCalledWith('json', 'horario.json');
    })*/
})
