import { useState } from "react";
import { EventFormData } from "../utils/types";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

type EventFormProps = {
  watch: UseFormWatch<EventFormData>;
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
};

export const RRuleForm: React.FC<EventFormProps> = ({watch, register, errors}) => {

  const frequency: string = watch('recurrencyRule.frequency');
  const [byMonthDay, setByMonthDay] = useState<boolean>(false);

  return (
    <>
      
      {/*frequency*/}
      <div className="mb-3">
        <label htmlFor="frequency" className="form-label">Frequency</label>
        <select className="form-select" id="frequency" {...register('recurrencyRule.frequency')} aria-label="Select frequency">
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
        {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
      </div>
      
      {/*interval*/}
      <div className="mb-3">
        <label htmlFor="interval" className="form-label">Every </label>
        <input 
          type="number"
          id="interval"
          min={1}
          className={`form-control ${errors.recurrencyRule ? 'is-invalid' : ''}`} 
          {...register('recurrencyRule.interval')} 
        />
        <p>
          {
            (function() {
              switch (frequency) {
                case "DAILY":
                  return " Days"; 
                  break;

                case "WEEKLY":
                  return " Weeks"; 
                  break;

                case "MONTHLY":
                  return " Months"; 
                  break;

                default:
                  break;
              }
            }())
          }
        </p>
        {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
      </div>


      { 
        frequency === 'WEEKLY' &&  (
          <div className="d-flex">
            <div className="me-2">On: </div>
            <div className="btn-group">
              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="MO" id="mo"/>
              <label className="btn btn-primary" htmlFor="mo">MO</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="TU" id="tu"/>
              <label className="btn btn-primary" htmlFor="tu">TU</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="WE" id="we"/>
              <label className="btn btn-primary" htmlFor="we">WE</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="TH" id="th"/>
              <label className="btn btn-primary" htmlFor="th">TH</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="FR" id="fr"/>
              <label className="btn btn-primary" htmlFor="fr">FR</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="SA" id="sa"/>
              <label className="btn btn-primary" htmlFor="sa">SA</label>

              <input type="checkbox" {...register('recurrencyRule.byday')} className="btn-check" value="SU" id="su"/>
              <label className="btn btn-primary" htmlFor="su">SU</label>
            </div>
            {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
          </div>
        )
      }

      {
        frequency === 'MONTHLY' && (
          <div className="container mb-3">
            
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="byMonthDay" checked={byMonthDay} onClick={() => setByMonthDay(!byMonthDay)}/>
              <label className="form-check-label" htmlFor="byMonthDay">Select month Days (1-31)</label>

              <div className="btn-group d-flex flex-wrap">
                {[...Array(31).keys()].map((i) => (
                  <>
                    <input type="checkbox" className="btn-check" value={i + 1} id={`${i + 1}`} disabled={!byMonthDay} { ...register(`recurrencyRule.bymonthday`) }/>
                    <label className="btn btn-secondary" htmlFor={`${i + 1}`}>{i + 1}</label>
                  </>
                ))}
              </div>

            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="notByMonthDay" checked={!byMonthDay} onClick={() => setByMonthDay(!byMonthDay)}/>
              <label className="form-check-label" htmlFor="notByMonthDay"></label>
              <div className="container mb-3">
                <label htmlFor="setpos" className="form-label">On the</label>
                <select className="form-select" id="setpos" {...register('recurrencyRule.bysetpos')} aria-label="Select setpos" disabled={byMonthDay}>
                  <option value="1" selected>First</option>
                  <option value="2">Second</option>
                  <option value="3">Third</option>
                  <option value="4">Fourth</option>
                  <option value="-1">Last</option>
                </select>
              </div>
              <div className="container mb-3">
                <select className="form-select" id="setpos" {...register('recurrencyRule.bysetpos')} aria-label="Select setpos" disabled={byMonthDay}>
                  <option value="MO" selected>Monday</option>
                  <option value="TU">Tuesday</option>
                  <option value="WE">Wednesday</option>
                  <option value="TH">Thursday</option>
                  <option value="FR">Friday</option>
                  <option value="SA">Saturday</option>
                  <option value="SU">Sunday</option>
                </select>
              </div>
            </div>
          </div>
        )
      }
    </>
  ); 
}
