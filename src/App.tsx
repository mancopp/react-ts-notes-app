import "bootstrap/dist/css/bootstrap.min.css";
//import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Prev } from "react-bootstrap/esm/PageItem";
import NoteList from "./components/NoteList";
import { NoteLayout } from "./components/NoteLayout";
import Note from "./components/Note";
import EditNote from "./components/EditNote";

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

  function updateTag(id: string, label: string) {
    setTags((prev) =>
      prev.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      })
    );
  }

  function deleteTag(id: string) {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }

  function createNote({ tags, ...data }: NoteData) {
    setRawNotes((prev) => {
      return [
        ...prev,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setRawNotes((prev) => {
      return prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setRawNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  return (
    <Container className="my-5">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={noteWithTags}
              availableTags={tags}
              updateTag={updateTag}
              deleteTag={deleteTag}
            />
          }
        />
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
        <Route path="/:id" element={<NoteLayout notes={noteWithTags} />}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
