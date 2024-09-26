import { useEffect, useState } from 'react';
import { NoteCard } from '../components/NoteCard';
import { Note, NotesContextType } from '../utils/types';
import { useNotesContext } from '../hooks/useNotesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';


export const NotesPreview = () => {
  const { notes, dispatch }: NotesContextType = useNotesContext();
  const { user } = useAuthContext();
  const [ error, setError ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res =  await fetch("http://localhost:4000/api/notes", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          }
        })

        const json = await res.json();

        if(res.ok) {
          dispatch({type: 'SET_NOTES', payload: json});
          setIsLoading(false);
        }
      } catch(err: any) {
        console.log(err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    if(user)
      fetchNotes();
  }, [user, dispatch])



  //Qui saranno implementati i vari filtri per le note
  //Funzioni filtro su array notes --> solo private, solo pubbliche, solo private a cui ho accesso
  //e combinazioni di questi tre filtri
  //Filtri con i tags
  //Funzioni di sorting --> data di creazione, data di modifica

  return (

    <div className="container d-flex flex-wrap">
      {
        notes.length === 0
        ? <p>No notes yet</p>
        : notes.map((note: Note) => <NoteCard key={note._id} note={note} />)
      }
      {
        error === '' ? null : <p>{error}</p>
      }
      {
        isLoading ?
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          : null
      }
      <Link to="/notes/add">Add note</Link>
    </div>
  );
}
