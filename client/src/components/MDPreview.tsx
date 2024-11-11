import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { NoteFormData } from "../utils/types";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const MDPreview = () => {
  const { watch } = useFormContext<NoteFormData>();
  const [html, setHtml] = useState<string>("");

  const title = watch("title");
  const content = watch("content");
  const tags = watch("tags") as string | string[] | undefined;

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

  return (
    <div id="preview" className="mt-4 ms-2 container h-100 overflow-scroll">
      {(content || title) && (
        <section
          className="ms-3"
          dangerouslySetInnerHTML={{ __html: html }}
        ></section>
      )}
      {normalizedTags.length > 0 &&
        normalizedTags.map(
          (tag, index) =>
            tag !== "" && (
              <span
                key={index} // Ensure each element has a unique key
                className="badge rounded-pill text-bg-secondary p-2 ms-3 mb-3"
              >
                {tag}
              </span>
            )
        )}
      <button className="btn btn-secondary mt-4 ms-3" onClick={() => navigator.clipboard.writeText(`\n# ${title}\n${content}`)}><i className="bi bi-copy me-2"></i>Copy</button>
    </div>
  );
};
