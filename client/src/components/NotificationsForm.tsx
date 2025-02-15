export const NotificationsForm = ({ watch, register, errors }: any) => {
    const mailNotification: boolean | undefined | null = watch('notifications.notifica_email');
    const desktopNotification: boolean | undefined | null = watch('notifications.notifica_desktop');
    const frequencyType: string | undefined | null = watch('notifications.frequencyType');
    // console.log()

    return (
        <>
            <h4>Notifications</h4>
            {/*notification types*/}
            <div className="flex justify-content-evenly">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" {...register('notifications.notifica_email')} type="checkbox" id="mailNotification" />
                    <label className="form-check-label" htmlFor="mailNotification">Email Notification</label>
                </div>
                {errors.notifications?.notifica_email && <div className="invalid-feedback">{errors.notifications.notifica_email.message}</div>}
                <div className="form-check form-check-inline">
                    <input className="form-check-input" {...register('notifications.notifica_desktop')} type="checkbox" id="desktopNotification" />
                    <label className="form-check-label" htmlFor="desktopNotification">Desktop Notification</label>
                </div>
                {errors.notifications?.notifica_desktop && <div className="invalid-feedback">{errors.notifications.notifica_desktop.message}</div>}

            </div>

            {/*notification advance*/}
            {
                (mailNotification || desktopNotification) && (
                    <div className="mb-3">
                        {/*Advance Input*/}
                        <div className="mb-3 mt-3 d-flex">
                            <label htmlFor="advanceType" className="form-label">I want to receive notifications </label>
                            <input
                                type="number"
                                id="advance"
                                min={1}
                                defaultValue={1}
                                className={`form-control ms-2 w-25 ${errors.notifications?.advance ? 'is-invalid' : ''}`}
                                {...register('notifications.advance')}
                            />
                            {errors.notifications?.advance && <div className="invalid-feedback">{errors.notifications.advance.message}</div>}

                        </div>

                        <div className="mb-3">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.advanceType')} type="radio" name="notifications.advanceType" id="minuteAdvance" value="MINUTES" />
                                <label className="form-check-label" htmlFor="minuteAdvance">Minutes</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.advanceType')} type="radio" name="notifications.advanceType" id="hoursAdvance" value="HOURS" />
                                <label className="form-check-label" htmlFor="hoursAdvance">Hours</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.advanceType')} type="radio" name="notifications.advanceType" id="daysAdvance" value="DAYS" />
                                <label className="form-check-label" htmlFor="daysAdvance">Days</label>
                            </div>
                            <p className="mt-3">before start of the event.</p>
                            {errors.notifications?.advanceType && <div className="invalid-feedback">{errors.notifications.advanceType.message}</div>}
                        </div>
                    </div>)
            }

            {/*recurring notifications*/}
            {
                (mailNotification || desktopNotification) && (
                    <div>
                        {/*Advance Input*/}
                        <div className="mb-3 mt-5">
                            <p>I want to receive notifications </p>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.frequencyType')} type="radio" name="notifications.frequencyType" id="minutely" value="MINUTELY" />
                                <label className="form-check-label" htmlFor="minutely">Minutely</label>
                            </div>
                            {errors.notifications?.frequencyType && <div className="invalid-feedback">{errors.notifications.frequencyType.message}</div>}
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.frequencyType')} type="radio" name="notifications.frequencyType" id="hourly" value="HOURLY" />
                                <label className="form-check-label" htmlFor="hourly">Hourly</label>
                            </div>
                            {errors.notifications?.frequencyType && <div className="invalid-feedback">{errors.notifications.frequencyType.message}</div>}
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" {...register('notifications.frequencyType')} type="radio" name="notifications.frequencyType" id="daily" value="DAILY" />
                                <label className="form-check-label" htmlFor="daily">Daily</label>
                            </div>
                            {errors.notifications?.frequencyType && <div className="invalid-feedback">{errors.notifications.frequencyType.message}</div>}
                        </div>

                        {
                            (frequencyType === "MINUTELY" || frequencyType === "HOURLY") &&
                            (<div className="mb-3">
                                <label htmlFor="frequency" className="form-label">Every </label>
                                <input
                                    type="number"
                                    id="frequency"
                                    min={1}
                                    defaultValue={1}
                                    className={`form-control ${errors.notifications?.frequency ? 'is-invalid' : ''}`}
                                    {...register('notifications.frequency')}
                                />
                                {errors.notifications?.frequency && <div className="invalid-feedback">{errors.notifications.frequency.message}</div>}
                                <p>{frequencyType === "MINUTELY" ? " Minutes" : " Hours"}</p>
                            </div>)
                        }
                        <div>
                            <label htmlFor="repetitions" className="form-label">Number of notifications </label>
                            <input
                                type="number"
                                id="repetitions"
                                min={1}
                                defaultValue={1}
                                className={`form-control ${errors.notifications?.repetitions ? 'is-invalid' : ''}`}
                                {...register('notifications.repetitions')}
                            />
                            {errors.notifications?.repetitions && <div className="invalid-feedback">{errors.notifications.repetitions.message}</div>}
                        </div>
                    </div>
                )
            }
        </>
    );
};
