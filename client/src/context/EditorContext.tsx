import { useForm, FormProvider } from "react-hook-form";
import { MDPreview } from "../components/MDPreview";
import { NoteForm } from "../components/NoteForm";
import { Note, NoteFormData, formSchema } from "../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useNotesContext } from "../hooks/useNotesContext";


export const EditorContextProvider = ({ isEdit, isView }: { isEdit: boolean, isView: boolean }) => {
  let defaultValues: NoteFormData = {
    title: '',
    content: '',
    open: false,
    allowedUsers: [],
    tags: []
  }
  if(isEdit || isView) {
    const { id } = useParams();
    const { notes } = useNotesContext();
    const note: Note | undefined = notes.find((note: Note) => note._id === id);
    if(note) {
      defaultValues = {
        title: note.title,
        content: note.content,
        open: note.open,
        allowedUsers: note.allowedUsers || [],
        tags: note.tags || []
      }
    }
  }
  const methods = useForm<NoteFormData>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  return (
    <FormProvider {...methods}>
      <div className="d-flex flex-md-row flex-column justify-content-center align-items-start m-0" >
        <NoteForm isEdit={isEdit} isView={isView}/>
        <MDPreview />
      </div>
    </FormProvider>
  );
}
