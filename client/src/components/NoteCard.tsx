import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Note } from '../utils/types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNotesContext } from '../hooks/useNotesContext';
import DOMPurify from 'dompurify';
import { marked } from "marked";

export const NoteCard = ({note}: {note: Note}) => {
  const [html, setHtml] = useState<string>('');
  const { user } = useAuthContext();
  const { dispatch } = useNotesContext();
  const isOwner = note.author === user.username;

  useEffect(() => {
    const parseMD = async () => {
      if (note.content || note.title) {
        const unsafe = await marked.parse(`\n# ${note.title}\n${note.content}`);
        setHtml(DOMPurify.sanitize(unsafe));
      }
    }
    parseMD();
  }, [note.content, note.title]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/notes/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      })

      if (res.ok) {
        dispatch({ type: 'DELETE_ONE', payload: note._id || '' });
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <Card className="m-2 w-25">
      <Card.Body>
        <Card.Title>{note.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{new Date(note.created).toLocaleDateString()}</Card.Subtitle>
        <Card.Text>
          {/*ANCHE LA PREVIEW DEVE ESSERE  IN MARKDOWN*/}
          {<section dangerouslySetInnerHTML={{__html: html.length > 200 ? html.slice(0, 200) + '...' : html }}></section>}
        </Card.Text>
        <Link to={`/notes/${note._id}`}>See more</Link>
        {/*solo proprietario può modificare o eliminare, chi è nella lista no*/}
        {isOwner && <Button variant="primary" onClick={handleDelete}>Delete</Button> }
        {isOwner && <Link to={`/notes/edit/${note._id}`}>Edit</Link> }
      </Card.Body>
    </Card>
  );
}
