import './App.css';
import * as React from 'react';
import { Button, Container } from '@mui/material';
import TableDemo from './TableDemo';

function App() {
  return (
    <Container>
      <Button variant="contained">Hello world</Button>
      <TableDemo />
      <p>Hello</p>
    </Container>
  );
}

export default App;
