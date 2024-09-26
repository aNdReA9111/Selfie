import { useState, useEffect} from "react";
import { useFormContext } from "react-hook-form";
import { NoteFormData } from "../utils/types";
import { marked } from "marked";
import DOMPurify from 'dompurify';


export const MDPreview = () => {
  const { watch } = useFormContext<NoteFormData>();
  const [html, setHtml] = useState<string>('');

  const title = watch('title');
  const content = watch('content');
  // console.log(title, content);


  useEffect(() => {
    const parseMD = async () => {
      if (content || title) {
        const unsafe = await marked.parse(`\n# ${title}\n${content}`);
        setHtml(DOMPurify.sanitize(unsafe));
      }
    }
    parseMD();
  }, [content, title]);

  return (
    <div id="preview" className="container d-none d-md-block h-100 overflow-scroll">
      {content && <section dangerouslySetInnerHTML={{__html: html}}></section>}
    </div>
  );
}
