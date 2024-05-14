# Projeto de Engenharia de Software

## Grupo: Quarta-Feira-LEI-Grupo-G

### Membros

- Fátima Martins - Nº 104524 - Username GitHub: fatimamartins
- João Fernandes - Nº 100316 - Username GitHub: JoaoFernandes14
- Pedro Ramos - Nº 100745 - Username GitHub: IKingRamosI
- Tiago Oliveira - Nº 104366 - Username GitHub: tiagooliveira24

### Links úteis

- Trello - [Link](https://trello.com/invite/esgrupog/ATTI3225af1f8aabc1839257bfb77591583aEED0334E)
- GitHub - [Link](https://github.com/fatimamartins/ES-2024-EI-Grupo-G)
- SonarCloud - [Link](https://sonarcloud.io/project/overview?id=fatimamartins_ES-2024-EI-Grupo-G)

### Link dos ficheiros a carregar no site

- Horário de Exemplo - [Link](https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/HorarioDeExemplo.csv)
- Caracterização das Salas - [Link](https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/main/public/Caracteriza%C3%A7%C3%A3oDasSalas.csv)

### Descrição das tecnologias usadas no projeto

Este projeto foi desenvolvido utilizando a tecnologia REACT.
De forma a ser possível correr o projeto deve primeiro realizar o comando 'npm install', para instalar os packages necessários para a execução do site web.
De seguida deve executar o comando 'npm start', para iniciar o servidor local e navegar pela plataforma.

### Bibliotecas de apoio ao desenvolvimento

- [Tabulator](https://tabulator.info/docs/6.2/react)
- [MaterialUI](https://mui.com/)
- [Jest](https://jestjs.io/docs/tutorial-react)
- [date-fns](https://date-fns.org/)
- [react-csv-reader](https://www.npmjs.com/package/react-csv-reader)
- [JSDoc](https://jsdoc.app/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jotai](https://jotai.org/)
- [Day.js](https://day.js.org/)
- [react-heatmap-grid](https://www.npmjs.com/package/react-heatmap-grid)
- [React Sigma](https://sim51.github.io/react-sigma/)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)

### Descrição do projeto

O projeto consiste no desenvolvimento de uma aplicação para suporte à gestão de horários no Iscte, e permite:
* O carregamento de um horário a partir de um ficheiro CSV;
* Mostrar o horário e permitir navegar no horário, sob a forma de tabela;
* Mostrar e permitir navegar no cadastro de salas do Iscte;
* Gravar (em CSV e JSON) o horário que foi alterado;
* Sugerir slots para alocação de uma aula de substituição;
* Sugerir slots para alocação das aulas de uma UC;
* Visualizar de forma gráfica as relações de conflitualidade entre aulas;
* Visualizar de forma gráfica o mapa de ocupação das salas.

### Cobertura dos testes

![Testes Screenshot][testes-screenshot]

### Preview do SonarCloud

![SonarCloud Screenshot][sonarcloud-screenshot]

### Erros e funcionalidades não implementadas ou incompletas

[sonarcloud-screenshot]: public/sonarcloud.png
[testes-screenshot]: public/cobertura_testes.jpeg
