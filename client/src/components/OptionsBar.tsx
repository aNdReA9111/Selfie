import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const OptionsBar = () => {
  const togglePreview = () => {
    const preview = document.getElementById('preview');
    if(preview) {
      preview.classList.toggle('d-none');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <ButtonGroup aria-label="Note Edit Actions">
        <Button variant="secondary">Undo  <i className="bi bi-arrow-counterclockwise"></i></Button>
        <Button variant="secondary">Redo  <i className="bi bi-arrow-clockwise"></i></Button>
        <Button className="d-md-none" variant="secondary" onClick={togglePreview}>Preview <i className="bi bi-eye-fill"></i></Button>
        <Button variant="secondary">Copy  <i className="bi bi-copy"></i></Button>
      </ButtonGroup>
    </div>
  );
}
