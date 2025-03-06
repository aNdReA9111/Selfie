import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { useNotesContext } from "../hooks/useNotesContext";

type NotesSortingModalProps = {
    showSorting: boolean;
    setShowSorting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotesSortingModal: React.FC<NotesSortingModalProps> = ({ showSorting, setShowSorting }: NotesSortingModalProps) => {
    const { dispatch } = useNotesContext();

    const onClick = (sortingType: any) => {
        dispatch({ type: sortingType });
        setShowSorting(false);
    }

    return (
        <>
            <Modal
                show={showSorting}
                onHide={() => setShowSorting(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Choose sorting
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => onClick('SORT_BY_DATE')}>By Date</Button>
                        <Button variant="primary" onClick={() => onClick('SORT_BY_TITLE')}>By Title</Button>
                        <Button variant="primary" onClick={() => onClick('SORT_BY_CONTENT')}>By Length</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
            <Button variant="danger" className="me-2 fs-5" onClick={() => setShowSorting(true)}><i className="bi bi-sort-alpha-down"></i></Button>
        </>
    )
}
