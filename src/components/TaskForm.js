import React, { useState } from "react";
import './TaskForm.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskForm() {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <React.Fragment>
            <div className="task_outer_container">
                <div className="task_form">
                    <form>
                        <label htmlFor="content">Content</label>
                        <textarea style={{ 'fontSize': '18px' }} className="text-input" id="content" name="content" placeholder="Enter content here..." rows={7}></textarea>
                    </form>
                    <div className="date_selector">
                        <div className="date_label">Completion Date</div>
                        <div>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>

                    </div>
                    <div className="task_button">
                        <button>Submit</button>
                    </div>

                </div>
            </div>


        </React.Fragment>
    )
}
export default TaskForm