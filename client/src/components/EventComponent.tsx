import '../css/eventComponent.css';

export const EventComponent = (event: any) => {
    return (
        event.resources.isActivity ? <span className="activity">{event.title}</span> : <span>{event.title}</span>
    );
}
