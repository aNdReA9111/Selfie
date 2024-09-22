import { useState, useEffect, ReactNode } from 'react';
import { useTimeMachineContext } from '../hooks/useTimeMachineContext';
import dayjs from 'dayjs';

const TimeMachine = (): ReactNode => {
  const [offsetValue, setOffset] = useState(0);
  const { dispatch } = useTimeMachineContext();
  
  useEffect(() => {
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    dispatch({type: "SET_OFFSET", payload: offsetValue});
  };

  const reset = () => {
    setOffset(0);
    dispatch({type: "RESET_OFFSET"});
  }

  return (
    <div className="d-flex flex-row justify-content-center align-itmes-center container-md">
      <form onSubmit={handleSubmit} className="d-flex flex-row justify-content-center align-itmes-center container-md">
        <label htmlFor="date_form" className="form-label">Write new date</label>
        <input 
          onChange={(e) => {setOffset(dayjs(e.target.value).valueOf() - dayjs().valueOf())}} 
          type="datetime-local" 
          className="form-control" 
          id="date_form" 
          // value={formatDate(new Date(offset + Date.now()), "YYYY-MM-DDTHH:mm")}/>
          value={dayjs().add(offsetValue, 'millisecond').format("YYYY-MM-DDTHH:mm")}/>
        <button className="btn btn-primary">Set Date</button>
      </form>
      <button className="btn btn-primary" onClick={reset}>Reset Date</button>
    </div>
  );
};

export default TimeMachine;
