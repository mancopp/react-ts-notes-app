import "bootstrap/dist/css/bootstrap.min.css";
//import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Prev } from "react-bootstrap/esm/PageItem";

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  content: string;
  tags: Tag[];
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  content: string;
  tagIds: string[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [rawNotes, setRawNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    return rawNotes.map((rawNote) => {
      return {
        ...rawNote,
        tags: tags.filter((tag) => rawNote.tagIds.includes(tag.id)),
      };
    });
  }, [rawNotes, tags]);

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function createNote({ tags, ...data }: NoteData) {
    setRawNotes((prev) => {
      return [
        ...prev,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  return (
    <Container className="my-5">
      <Routes>
        <Route path="/" element={<h1>home</h1>} />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={createNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
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
