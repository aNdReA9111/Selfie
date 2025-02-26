import { ActivitiesPreview } from "../components/ActivitiesPreview";
import { EventsPreview } from "../components/EventsPreview";
import { NotesPreview } from "../components/NotesPreview";
import { PomodoroPreview } from "../components/PomodoroPreview";
import { Chat } from "../components/Chat";
import "../css/home.css";

function Home() {
    return (
        <div className="home-layout ">
            <ActivitiesPreview isPreview={true} />
            <EventsPreview />
            <PomodoroPreview />
            <NotesPreview />
            <Chat />
        </div>
    );

}


export default Home;
