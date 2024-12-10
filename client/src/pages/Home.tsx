import { ActivitiesPreview } from "../components/ActivitiesPreview";
import { EventsPreview } from "../components/EventsPreview";
import { NotesPreview } from "../components/NotesPreview";
import { PomodoroPreview } from "../components/PomodoroPreview";
import "../css/home.css";

function Home() {
    return (
        <div className="home-layout">
            <ActivitiesPreview />
            <EventsPreview />
            <PomodoroPreview />
            <NotesPreview />
        </div>
    );

}


export default Home;
