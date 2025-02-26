import React from 'react';

interface EditBarProps {
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
}
export const EditBar: React.FC<EditBarProps> = ({ textAreaRef }) => {

    const getTextSelection = () => {
        const start = textAreaRef.current?.selectionStart;
        const end = textAreaRef.current?.selectionEnd;
        return { start, end };
    }

    const boldText = () => {
        const { start, end } = getTextSelection();
        console.log(start, end);

        if (start && end && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            console.log(initialText);
            const newText = initialText?.substring(0, start) + " **" + initialText?.substring(start, end) + "** " + initialText?.substring(end);
            console.log(newText);
            textAreaRef.current.value = newText;
        }
    }

    const italicText = () => {
        const { start, end } = getTextSelection();

        if (start && end && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + " *" + initialText?.substring(start, end) + "* " + initialText?.substring(end);
            textAreaRef.current.value = newText;
        }
    }

    const list = () => {
        const { start } = getTextSelection();

        if (start && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + " - " + initialText?.substring(start);
            textAreaRef.current.value = newText;
        }
    }

    const code = () => {

        const { start, end } = getTextSelection();

        if (start && end && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + " ```" + initialText?.substring(start, end) + "``` " + initialText?.substring(end);
            textAreaRef.current.value = newText;
        }
    }

    const link = (isImage: boolean) => {
        const { start, end } = getTextSelection();

        if (start && end && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + (isImage ? "![Image" : "[Link") + " description here](" + initialText?.substring(start, end) + ")" + initialText?.substring(end);
            textAreaRef.current.value = newText;
        }
    }

    const table = () => {
        const { start, end } = getTextSelection();

        if (start && end && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + `\n|${initialText?.substring(start, end).padEnd(2, " ")}|  |\n|--|--|\n|  |  |\n` + initialText?.substring(end);
            textAreaRef.current.value = newText;
        }
    }

    const headerText = (level: number) => {
        const { start, end } = getTextSelection();

        if (start && textAreaRef.current) {
            const initialText = textAreaRef.current.value || "";
            const newText = initialText?.substring(0, start) + " " + "#".repeat(level) + " " + initialText?.substring(start, end);
            textAreaRef.current.value = newText;
        }
    }

    return (
        <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group me-2" role="group" aria-label="Formatting options">
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Bold" onClick={boldText}>
                    <i className="bi bi-type-bold"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Italic" onClick={italicText}>
                    <i className="bi bi-type-italic"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="List" onClick={list}>
                    <i className="bi bi-list-ul"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Code" onClick={code}>
                    <i className="bi bi-code"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Img" onClick={() => link(true)}>
                    <i className="bi bi-image"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="URL" onClick={() => link(false)}>
                    <i className="bi bi-link-45deg"></i>
                </button>
                <button type="button" className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Table" onClick={() => table()}>
                    <i className="bi bi-table"></i>
                </button>
            </div>
            <div className="btn-group me-2" role="group" aria-label="Headers options">
                {
                    [1, 2, 3, 4, 5, 6].map(level => (
                        <button type="button" className="btn btn-outline-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title={`H${level}`} onClick={() => headerText(level)}>
                            <i className={`bi bi-type-h${level}`}></i>
                        </button>
                    ))
                }
            </div>
        </div>
    )
}
