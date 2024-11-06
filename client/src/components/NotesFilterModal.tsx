import { Button, Modal } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext";
import { useForm } from "react-hook-form";
import { useNotes } from "../hooks/useNotes";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteFilterSchema, NoteFilterType } from "../utils/types";
// import { DateTime } from "luxon";

type NotesFilterModalProps = {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotesFilterModal: React.FC<NotesFilterModalProps> = ({ showFilters, setShowFilters }: NotesFilterModalProps) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<NoteFilterType>({
    defaultValues: {
      tags: [],
      start: undefined,
      end: undefined,
      public: false,
      private: true,
      group: true,
    },
    resolver: zodResolver(noteFilterSchema)
  });

  const { user } = useAuthContext();
  const query = watch();

  
  const {isLoading, error} = useNotes("/api/notes/", query, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    }
  }); 

  const onSubmit = (data: NoteFilterType) => {
    console.log(data);
    setShowFilters(false);
  };

  console.log(isLoading, error);
  console.log(query);
  // console.log(errors);
  // console.log(watch('start'));

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
            Filtri
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="tagsInput" className="form-label">Tags</label>
              <input type="text" {...register('tags')} className={`form-control ${errors.tags ? 'is-invalid' : ''}`} id="tagsInput" aria-describedby="tagsHelp"/>
              {errors.tags && <div className="invalid-feedback">{errors.tags.message}</div>}
              <div id="tagsHelp" className="form-text">Esempio: tag1,tag2</div>
            </div>
            <div className="mb-3">
            {/*filter by date asking for start date and end date*/}
              <label htmlFor="startDateInput" className="form-label">Inizio</label>
              <input type="date" {...register('start')} className={`form-control ${errors.start ? 'is-invalid' : ''}`} id="startDateInput"/>
              {errors.start && <div className="invalid-feedback">{errors.start.message}</div>}

              <label htmlFor="endDateInput" className="form-label">Fine</label>
              <input type="date" {...register('end')}  className={`form-control ${errors.end ? 'is-invalid' : ''}`} id="endDateInput"/>
              {errors.end && <div className="invalid-feedback">{errors.end.message}</div>}
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" {...register('public')} className="form-check-input" id="public"/>
              {errors.public && <div className="invalid-feedback">{errors.public.message}</div>}
              <label className="form-check-label" htmlFor="public">Note Pubbliche</label>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" {...register('private')} className="form-check-input" id="private"/>
              {errors.private && <div className="invalid-feedback">{errors.private.message}</div>}
              <label className="form-check-label" htmlFor="private">Note Private</label>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" {...register('group')} className="form-check-input" id="group"/>
              {errors.group && <div className="invalid-feedback">{errors.group.message}</div>}
              <label className="form-check-label" htmlFor="group">Note di Gruppo</label>
            </div>
            <button type="submit" className="btn btn-danger">Submit<i className="ms-3 bi bi-funnel me-2"></i></button>
          </form>
        </Modal.Body>
      </Modal>
      <Button variant="danger" className="me-2 fs-5" onClick={() => setShowFilters(true)}><i className="bi bi-filter-right"></i></Button>
    </>
  )
}
