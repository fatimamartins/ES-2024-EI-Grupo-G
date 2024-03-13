import "./App.css";
import React, { useState } from "react";
import { Button, Container } from "@mui/material";
import TableDemo from "./TableDemo";
import RemoteFile from "./RemoteFile";

function App() {
  const [horario, setHorario] = useState([]);

  return (
    <Container>
      <Button variant="contained">Hello world</Button>
      <RemoteFile setHorario={setHorario} />
      <TableDemo />
      <p>Hello</p>
    </Container>
  );
}

export default App;
