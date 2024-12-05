import '../css/eventComponent.css';

export const EventComponent = (arg: any) => {
    return (
        arg.event.resources.isActivity ? <span className="activity">{arg.event.title}</span> : <span>{arg.event.title}</span>
    );
}
