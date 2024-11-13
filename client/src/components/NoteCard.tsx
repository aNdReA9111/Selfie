import { Button, ButtonGroup, Card } from 'react-bootstrap';
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
      const res = await fetch(`api/notes/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          credentials: "include",
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
    <Card style={{ minWidth: '18rem', flexShrink: 0 }} className="m-2 w-25 shadow">
      <Card.Body className='d-flex flex-column'>
        <Card.Title>{note.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{new Date(note.created).toLocaleDateString()}</Card.Subtitle>
        <Card.Text className='flex-grow-1'>
          {/*ANCHE LA PREVIEW DEVE ESSERE  IN MARKDOWN*/}
          {<p dangerouslySetInnerHTML={{__html: html.length > 200 ? html.slice(0, 200) + '...' : html }}></p>}
        </Card.Text>
        <ButtonGroup className='m-2'>
          <Link className='btn btn-primary' to={`/notes/${note._id}`}><i className='bi bi-eye'></i></Link>
          {/*solo proprietario può modificare o eliminare, chi è nella lista no*/}
          {isOwner && <Button variant="danger" onClick={handleDelete}><i className="bi bi-trash"></i></Button> }
          {isOwner && <Link className='btn btn-warning' to={`/notes/edit/${note._id}`}><i className="bi bi-pencil-square"></i></Link> }
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}
