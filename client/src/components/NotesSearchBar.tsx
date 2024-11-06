import { useState } from "react";
import { NotesSortingModal } from "./NotesSortingModal";
import { NotesFilterModal } from "./NotesFilterModal";

type NotesSearchBarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const NotesSearchBar: React.FC<NotesSearchBarProps> = ({ search, setSearch }: NotesSearchBarProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSorting, setShowSorting] = useState<boolean>(false);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-6 mt-4 mx-auto d-flex justify-content-center">
          <input
            className="form-control me-2 fs-4 py-1 px-2"
            type="search"
            placeholder="Cerca note..."
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
