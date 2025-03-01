import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../css/importCalendar.css';
import { useActivitiesContext } from '../hooks/useActivitiesContext';
import { useEventsContext } from '../hooks/useEventsContext';

export const ImportCalendarModal = ({ show, handleClose }: { show: boolean; handleClose: () => void }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { dispatch: dispatchEvents } = useEventsContext();
    const { dispatch: dispatchActivities } = useActivitiesContext();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'text/calendar') {
            setFile(droppedFile);
            setError(null);
        } else {
            setError('Per favore, carica un file .ics valido');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.type === 'text/calendar') {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Per favore, carica un file .ics valido');
        }
    };

    const handleImport = async () => {
        if (!file) return;

        try {
            const fileContent = await file.text();
            const response = await fetch('/api/events/import-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body: JSON.stringify({ icalData: fileContent }),
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'importazione del calendario');
            }

            const imported = await response.json();
            imported.events.forEach((event: any) => {
                event.date = new Date(event.date);
                event.endDate = new Date(event.endDate);
            })
            imported.activities.forEach((activity: any) => {
                activity.date = new Date(activity.date);
            })
            dispatchEvents({ type: 'ADD_EVENTS', payload: imported.events });
            dispatchActivities({ type: 'ADD_ACTIVITIES', payload: imported.activities });

            handleClose();
            setFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error while importing calendar');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Import Calendar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".ics"
                        hidden
                    />
                    <div className="drop-zone-content">
                        {file ? (
                            <p className="file-name">{file.name}</p>
                        ) : (
                            <>
                                <i className="bi bi-cloud-upload fs-1 mb-2"></i>
                                <p>Drag here .ics file or click to select it.</p>
                            </>
                        )}
                    </div>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Abort
                </Button>
                <Button
                    variant="primary"
                    onClick={handleImport}
                    disabled={!file}
                >
                    Import
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
