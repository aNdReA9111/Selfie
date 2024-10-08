import { EditorContextProvider } from "../context/EditorContext";

export const Editor = ({isEdit, isView}: {isEdit: boolean, isView: boolean}) => {
  return (
    <>
      <EditorContextProvider isView={isView} isEdit={isEdit}/>
    </>
  );
}
