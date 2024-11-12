import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { NoteFormData } from "../utils/types";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";

export const MDPreview = ({ isView }: { isView: boolean }) => {
  const { watch } = useFormContext<NoteFormData>();
  const [html, setHtml] = useState<string>("");

  {/*form data*/}
  const title = watch("title");
  const content = watch("content");
  const tags = watch("tags") as string | string[] | undefined;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const parseMD = async () => {
      if (content || title) {
        const unsafe = await marked.parse(`\n# ${title}\n${content}`);
        setHtml(DOMPurify.sanitize(unsafe));
      }
    };
    parseMD();
  }, [content, title]);

  /*Durante l'editing tags è una stringa --> devo gestire questa cosa*/
  const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",").map((tag: any) => tag.trim())
    : [];

  const duplicateNote = () => {
    navigate(`/notes/duplicate/${id}`);
  }

  return (
    <div id="preview" className="mt-4 mx-2 container-fluid h-100 overflow-scroll d-flex flex-column justify-content-around align-items-center">
      {(content || title || tags) && (
        <>

        {/*markdown preview*/}
        <section
          style={{ minHeight: "80svh" }}
          className="container-sm ms-3"
          dangerouslySetInnerHTML={{ __html: html }}
        ></section>

        {/*tags and buttons*/}
        <div className="my-4 container-sm d-flex justify-content-between">
          <div className="d-flex justufy-content-start">
            {normalizedTags.length > 0 &&
              normalizedTags.map(
                (tag, index) =>
                  tag !== "" && (
                    <span
                      key={index}
                      className="badge rounded-pill text-bg-secondary p-2 ms-3 mb-3"
                    >
                      {tag}
                    </span>
                  )
              )
            }
          </div>
          <div className="d-flex">
            { isView && <button className="btn btn-secondary ms-3 opacity-75" onClick={() => navigator.clipboard.writeText(`\n# ${title}\n${content}`)}><i className="bi bi-copy"></i></button> }
            { isView && <button className="btn btn-secondary ms-3 opacity-75" onClick={duplicateNote}><i className="bi bi-file-earmark-plus"></i></button> }
          </div>
        </div>
      </>
    )}
    </div>
  );
};
