import { useForm } from "react-hook-form";
// import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormData } from "../utils/types";
// import { AttendeesForm } from "./AttendeesForm";
import { NotificationsForm } from "./NotificationsForm";
import { RRuleForm } from "./RRuleForm"

export const EventForm = () => {
  const { setValue, register, watch, handleSubmit, formState: { errors } } = useForm<EventFormData>({
      resolver: zodResolver(eventFormSchema)
    }
  );

  const isRecurring: boolean = watch('isRecurring');

  const onSubmit = async (data: EventFormData) => {
    console.log(data);

    //1 creazione Event completo con dati dal form con creazione stringa rrule
    //2 post al server
    //3 dati di ritorno --> aggiorna context 
    //4 genera eventi ricorrenti con rrule
  };

  console.log(errors);

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
