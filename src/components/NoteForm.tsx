import React, { FormEvent } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  content = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const noteContentRef = useRef<HTMLTextAreaElement>(null);
  const [noteContent, setNoteContent] = useState<string>(content);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      content: noteContentRef.current!.value,
      tags: selectedTags,
    });

    navigate("..");
  };

  return (
    <Form onSubmit={submitHandler}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control required ref={titleRef} defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Creatable
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onCreateOption={(label) => {
                  const newTag = { id: uuidv4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                isMulti
                value={selectedTags.map((tag) => {
                  return {
                    label: tag.label,
                    value: tag.id,
                  };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="note-content" className="h-100">
              <Form.Label>Markdown</Form.Label>
              <Form.Control
                className="h-100"
                required
                as="textarea"
                ref={noteContentRef}
                rows={10}
                defaultValue={content}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Label>Preview</Form.Label>
            <ReactMarkdown className="border rounded">
              {noteContent}
            </ReactMarkdown>
          </Col>
        </Row>
        <Stack direction="horizontal" gap={2} className="mt-4">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
