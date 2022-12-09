import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./components/NewNote";

function App() {
  return (
    <Container className="my-5">
      <Routes>
        <Route path="/" element={<h1>home</h1>} />
        <Route path="new" element={<NewNote />} />
        <Route path="/:id">
          <Route index element={<h1>view</h1>} />
          <Route path="edit" element={<h1>edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
