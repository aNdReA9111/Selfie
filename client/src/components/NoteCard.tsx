import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Note } from '../utils/types';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNotesContext } from '../hooks/useNotesContext';

export const NoteCard = ({note}: {note: Note}) => {

  const { user } = useAuthContext();
  const { dispatch } = useNotesContext();

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
        dispatch({ type: 'DELETE_ONE', payload: note._id || 0 });
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
          {note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content}
        </Card.Text>
        <Link to={`/notes/${note._id}`}>See more</Link>
        <Button variant="primary" onClick={handleDelete}>Delete</Button>
        <Link to={`/notes/edit/${note._id}`}>Edit</Link>
      </Card.Body>
    </Card>
  );
}
