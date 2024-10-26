import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormData } from "../utils/types";
// import { AttendeesForm } from "./AttendeesForm";
import { NotificationsForm } from "./NotificationsForm";
import { RRuleForm } from "./RRuleForm"
import { RRule, Weekday } from "rrule";
import { DateTime } from "luxon";
import { useState } from "react";
// import { useAuthContext } from "../hooks/useAuthContext";
import { timeZonesNames } from "@vvo/tzdb";

function toUTC(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  const utcDateTime = dateTime.toUTC();
  return utcDateTime.toJSDate();
}

const weekDaysMap: Record<string, Weekday> = {
  'MO': RRule.MO,
  'TU': RRule.TU,
  'WE': RRule.WE,
  'TH': RRule.TH,
  'FR': RRule.FR,
  'SA': RRule.SA,
  'SU': RRule.SU
}

const frequenciesMap: Record<string, number> = {
  'DAILY': RRule.DAILY,
  'WEEKLY': RRule.WEEKLY,
  'MONTHLY':RRule.MONTHLY,
  'YEARLY': RRule.YEARLY
}

export const EventForm = () => {
  const { setValue, register, watch, handleSubmit, formState: { errors } } = useForm<EventFormData>({
      resolver: zodResolver(eventFormSchema)
    }
  );
  const isRecurring: boolean = watch('isRecurring');
  const [open, setOpen] = useState<boolean>(false); //for suggestions
  let suggestions: string[] = [];
  
  // const { user } = useAuthContext();
  
  const onSuggestionClick = (suggestion: string) => {
    console.log("hello");
    setValue('timezone', suggestion);
    setOpen(false);
  }

  suggestions = timeZonesNames.filter((tz) => tz.includes(watch('timezone')));



  const onSubmit = async (data: EventFormData) => {
    console.log(data);

    const notifications = {
      notifica_email: data.notifications?.notifica_email,
      notifica_desktop: data.notifications?.notifica_desktop,
      advance: data.notifications?.advance,
      advanceType: data.notifications?.advanceType,
      repetitions: data.notifications?.repetitions,
      frequencyType: data.notifications?.frequencyType,
      frequency: data.notifications?.frequency,
      text: data.notifications?.text,
      before: (data.notifications?.notifica_desktop || data.notifications?.notifica_email) ? true: undefined
    }

    let rrule = undefined;
    let byweekday = undefined;
    

    if(data.isRecurring && typeof data.recurrencyRule === 'object') {
      //byday could be a single value or an array
      if(data.recurrencyRule.byday) {
        if (typeof data.recurrencyRule.byday !== 'string') {
          byweekday = data.recurrencyRule.byday.map((day: string) => weekDaysMap[day]) 
        }
        else {
          byweekday = weekDaysMap[data.recurrencyRule.byday];
        }
      }
      rrule = new RRule({
        freq: frequenciesMap[data.recurrencyRule.frequency],
        interval: data.recurrencyRule.interval,
        dtstart: toUTC(data.date),
        count: data.recurrencyRule.count,
        until: data.recurrencyRule.until ? toUTC(data.recurrencyRule?.until): undefined,
        byweekday,
        bymonthday: data.recurrencyRule.bymonthday,
        bymonth: data.recurrencyRule.bymonth,
        bysetpos: data.recurrencyRule.bysetpos
      })
    }

    const event = {
      title: data.title,
      description: data.description,
      start: toUTC(data.date),
      end: toUTC(data.endDate),
      duration: toUTC(data.endDate).getTime() - toUTC(data.date).getTime(),
      isRecurring: data.isRecurring,
      nextDate: toUTC(data.date),
      location: data.location,
      url: data.url,
      notifications,
      recurrencyRule: rrule? rrule.toString(): undefined,
      timezone: data.timezone
    }

    console.log(event)
    
    // try {
    //   const response = await fetch('https://localhost:4000/api/events', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${user?.token}`
    //     },
    //     body: JSON.stringify(event)
    //   });
    //   const data: Event = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error(error);
    // }

    //3 dati di ritorno --> aggiorna context
    //4 genera eventi ricorrenti con rrule
  };

  // console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              {...register('title')}
            />
            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              {...register('description')}
              rows={5}
            />
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">Start Date</label>
            <input
              id="date"
              type="datetime-local"
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              {...register('date')}
            />
            {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              id="endDate"
              type="datetime-local"
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
              {...register('endDate')}
            />
            {errors.endDate && <div className="invalid-feedback">{errors.endDate.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="timezone" className="form-label">Timezone</label>
            <input id="timezone" className={`form-control ${errors.timezone ? 'is-invalid' : ''}`} {...register('timezone')} onFocus={() => setOpen(true)}/>
            {errors.timezone && <div className="invalid-feedback">{errors.timezone.message}</div>}
            <ul onBlur={() => setOpen(false)} className={`list-group ${!open ? 'd-none' : ''}`}>
              {
                suggestions.map((suggestion: string, index: number) => (
                  <li className="list-group-item" key={index} onClick={() => {onSuggestionClick(suggestion)}} style={{cursor: 'pointer'}}>
                    {suggestion}
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              <i className="bi bi-geo-alt-fill"></i> Location
            </label>
            <input
              id="location"
              type="text"
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
              {...register('location')}
            />
            {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="url" className="form-label">
              <i className="bi bi-link-45deg"></i> URL
            </label>
            <input
              type="url"
              id="url"
              className={`form-control ${errors.url ? 'is-invalid' : ''}`}
              {...register('url')}
            />
            {errors.url && <div className="invalid-feedback">{errors.url.message}</div>}
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="isRecurring"
              className="form-check-input"
              {...register('isRecurring')}
            />
            <label className="form-check-label" htmlFor="isRecurring">Is this event recurring?</label>
          </div>
          {isRecurring && (<RRuleForm watch={watch} register={register} errors={errors} setValue={setValue}/>)}
        </div>
        <div className="col-sm-12 col-md-6">
          {/*<AttendeesForm register={register} errors={errors} watch={watch}/>*/}
          <NotificationsForm register={register} errors={errors} watch={watch} setValue={setValue}/>
          <button className="btn btn-primary mt-3" type="submit">
            Submit
            <i className="ms-2 bi bi-send"></i>
          </button>
        </div>
      </div>
    </form>
  )
}
