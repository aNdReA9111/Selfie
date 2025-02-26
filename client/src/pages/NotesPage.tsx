import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { NoteCard } from '../components/NoteCard';
import { NotesSearchBar } from '../components/NotesSearchBar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNotesContext } from '../hooks/useNotesContext';
import { Note, NotesContextType } from '../utils/types';


export const NotesPreview = () => {
    const { notes, dispatch }: NotesContextType = useNotesContext();
    const { user } = useAuthContext();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch("/api/notes", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: "include"
                    }
                })

                const json: Note[] = await res.json();
                json.forEach((el: Note) => {
                    el.created = new Date(el.created)
                    el.updated = new Date(el.updated)
                });

                if (res.ok) {
                    dispatch({ type: 'SET_NOTES', payload: json });
                    setIsLoading(false);
                }
            } catch (err: any) {
                console.log(err);
                setError(err.message);
                setIsLoading(false);
            }
        }

        if (user)
            fetchNotes();
    }, [user, dispatch])

    return (
        <div className="container d-flex flex-column align-items-center">
            <NotesSearchBar search={search} setSearch={setSearch} />
            <div style={{ maxHeight: '80svh' }} className="container d-flex flex-wrap justify-content-center mt-4 overflow-y-scroll">
                {
                    notes.length === 0
                        ? <p>No notes yet</p>
                        : notes.filter((note: Note) => note.title.toLowerCase().includes(search.toLowerCase())).map((note: Note) => <NoteCard key={note._id} note={note} />)
                }
                {
                    error !== '' && <p>{error}</p>
                }
                {
                    isLoading &&
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
            </div>
        </div>
    );
}
