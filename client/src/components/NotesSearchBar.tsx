import { useState } from "react";
import { NotesSortingModal } from "./NotesSortingModal";
import { NotesFilterModal } from "./NotesFilterModal";
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

type NotesSearchBarProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const NotesSearchBar: React.FC<NotesSearchBarProps> = ({ search, setSearch }: NotesSearchBarProps) => {
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [showSorting, setShowSorting] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <div style={{ minWidth: '18svw' }} className="container">
            <div className="row">
                <div className="col-12 col-lg-6 mt-4 mx-auto d-flex justify-content-center">
                    <Button variant="danger" className="me-2 fs-5" onClick={() => navigate('/notes/add')}><i className="bi bi-plus-lg"></i></Button>
                    <input
                        className="form-control me-2 fs-4 py-1 px-2"
                        type="search"
                        placeholder="Search..."
                        aria-label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <NotesSortingModal showSorting={showSorting} setShowSorting={setShowSorting} />
                    <NotesFilterModal showFilters={showFilters} setShowFilters={setShowFilters} />
                </div>
            </div>
        </div>
    );
}
