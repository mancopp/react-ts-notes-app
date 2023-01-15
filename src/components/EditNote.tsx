import NoteForm from "./NoteForm";
import { NoteData, Tag } from "../App";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export default function EditNote({
  onSubmit,
  onAddTag,
  availableTags,
}: EditNoteProps) {
  const note = useNote();
  return (
    <NoteForm
      title={note.title}
      content={note.content}
      tags={note.tags}
      onSubmit={(data) => onSubmit(note.id, data)}
      onAddTag={onAddTag}
      availableTags={availableTags}
    />
  );
}
