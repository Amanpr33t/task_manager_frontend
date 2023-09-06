import './Body.css'
import React, { useEffect, useCallback, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DeleteTasksActions } from '../store/slices/deleteTasks';
import { FiltersAppliedActions } from '../store/slices/filtersApplied-slice';
import { LoadingActions } from '../store/slices/loading-slice';
import { ResetCheckboxActions } from '../store/slices/resetCheckbox-slice';
import { TaskDataActions } from '../store/slices/taskData-slice';
import { BlurActions } from '../store/slices/blur_slice';
import { LogoutClickActions } from '../store/slices/logoutClick_slice';
import { AddTaskActions } from '../store/slices/addTask-slice';
import { EditActions } from '../store/slices/edit-slice';
import dateMaker from '../utils/dateMaker';
import { ErrorActions } from '../store/slices/error-slice';

function Body({ filterEnabler }) {

    const authToken = localStorage.getItem('task_auth_token')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [taskData, setTaskData] = useState()
    const [selectedTasks, setSelectedTasks] = useState('')

    const isBlur = useSelector(state => state.Blur.isBlur)
    const isDeleteTasks = useSelector(state => state.DeleteTasks.isDeleteTasks)
    const isLogoutClick = useSelector(state => state.LogoutClick.isLogoutClick)
    const query = useSelector(state => state.Query.query)
    const isLoading = useSelector(state => state.Loading.isLoading)
    const isResetCheckbox = useSelector(state => state.ResetCheckbox.isResetCheckbox)
    

    const checkBoxHandler = (id, e) => {
        if (e.target.checked) {
            setSelectedTasks(tasksId => tasksId.concat(`$${id}`))
            dispatch(DeleteTasksActions.setDeleteTasks(true))
        } else {
            let taskArray = selectedTasks.split('$').splice(1, selectedTasks.split('$').length)
            if (taskArray.length === 1) {
                dispatch(DeleteTasksActions.setDeleteTasks(false))
            }
            setSelectedTasks('')
            taskArray.filter(taskId => taskId !== id).map(taskId => {
                return setSelectedTasks(id => id.concat(`$${taskId}`))
            })
        }
    }

    useEffect(() => {
        if (!authToken) {
            navigate('/login_signUp', { replace: true })
        }
    }, [navigate, authToken])

    useEffect(() => {
        dispatch(AddTaskActions.setAddTask(false))
        dispatch(FiltersAppliedActions.setFiltersApplied(false))
        dispatch(EditActions.setEdit({
            isEdit: false,
            title: null,
            content: null,
            completionDate: null,
            taskId: null
        }))
    }, [dispatch])


    const resetCheckboxFunction = useCallback(() => {
        selectedTasks.split('$').splice(1, selectedTasks.split('$').length).map(taskId => {
            if (document.getElementById(taskId)) {
                return document.getElementById(taskId).checked = false
            } else {
                return null
            }
        })
        setSelectedTasks('')
    }, [selectedTasks])

    useEffect(() => {
        if (isResetCheckbox) {
            resetCheckboxFunction()
        }
    }, [isResetCheckbox, resetCheckboxFunction])

    const fetchTasks = useCallback(async () => {
        dispatch(LoadingActions.setLoading(true))
        dispatch(ErrorActions.setError(false))
        const url = `https://taskmanagar-backend.onrender.com/task/getAllTasks${query ? query : ''}`
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'session_expired') {
                dispatch(LoadingActions.setLoading(false))
                navigate('/login_signUp', { replace: true })
                dispatch(LogoutClickActions.setLogoutClick(true))
            } else if (data.status === 'ok') {
                
                if (query) {
                    dispatch(FiltersAppliedActions.setFiltersApplied(true))
                }
                if (data.count === 0) {
                    dispatch(TaskDataActions.setTaskData(false))
                } else {
                    dispatch(TaskDataActions.setTaskData(true))
                }
                setTaskData(data)
                dispatch(LoadingActions.setLoading(false))
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
            dispatch(BlurActions.setBlur(true))
        }
    }, [authToken, query, dispatch, navigate])


    useEffect(() => {
        if (!isLogoutClick) {
            fetchTasks()
        }
    }, [fetchTasks, isLogoutClick])


    const deleteTask = async (tasks) => {
        dispatch(LoadingActions.setLoading(true))
        dispatch(ErrorActions.setError(false))
        let url
        if (typeof tasks === 'string' && tasks.toString().startsWith('$')) {
            url = `https://taskmanagar-backend.onrender.com/task/deleteSelectedTasks/${tasks}`
        } else {
            url = `https://taskmanagar-backend.onrender.com/task/deleteTask/${tasks}`
        }
        try {
            const response = await fetch(url, {
                method: 'DELETE',
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
                fetchTasks()
                if (tasks.toString().startsWith('$')) {
                    resetCheckboxFunction()
                    dispatch(DeleteTasksActions.setDeleteTasks(false))
                }
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
            dispatch(BlurActions.setBlur(true))
        }
    }

    const editTask = async ({ taskId, taskData }) => {
        dispatch(LoadingActions.setLoading(true))
        dispatch(ErrorActions.setError(false))
        try {
            const response = await fetch(`https://taskmanagar-backend.onrender.com/task/editTask/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(taskData),
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
                fetchTasks()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
            dispatch(BlurActions.setBlur(true))
        }
    }


    return (
        <React.Fragment>
            {isDeleteTasks && <div className={`delete_tasks ${isBlur ? 'blur' : null}`} ><button onClick={() => deleteTask(selectedTasks)}>Delete Tasks</button></div>}

            <div className={`task_container ${isBlur ? 'blur' : null}`}>
                {!isLoading && taskData && taskData.count === 0 && <div className="no_tasks">
                    <p>No tasks found.</p>
                </div>}
                {!isLoading && taskData && taskData.count > 0 && taskData.allTasks.map((task) => {
                    return <div className='task_body' key={task._id} >
                        <p className={`task-status ${task.status}`}>{task.status}</p>
                        {!filterEnabler && <input type="checkbox" id={task._id} onChange={e => checkBoxHandler(task._id, e)} name="task_checkbox" onClick={(e) => {
                            e.stopPropagation()
                            dispatch(ResetCheckboxActions.setResetCheckbox(false))
                        }} />}
                        <h3 className='title_heading'>Title:</h3>
                        <p>{task.title}</p>
                        <h3>Description:</h3>
                        <p className='task-content'>{task.content}</p>
                        <div className='completion_date'>
                            <h3>Completion Date:</h3>
                            <p>{dateMaker(task.completionDate)}</p>
                        </div>
                        {!isDeleteTasks && <div className='task-update'>
                            <button onClick={() => deleteTask(task._id)}><FaTrash /></button>
                            {task.status !== 'completed' && task.status !== 'cancelled' && <><button onClick={() => {
                                dispatch(EditActions.setEdit({
                                    isEdit: true,
                                    title: task.title,
                                    content: task.content,
                                    completionDate: task.completionDate,
                                    taskId: task._id
                                }))
                                navigate('/task_form', { replace: true })
                            }}><AiFillEdit /></button>
                                <select onClick={(e) => e.stopPropagation()} name="update" id="update" defaultValue="Update" onChange={(e) => editTask({ taskId: task._id, taskData: { status: e.target.value } })}>
                                    <option value="Update" disabled >Update Status</option>
                                    <option value='completed' >Completed</option>
                                    <option value='cancelled' >Cancel</option>
                                </select></>}
                        </div>}
                    </div>
                })}
            </div>
        </React.Fragment>
    )
}
export default Body

