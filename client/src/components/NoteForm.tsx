import { useFormContext } from "react-hook-form";
import { Note, NoteFormData } from "../utils/types";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotesContext } from "../hooks/useNotesContext";
import { useNavigate, useParams } from "react-router-dom";
import { EditBar } from "./EditBar";
import { MutableRefObject, useRef } from "react";

export const NoteForm = ({ isEdit, isView }: { isEdit: boolean, isView: boolean }) => {
    const { register, handleSubmit, formState: { errors } } = useFormContext<NoteFormData>();
    const { user } = useAuthContext();
    const { dispatch } = useNotesContext();
    const { id } = useParams();
    const navigate = useNavigate();
    //for textarea
    const { ref, ...rest } = register('content');
    const secondRef: MutableRefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement | null>(null)

    const onSubmit = async (data: NoteFormData) => {
        const note: Note = {
            ...data,
            author: `${user.username}`,
            created: new Date(),
            updated: new Date(),
        };
        try {
            if (isEdit) {
                const res = await fetch(`/api/notes/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: "include",
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

                if (res.ok) {
                    dispatch({ type: 'EDIT_NOTE', payload: json });
                    navigate("/notes");
                }
            }
            else {
                const res = await fetch(`/api/notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: "include",
                    },
                    body: JSON.stringify(note),
                })

                const json: Note = await res.json();

                if (res.ok) {
                    dispatch({ type: 'CREATE_NOTE', payload: json });
                    navigate("/notes");
                }
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        !isView && (
            <form className="container d-flex flex-column align-items-start justify-content-start ps-3 pt-5 vh-100" onSubmit={handleSubmit(onSubmit)}>

                {/* Title Field */}
                <div className="form-floating mb-4 w-100">
                    <input
                        type="text"
                        {...register('title')}
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        placeholder="Note Title"
                        id="title"
                    />
                    <label htmlFor="title">Title</label>
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                {/* Content Field */}
                <EditBar textAreaRef={secondRef} />
                <div style={{ maxHeight: '40svh' }} className="flex-grow-1 form-floating mb-4 w-100">
                    <textarea
                        ref={(e) => {
                            ref(e)
                            secondRef.current = e // you can still assign to ref
                        }}
                        {...rest}
                        className={`form-control h-100 ${errors.content ? 'is-invalid' : ''}`}
                        placeholder="Note Text"
                        id="content"
                    ></textarea>
                    <label htmlFor="content">Testo della nota</label>
                    {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
                </div>

                {/* Open to Public Checkbox */}
                <div className="form-check mb-4">
                    <input
                        className="form-check-input"
                        {...register('open')}
                        type="checkbox"
                        id="open"
                    />
                    <label className="form-check-label" htmlFor="open">
                        Click if open to public
                    </label>
                    {errors.open && <div className="invalid-feedback">{errors.open.message}</div>}
                </div>

                {/* Tags Field */}
                <div className="form-floating mb-4 w-100">
                    <input
                        type="text"
                        {...register('tags')}
                        className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                        placeholder="Write your tags..."
                        id="tags"
                        aria-describedby="tagsHelper"
                    />
                    <label htmlFor="tags">Tag</label>
                    <div id="tagsHelper" className="form-text">Esempio: tag1, tag2</div>
                    {errors.tags && <div className="invalid-feedback">{errors.tags.message}</div>}
                </div>

                {/* Allowed Users Field */}
                <div className="form-floating mb-4 w-100">
                    <input
                        type="text"
                        {...register('allowedUsers')}
                        className={`form-control ${errors.allowedUsers ? 'is-invalid' : ''}`}
                        placeholder="Write allowed users..."
                        id="users"
                        aria-describedby="usersHelper"
                    />
                    <label htmlFor="users">Utenti</label>
                    <div id="usersHelper" className="form-text">Esempio: user1, user2</div>
                    {errors.allowedUsers && <div className="invalid-feedback">{errors.allowedUsers.message}</div>}
                </div>

                {/* Submit Button */}
                <button className="btn btn-primary" type="submit">
                    {isEdit ? 'Update Note' : 'Create Note'}
                </button>
            </form>
        )
    );

}
