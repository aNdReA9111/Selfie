import { useState } from "react";
import { EventFormData } from "../utils/types";
import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

type RecurringEventFormProps = {
  watch: UseFormWatch<EventFormData>;
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
};

export const RRuleForm: React.FC<RecurringEventFormProps> = ({watch, register, errors, setValue}) => {

  const frequency: string = watch('recurrencyRule.frequency');
  const [byMonthDay, setByMonthDay] = useState<boolean>(false);
  const [bySpecificDay, setBySpecificDay] = useState<boolean>(false);
  console.log(errors.recurrencyRule);

  const onInputModeChangeMonthly = () => {
    if(byMonthDay)
      setValue('recurrencyRule.bymonthday', undefined);
    else {
      setValue('recurrencyRule.byday', undefined);
      setValue('recurrencyRule.bysetpos', undefined);
    }
    setByMonthDay(!byMonthDay);
  }

  const onInputModeChangeYearly = () => {
    if(bySpecificDay){
      setValue('recurrencyRule.bymonthday', undefined);
      setValue('recurrencyRule.bymonth', undefined);
    } else {
      setValue('recurrencyRule.byday', undefined);
      setValue('recurrencyRule.bysetpos', undefined);
      setValue('recurrencyRule.bymonth', undefined);
    }
    setBySpecificDay(!bySpecificDay);
  }

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

                case "YEARS":
                  return " Years";
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
          </div>
        )
      }

      {
        frequency === 'MONTHLY' && (
          <div className="container mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="byMonthDay" onChange={_ => {}} checked={byMonthDay} onClick={onInputModeChangeMonthly}/>
              <label className="form-check-label" htmlFor="byMonthDay">Select month Days (1-31)</label>

              <div className="btn-group d-flex flex-wrap">
                {[...Array(31).keys()].map((i) => (
                  <>
                    <input type="checkbox" {...register('recurrencyRule.bymonthday')} className="btn-check" value={`${i + 1}`}  key={uuidv4()} id={`${i + 1}`} disabled={!byMonthDay}/>
                    <label className="btn btn-primary" style={{borderRadius: '0.7rem'}} key={uuidv4()} htmlFor={`${i + 1}`}>{i + 1}</label>
                  </>
                ))}
              </div>

            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="notByMonthDay" onChange={_ => {}} checked={!byMonthDay} onClick={onInputModeChangeMonthly}/>
              <label className="form-check-label" htmlFor="notByMonthDay"></label>
              <div className="container mb-3">
                <label htmlFor="setpos" className="form-label">On the</label>
                <select className="form-select" id="setpos" {...register('recurrencyRule.bysetpos')} aria-label="Select setpos" disabled={byMonthDay}>
                  <option value="1">First</option>
                  <option value="2">Second</option>
                  <option value="3">Third</option>
                  <option value="4">Fourth</option>
                  <option value="-1">Last</option>
                </select>
              </div>
              <div className="container mb-3">
                <select className="form-select" {...register('recurrencyRule.byday')} aria-label="Select week day" disabled={byMonthDay}>
                  <option value="MO">Monday</option>
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
      {
        frequency === 'YEARLY' && (
          <div className="container mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="bySpecificDay" onChange={_ => {}} checked={bySpecificDay} onClick={onInputModeChangeYearly}/>
              <label className="form-check-label" htmlFor="bySpecificDay">On </label>
              <div className="container mb-3">
                <select className="form-select" {...register('recurrencyRule.bymonthday')} id="setmonthday" aria-label="Select month day" disabled={!bySpecificDay}>
                  {[...Array(31).keys()].map((i: number) => {
                    return (i === 0 ? <option value={`${i + 1}`} key={uuidv4()}>{i + 1}</option> : <option value={`${i + 1}`} key={uuidv4()}>{i + 1}</option>);
                  })}
                </select>
              </div>
              <div className="container mb-3">
                <label htmlFor="setmonth" className="form-label">Of</label>
                <select className="form-select" id="setmonth" {...register('recurrencyRule.bymonth')} aria-label="Select month" disabled={!bySpecificDay}>
                  <option value="1">Janaury</option>
                  <option value="2">Februrary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>

            </div>
            <div className="form-check form-switch flex">
              <input className="form-check-input" type="checkbox" role="switch" id="notBySpecificDay" onChange={_ => {}} checked={!bySpecificDay} onClick={onInputModeChangeYearly}/>
              <label className="form-check-label" htmlFor="notBySpecificDay"></label>
              <div className="container mb-3">
                <label htmlFor="setpos2" className="form-label">On the</label>
                <select className="form-select" id="setpos2" {...register('recurrencyRule.bysetpos')} aria-label="Select setpos" disabled={bySpecificDay}>
                  <option value="1">First</option>
                  <option value="2">Second</option>
                  <option value="3">Third</option>
                  <option value="4">Fourth</option>
                  <option value="-1">Last</option>
                </select>
                {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
              </div>
              <div className="container mb-3">
                <select className="form-select" id="setweekday" {...register('recurrencyRule.byday')} aria-label="Select weekday" disabled={bySpecificDay}>
                  <option value="MO">Monday</option>
                  <option value="TU">Tuesday</option>
                  <option value="WE">Wednesday</option>
                  <option value="TH">Thursday</option>
                  <option value="FR">Friday</option>
                  <option value="SA">Saturday</option>
                  <option value="SU">Sunday</option>
                </select>
                {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
              </div>
              <div className="container mb-3">
                <label htmlFor="setmonth2" className="form-label">Of</label>
                <select className="form-select" id="setmonth2" {...register('recurrencyRule.bymonth')} aria-label="Select month" disabled={bySpecificDay}>
                  <option value="1">Janaury</option>
                  <option value="2">Februrary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                {errors.recurrencyRule && <div className="invalid-feedback">{errors.recurrencyRule.message}</div>}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
