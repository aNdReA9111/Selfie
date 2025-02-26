import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNotesContext } from "../hooks/useNotesContext";
import { Note, noteFilterSchema, NoteFilterType } from "../utils/types";

type NotesFilterModalProps = {
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotesFilterModal: React.FC<NotesFilterModalProps> = ({ showFilters, setShowFilters }: NotesFilterModalProps) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteFilterType>({
        defaultValues: {
            tags: [],
            start: undefined,
            end: undefined,
            pub: false,
            priv: true,
            group: true,
        },
        resolver: zodResolver(noteFilterSchema)
    });

    const { dispatch } = useNotesContext();

    const fetchNotes = async (query: NoteFilterType) => {
        try {
            const queryString = new URLSearchParams(
                Object.fromEntries(
                    Object.entries(query)
                        .filter(([_, value]) => {
                            // Filter out `undefined`, empty strings, and empty arrays
                            if (value === undefined || (Array.isArray(value) && value.length === 0)) {
                                return false; // Exclude these entries
                            }
                            return true; // Keep other values
                        })
                        .map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return [key, value.join(',')];
                            } else if (value instanceof Date) {
                                return [key, value.toISOString()];
                            } else if (typeof value === 'boolean') {
                                return [key, value.toString()];
                            } else {
                                return [key, String(value)];
                            }
                        })
                )
            ).toString();

            const res = await fetch("/api/notes?" + queryString, {
                credentials: "include",
                method: 'GET',
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const result: Note[] = await res.json();
            //le date diventano string in json
            result.forEach((el: Note) => {
                el.created = new Date(el.created);
                el.updated = new Date(el.updated);
            });
            dispatch({ type: 'SET_NOTES', payload: result });
        }
        catch (err: any) {
            console.log(err);
        }
    };

    const onSubmit = (data: NoteFilterType) => {
        console.log(data);
        fetchNotes(data);
        setShowFilters(false);
    };

    const onReset = () => {
        reset();
    };

    return (
        <>
            <Modal
                show={showFilters}
                onHide={() => setShowFilters(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Filters
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="tagsInput" className="form-label">Tags</label>
                            <input type="text" {...register('tags')} className={`form-control ${errors.tags ? 'is-invalid' : ''}`} id="tagsInput" aria-describedby="tagsHelp" />
                            {errors.tags && <div className="invalid-feedback">{errors.tags.message}</div>}
                            <div id="tagsHelp" className="form-text">Example: tag1,tag2</div>
                        </div>
                        <div className="mb-3">
                            {/*filter by date asking for start date and end date*/}
                            <label htmlFor="startDateInput" className="form-label">Start</label>
                            <input type="date" {...register('start')} className={`form-control ${errors.start ? 'is-invalid' : ''}`} id="startDateInput" />
                            {errors.start && <div className="invalid-feedback">{errors.start.message}</div>}

                            <label htmlFor="endDateInput" className="form-label">End</label>
                            <input type="date" {...register('end')} className={`form-control ${errors.end ? 'is-invalid' : ''}`} id="endDateInput" />
                            {errors.end && <div className="invalid-feedback">{errors.end.message}</div>}
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" {...register('pub')} className="form-check-input" id="public" />
                            {errors.pub && <div className="invalid-feedback">{errors.pub.message}</div>}
                            <label className="form-check-label" htmlFor="public">Public Notes</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" {...register('priv')} className="form-check-input" id="private" />
                            {errors.priv && <div className="invalid-feedback">{errors.priv.message}</div>}
                            <label className="form-check-label" htmlFor="private">Private Notes</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" {...register('group')} className="form-check-input" id="group" />
                            {errors.group && <div className="invalid-feedback">{errors.group.message}</div>}
                            <label className="form-check-label" htmlFor="group">Group Notes</label>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button type="submit" className="btn btn-danger">Submit<i className="ms-3 bi bi-funnel me-2"></i></button>
                            <button className="btn btn-danger" onClick={onReset}>Reset<i className="ms-3 bi bi-x-square me-2"></i></button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Button variant="danger" className="me-2 fs-5" onClick={() => setShowFilters(true)}><i className="bi bi-filter-right"></i></Button>
        </>
    )
}
