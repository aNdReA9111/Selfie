import { useFormContext } from "react-hook-form";
import { Note, NoteFormData } from "../utils/types";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotesContext } from "../hooks/useNotesContext";
import { useNavigate, useParams } from "react-router-dom";

export const NoteForm = ({isEdit, isView}: {isEdit: boolean, isView: boolean}) => {
  const { register, handleSubmit, formState: {errors} } = useFormContext<NoteFormData>();
  const { user } = useAuthContext();
  const { dispatch } = useNotesContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data: NoteFormData) => {
    const note: Note = {
      ...data,
      author: `${user.username}`,
      created: new Date(),
      updated: new Date(),
    };
    try {
      if (isEdit) {
        const res = await fetch(`http://localhost:4000/api/notes/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: note.title,
            content: note.content,
            open: note.open,
            allowedUsers: note.allowedUsers,
            tags: note.tags
          }),
        });

        const json: Note = await res.json();

        if(res.ok) {
          dispatch({type: 'EDIT_NOTE', payload: json});
          navigate("/notes");
        }
      }
      else {
        const res = await fetch(`http://localhost:4000/api/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(note),
        })

        const json: Note = await res.json();

        if(res.ok) {
          dispatch({type: 'CREATE_NOTE', payload: json});
          navigate("/notes");
        }
      }
    } catch (error: any) {
      console.log(error);
    }
    console.log(note); //al posto del console.log ci sarà una post al server
  }

  return (
    !isView && (
    <form className={`container flex-column align-items-start justify-content-center mb-5 h-75`} onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group mb-4 p-2">
        <label className="input-group-text" id="title">Title</label>
        <input type="text" {...register('title')} className="form-control" placeholder="Note Title" aria-label="Note Title" aria-describedby="title"/>
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div className="input-group mb-4 p-2 h-100">
        <label className="input-group-text" id="text">Note Text</label>
        <textarea {...register('content')}  className="form-control h-100" aria-label="Note Text" aria-describedby="text"></textarea>
        {errors.content && <p>{errors.content.message}</p>}
      </div>

      <div className="input-group mb-4 p-2">
        <label className="form-check-label" htmlFor="open">
          Click if open to public
        </label>
        <input className="form-check-input" {...register('open')} type="checkbox" value="" id="open"/>
        {errors.open && <p>{errors.open.message}</p>}
      </div>

      <div className="input-group mb-4 p-2">
        <label className="input-group-text" id="tagsLabel" htmlFor="tags">Tags</label>
        <input type="text" {...register('tags')} id="tags" className="form-control" placeholder="Write your tags..." aria-label="Note Tags" aria-describedby="tagsLabel"/>
        {errors.tags && <p>{errors.tags.message}</p>}
      </div>

      <div className="input-group mb-4 p-2">
        <label className="input-group-text" id="usersLabel" htmlFor="users">Users</label>
        <input type="text" {...register('allowedUsers')} id="users" className="form-control" placeholder="Write allowed users..." aria-label="Allowed Users" aria-describedby="usersLabel"/>
        {errors.allowedUsers && <p>{errors.allowedUsers.message}</p>}
      </div>
      <button className="btn btn-primary" type="submit">{isEdit ? 'Update Note' : 'Create Note'}</button>
    </form>)
  );
}
