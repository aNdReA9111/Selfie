import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { EventFormData } from "../utils/types";

type RecurringEventFormProps = {
    watch: UseFormWatch<EventFormData>;
    register: UseFormRegister<EventFormData>;
    errors: FieldErrors<EventFormData>;
    setValue: UseFormSetValue<EventFormData>;
};


export const RRuleForm: React.FC<RecurringEventFormProps> = ({ watch, register, errors, setValue }) => {

    const frequency: string = watch('recurrenceRule.frequency');
    // Derived from form state instead of local state
    const byMonthDay = frequency === 'MONTHLY' && !watch('recurrenceRule.bysetpos');
    const bySpecificDay = frequency === 'YEARLY' && !watch('recurrenceRule.bysetpos');
    const [endType, setEndType] = useState<string>(!watch('recurrenceRule.until') ? 'count' : 'until');

    const onInputModeChangeMonthly = () => {
        const currentBySetPos = watch('recurrenceRule.bysetpos');
        if (currentBySetPos) {
            // Switch to bymonthday mode
            setValue('recurrenceRule.byday', undefined);
            setValue('recurrenceRule.bysetpos', undefined);
            setValue('recurrenceRule.bymonthday', []);
        } else {
            // Switch to bysetpos mode
            setValue('recurrenceRule.bymonthday', undefined);
            setValue('recurrenceRule.byday', "MO");
            setValue('recurrenceRule.bysetpos', 1);
        }
    }

    const onInputModeChangeYearly = () => {
        const currentBySetPos = watch('recurrenceRule.bysetpos');
        if (currentBySetPos) {
            // Switch to bymonthday mode
            setValue('recurrenceRule.byday', undefined);
            setValue('recurrenceRule.bysetpos', undefined);
            setValue('recurrenceRule.bymonth', 1);
            setValue('recurrenceRule.bymonthday', []);
        } else {
            // Switch to bysetpos mode
            setValue('recurrenceRule.bymonthday', undefined);
            setValue('recurrenceRule.byday', "MO");
            setValue('recurrenceRule.bysetpos', 1);
            setValue('recurrenceRule.bymonth', 1);
        }
    }

    const onEndTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'count') {
            setValue('recurrenceRule.until', undefined);
        } else {
            setValue('recurrenceRule.count', undefined);
        }
        setEndType(event.target.value);
    }

    const isMonthDayChecked = (day: number): boolean => {
        const bymonthday = watch('recurrenceRule.bymonthday');
        return Array.isArray(bymonthday) ? bymonthday.includes(day) : bymonthday === day;
    }

    const onFrequencyChange = () => {
        // Reset relevant fields when frequency changes
        setValue("recurrenceRule.byday", []);
        setValue("recurrenceRule.bymonth", undefined);
        setValue("recurrenceRule.bysetpos", undefined);
        setValue("recurrenceRule.bymonthday", undefined);
    }

    return (
        <>

            {/*frequency*/}
            <div className="mb-3">
                <label htmlFor="frequency" className="form-label">Frequency</label>
                <select className="form-select" id="frequency" {...register('recurrenceRule.frequency')}
                    onChange={(e) => {
                        onFrequencyChange();
                        register('recurrenceRule.frequency').onChange(e); // Default RHF onChange handler
                    }}
                    aria-label="Select frequency">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                </select>
                {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
            </div>

            {/*interval*/}
            <div className="mb-3">
                <label htmlFor="interval" className="form-label">Every </label>
                <input
                    type="number"
                    id="interval"
                    min={1}
                    defaultValue={1}
                    className={`form-control ${errors.recurrenceRule ? 'is-invalid' : ''}`}
                    {...register('recurrenceRule.interval')}
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

                                case "YEARLY":
                                    return " Years";
                                    break;

                                default:
                                    return " Days";
                                    break;
                            }
                        }())
                    }
                </p>
                {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
            </div>


            {
                frequency === 'WEEKLY' && (
                    <div className="d-flex">
                        <div className="me-2">On: </div>
                        <div className="btn-group">
                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="MO" id="mo" defaultChecked={watch('recurrenceRule.byday')?.includes('MO')} />
                            <label className="btn btn-primary" htmlFor="mo">MO</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="TU" id="tu" defaultChecked={watch('recurrenceRule.byday')?.includes('TU')} />
                            <label className="btn btn-primary" htmlFor="tu">TU</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="WE" id="we" defaultChecked={watch('recurrenceRule.byday')?.includes('WE')} />
                            <label className="btn btn-primary" htmlFor="we">WE</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="TH" id="th" defaultChecked={watch('recurrenceRule.byday')?.includes('TH')} />
                            <label className="btn btn-primary" htmlFor="th">TH</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="FR" id="fr" defaultChecked={watch('recurrenceRule.byday')?.includes('FR')} />
                            <label className="btn btn-primary" htmlFor="fr">FR</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="SA" id="sa" defaultChecked={watch('recurrenceRule.byday')?.includes('SA')} />
                            <label className="btn btn-primary" htmlFor="sa">SA</label>

                            <input type="checkbox" {...register('recurrenceRule.byday')} className="btn-check" value="SU" id="su" defaultChecked={watch('recurrenceRule.byday')?.includes('SU')} />
                            <label className="btn btn-primary" htmlFor="su">SU</label>
                        </div>
                    </div>
                )
            }

            {
                frequency === 'MONTHLY' && (
                    <div className="container mb-3">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="byMonthDay" onChange={_ => { }} checked={byMonthDay} onClick={onInputModeChangeMonthly} />
                            <label className="form-check-label" htmlFor="byMonthDay">Select month Days (1-31)</label>

                            {byMonthDay && <div className="btn-group d-flex flex-wrap">
                                {[...Array(31).keys()].map((i) => (
                                    <>
                                        <input defaultChecked={isMonthDayChecked(i + 1)} type="checkbox" {...register('recurrenceRule.bymonthday')} className="btn-check" value={`${i + 1}`} key={uuidv4()} id={`${i + 1}`} disabled={!byMonthDay} />
                                        <label className="btn btn-primary" style={{ borderRadius: '0.7rem' }} key={uuidv4()} htmlFor={`${i + 1}`}>{i + 1}</label>
                                    </>
                                ))}
                            </div>}

                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="notByMonthDay" onChange={_ => { }} checked={!byMonthDay} onClick={onInputModeChangeMonthly} />
                            <label className="form-check-label" htmlFor="notByMonthDay"></label>
                            {!byMonthDay && <><div className="container mb-3">
                                <label htmlFor="setpos" className="form-label">On the</label>
                                <select className="form-select" id="setpos" {...register('recurrenceRule.bysetpos')} aria-label="Select setpos" disabled={byMonthDay}>
                                    <option value="1">First</option>
                                    <option value="2">Second</option>
                                    <option value="3">Third</option>
                                    <option value="4">Fourth</option>
                                    <option value="-1">Last</option>
                                </select>
                            </div>
                                <div className="container mb-3">
                                    <select className="form-select" {...register('recurrenceRule.byday')} aria-label="Select week day" disabled={byMonthDay}>
                                        <option value="MO">Monday</option>
                                        <option value="TU">Tuesday</option>
                                        <option value="WE">Wednesday</option>
                                        <option value="TH">Thursday</option>
                                        <option value="FR">Friday</option>
                                        <option value="SA">Saturday</option>
                                        <option value="SU">Sunday</option>
                                    </select>
                                </div> </>}
                        </div>
                    </div>
                )
            }
            {
                frequency === 'YEARLY' && (
                    <div className="container mb-3">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="bySpecificDay" checked={bySpecificDay} onChange={onInputModeChangeYearly} />
                            <label className="form-check-label" htmlFor="bySpecificDay">On </label>
                            {bySpecificDay && (<>
                                { /*<div className="container mb-3">
                                    <select className="form-select" {...register('recurrenceRule.bymonthday')} id="setmonthday" aria-label="Select month day">
                                        {[...Array(31).keys()].map((i: number) => {
                                            return (<option value={`${i + 1}`} key={uuidv4()}>{i + 1}</option>);
                                        })}
                                    </select>
                                </div>*/}
                                <div className="container mb-3">
                                    <select
                                        className="form-select"
                                        {...register('recurrenceRule.bymonthday')}
                                        id="setmonthday"
                                        aria-label="Select month day"
                                    >
                                        {[...Array(31).keys()].map((i) => (
                                            <option value={i + 1} key={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="container mb-3">
                                    <label htmlFor="setmonth" className="form-label">Of</label>
                                    <select className="form-select" id="setmonth" {...register('recurrenceRule.bymonth')} aria-label="Select month">
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
                            </>)}
                        </div>

                        <div className="form-check form-switch flex">
                            <input className="form-check-input" type="checkbox" role="switch" id="notBySpecificDay" checked={!bySpecificDay} onChange={onInputModeChangeYearly} />
                            <label className="form-check-label" htmlFor="notBySpecificDay"></label>
                            {!bySpecificDay && (<>
                                <div className="container mb-3">
                                    <label htmlFor="setpos2" className="form-label">On the</label>
                                    <select className="form-select" id="setpos2" {...register('recurrenceRule.bysetpos')} aria-label="Select setpos" disabled={bySpecificDay}>
                                        <option value="1">First</option>
                                        <option value="2">Second</option>
                                        <option value="3">Third</option>
                                        <option value="4">Fourth</option>
                                        <option value="-1">Last</option>
                                    </select>
                                    {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
                                </div>
                                <div className="container mb-3">
                                    <select className="form-select" id="setweekday" {...register('recurrenceRule.byday')} aria-label="Select weekday" disabled={bySpecificDay}>
                                        <option value="MO">Monday</option>
                                        <option value="TU">Tuesday</option>
                                        <option value="WE">Wednesday</option>
                                        <option value="TH">Thursday</option>
                                        <option value="FR">Friday</option>
                                        <option value="SA">Saturday</option>
                                        <option value="SU">Sunday</option>
                                    </select>
                                    {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
                                </div>
                                <div className="container mb-3">
                                    <label htmlFor="setmonth2" className="form-label">Of</label>
                                    {!bySpecificDay && (<select className="form-select" id="setmonth2" {...register('recurrenceRule.bymonth')} aria-label="Select month">
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
                                    </select>)}
                                    {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
                                </div>
                            </>)}
                        </div>
                    </div>
                )
            }

            {/*until*/}
            <div className="mt-4 mb-3 d-flex align-items-center">
                <label htmlFor="endType" className="form-label">End Recurrency</label>
                <select id="endType" className="form-select ms-auto" value={endType} onChange={onEndTypeChange} aria-label="Select until">
                    <option value="count">After</option>
                    <option value="until">On</option>
                </select>
            </div>
            {
                endType === 'until' && (
                    <div className="mb-3">
                        <input
                            type="datetime-local"
                            id="until"
                            className={`form-control ${errors.recurrenceRule ? 'is-invalid' : ''}`}
                            {...register('recurrenceRule.until')}
                        />
                        {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
                    </div>
                )
            }
            {
                endType === 'count' && (
                    <div className="mb-3 d-flex">
                        <input
                            type="number"
                            id="count"
                            defaultValue={1}
                            min={1}
                            className={`w-50 form-control ${errors.recurrenceRule ? 'is-invalid' : ''}`}
                            {...register('recurrenceRule.count')}
                        />
                        {errors.recurrenceRule && <div className="invalid-feedback">{errors.recurrenceRule.message}</div>}
                        <p className="ms-5">occurences</p>
                    </div>
                )
            }
        </>
    );
}
