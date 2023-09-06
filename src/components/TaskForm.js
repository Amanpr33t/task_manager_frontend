import React, { useEffect, useState } from "react";
import './TaskForm.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoadingActions } from "../store/slices/loading-slice";
import { BlurActions } from "../store/slices/blur_slice";
import { ErrorActions } from "../store/slices/error-slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { TaskDataActions } from "../store/slices/taskData-slice";
import { AddTaskActions } from "../store/slices/addTask-slice";
import { EditActions } from "../store/slices/edit-slice";
import dateMaker from "../utils/dateMaker";

function TaskForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authToken = localStorage.getItem('task_auth_token')
    const isLoading = useSelector(state => state.Loading.isLoading)
    const isBlur = useSelector(state => state.Blur.isBlur)
    const editInfo = useSelector(state => state.Edit)
    const [completionDate, setCompletionDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24));
    const [content, setContent] = useState('')
    const [isContentBlur, setIsContentBlur] = useState(false)
    const [title, setTitle] = useState('')
    const [isTitleBlur, setIsTitleBlur] = useState(false)
    const [dateError, setDateError] = useState(false)

    useEffect(() => {
        if (!authToken) {
            navigate('/login_signUp', { replace: true })
        }
    }, [navigate, authToken])

    useEffect(() => {
        dispatch(FiltersAppliedActions.setFiltersApplied(false))
        dispatch(TaskDataActions.setTaskData(false))
        dispatch(AddTaskActions.setAddTask(true))
    }, [dispatch])

   

    useEffect(() => {
        if (editInfo.isEdit) {
            setContent(editInfo.content)
            setTitle(editInfo.title)
            setCompletionDate(Date.parse(editInfo.completionDate))
        }
    }, [editInfo.isEdit, editInfo.content, editInfo.completionDate, editInfo.title])

    useEffect(() => {
        if (completionDate > new Date()) {
            setDateError(false)
        } else {
            setDateError(true)
        }
    }, [completionDate])

    const taskSubmit = async (e) => {
        e.preventDefault()
        if (content.trim().length === 0 || content.trim().length > 160) {
            return setIsContentBlur(true)
        } else if (title.trim().length === 0 || title.trim().length > 50) {
            return setIsTitleBlur(true)
        } else if((content.trim().length === 0 || content.trim().length > 160)&&(title.trim().length === 0 || title.trim().length > 50)){
            setIsContentBlur(true)
            setIsTitleBlur(true)
            return
        }
        if (!dateError ) {
            dispatch(LoadingActions.setLoading(true))
            dispatch(ErrorActions.setError(false))
            dispatch(BlurActions.setBlur(true))
            try {
                const body = {
                    title:title.toString(),
                    content: content.toString(),
                    completionDate
                }
                let url
                let method
                if (editInfo.isEdit) {
                    url = `https://taskmanagar-backend.onrender.com/task/editTask/${editInfo.taskId}`
                    method = 'PATCH'
                } else {
                    url = 'https://taskmanagar-backend.onrender.com/task/addTask'
                    method = 'POST'
                }
                const response = await fetch(url, {
                    method: method,
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                })
                if (!response.ok) {
                    throw new Error('Some error occured')
                }
                const data = await response.json()
                if (data.status === 'ok') {
                    dispatch(EditActions.setEdit({
                        isEdit: false,
                        title:null,
                        content: null,
                        completionDate: null,
                        taskId: null
                    }))
                    navigate('/', { replace: true })
                    dispatch(BlurActions.setBlur(false))
                    dispatch(LoadingActions.setLoading(false))
                } else {
                    throw new Error('Some error occured')
                }
            } catch (error) {
                dispatch(LoadingActions.setLoading(false))
                dispatch(ErrorActions.setError(true))
                navigate('/error', { replace: true })
                dispatch(BlurActions.setBlur(true))
            }
        }
    }

    return (
        <React.Fragment>
            {!isLoading && <div className={`task_outer_container ${isBlur ? 'blur' : null}`}>
                <div className="task_form">
                    <form >

                        <label htmlFor="title">Title</label>
                        <input style={{ 'fontSize': '18px' }} type="text" className="title_input" id="title" name="title" placeholder="Enter title here..." value={title} onChange={(e) => {
                            setTitle(e.target.value.trimStart())
                            setIsTitleBlur(false)
                        }} onBlur={() => setIsTitleBlur(true)}></input>
                        {isTitleBlur && (title.toString().trim().length > 50 || title.toString().trim().length === 0) && <p>{title.toString().trim().length > 50 ? 'Length of title should not be more than 50 characters' : 'Enter a title'}</p>}

                        <label htmlFor="content">Content</label>
                        <textarea style={{ 'fontSize': '18px' }} className="text_input" id="content" name="content" placeholder="Enter content here..." rows={7} value={content} onChange={(e) => {
                            setContent(e.target.value.trimStart())
                            setIsContentBlur(false)
                        }} onBlur={() => setIsContentBlur(true)}></textarea>
                        {isContentBlur && (content.toString().trim().length > 160 || content.toString().trim().length === 0) && <p>{content.toString().trim().length > 160 ? 'Length of content should not be more than 160 characters' : 'Enter some content'}</p>}
                    </form>
                    <div className="date_selector">
                        <div className="date_label">Completion Date</div>
                        <div className="date_picker">
                            <DatePicker selected={completionDate} onChange={(date) => setCompletionDate(date)} />
                        </div>
                        {dateError && <p>Enter a date greater than {dateMaker(new Date())} </p>}

                    </div>
                    <div className="task_button">
                        <button onClick={taskSubmit}>Submit</button>
                    </div>

                </div>
            </div>}


        </React.Fragment>
    )
}
export default TaskForm