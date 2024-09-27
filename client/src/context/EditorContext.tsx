import { useForm, FormProvider } from "react-hook-form";
import { MDPreview } from "../components/MDPreview";
import { NoteForm } from "../components/NoteForm";
import { Note, NoteFormData, formSchema } from "../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
// import { OptionsBar } from "../components/OptionsBar";
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
  console.log(defaultValues);
  const methods = useForm<NoteFormData>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  return (
    <FormProvider {...methods}>
      {/*<OptionsBar />*/}
      <div style={{ height: '95svh' }} className="d-flex flex-md-row flex-column justify-content-center align-items-start text-bg-light m-0" >
        <NoteForm isEdit={isEdit} isView={isView}/>
        <MDPreview />
      </div>
    </FormProvider>
  );
}
