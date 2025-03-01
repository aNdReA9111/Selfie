import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Note } from "../utils/types";

export const NotesPreview = () => {
    const [html, setHtml] = useState<string>("");
    const navigate = useNavigate();

    const getLastNote = async () => {
        try {
            const res = await fetch("/api/notes?last=true", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                }
            });

            if (res.ok) {
                const note: Note[] = await res.json();
                const unsafe = await marked.parse(`\n# ${note[0].title}\n${note[0].content}`);
                setHtml(DOMPurify.sanitize(unsafe));
            }

        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLastNote();
    }, []);

    return (
        <div className="d-flex flex-column justify-content-start container n mt-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2>Your last note</h2>
                <button className="btn btn-danger" onClick={() => navigate("/notes/")}>Go to Notes<i className="bi bi-box-arrow-up-right ms-2"></i></button>
            </div>
            <div className="max-h-100 overflow-y-scroll">
                {<p dangerouslySetInnerHTML={{ __html: html }}></p>}
            </div>
        </div>
    );
};
