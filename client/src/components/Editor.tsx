import { EditorContextProvider } from "../context/EditorContext";

export const Editor = ({isEdit, isView, isDuplicate}: {isEdit: boolean, isView: boolean, isDuplicate: boolean}) => {
  return (
    <>
      <EditorContextProvider isView={isView} isEdit={isEdit} isDuplicate={isDuplicate}/>
    </>
  );
}
