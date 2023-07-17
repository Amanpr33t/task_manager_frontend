import './Body.css'
import React, { useEffect,useCallback,useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DeleteTasksActions } from '../store/slices/deleteTasks';
import { FiltersAppliedActions } from '../store/slices/filtersApplied-slice';
import { LoadingActions } from '../store/slices/loading-slice';
import { ResetCheckboxActions } from '../store/slices/resetCheckbox-slice';
import { TaskDataActions } from '../store/slices/taskData-slice';
import { ErrorModalActions } from '../store/slices/errorModal_slice';
import { BlurActions } from '../store/slices/blur_slice';
import { LogoutClickActions } from '../store/slices/logoutClick_slice';
import { AddTaskActions } from '../store/slices/addTask-slice';
import { EditActions } from '../store/slices/edit-slice';
import dateMaker from '../utils/dateMaker';
import useStateReset from '../hooks/useStateReset';

function Body() {
    
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

    useEffect(()=>{
        dispatch(AddTaskActions.setAddTask(false))
        dispatch(FiltersAppliedActions.setFiltersApplied(false))
        dispatch(EditActions.setEdit({
            isEdit: false,
            taskInfo: null,
            completionDate: null,
            taskId: null
        }))
    },[dispatch])
        

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
    }, [isResetCheckbox])

    const fetchTasks = useCallback(async () => {
        dispatch(LoadingActions.setLoading(true))
        const url = `http://localhost:3001/task/getAllTasks${query ? query : ''}`
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
                navigate('/login_signUp', { replace: true })
                dispatch(LogoutClickActions.setLogoutClick(true))
            }
            if (data.status === 'ok') {
                dispatch(LoadingActions.setLoading(false))
                if (query) {
                    dispatch(FiltersAppliedActions.setFiltersApplied(true))
                }
                if (data.count === 0) {
                    dispatch(TaskDataActions.setTaskData(false))
                } else {
                    dispatch(TaskDataActions.setTaskData(true))
                }
                setTaskData(data)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            console.log(error)
            dispatch(LoadingActions.setLoading(false))
            dispatch(ErrorModalActions.setErrorModal({
                isErrorModal: true,
                message: 'Some error occured.'
            }))
            dispatch(BlurActions.setBlur(true))
        }
    }, [authToken, query, dispatch])


    useEffect(() => {
        if (!isLogoutClick) {
            fetchTasks()
        }
    }, [fetchTasks, isLogoutClick])
 

    const deleteTask = async (tasks) => {
        dispatch(LoadingActions.setLoading(true))
        let url
        if (typeof tasks === 'string' && tasks.toString().startsWith('$')) {
            url = `http://localhost:3001/task/deleteSelectedTasks/${tasks}`
        } else {
            url = `http://localhost:3001/task/deleteTask/${tasks}`
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
            dispatch(LoadingActions.setLoading(false))
            dispatch(ErrorModalActions.setErrorModal({
                isErrorModal: true,
                message: 'Some error occured.'
            }))
            dispatch(BlurActions.setBlur(true))
        }
    }

    const editTask = async ({ taskId, taskData }) => {
        dispatch(LoadingActions.setLoading(true))
        try {
            const response = await fetch(`http://localhost:3001/task/editTask/${taskId}`, {
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
            dispatch(LoadingActions.setLoading(false))
            dispatch(ErrorModalActions.setErrorModal({
                isErrorModal: true,
                message: 'Some error occured.'
            }))
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
                    return <div className='task_body' key={task._id} onClick={e => e.stopPropagation()}>
                        <p className={`task-status ${task.status}`}>{task.status}</p>
                        <input type="checkbox" id={task._id} onChange={e => {
                            checkBoxHandler(task._id, e)
                        }} name="task_checkbox" onClick={() =>  dispatch(ResetCheckboxActions.setResetCheckbox(false))}></input>
                        <p className='task-content'>{task.taskInfo}</p>
                        <div className='completion_date'>
                            <p>Completion Date:</p>
                            <p>{dateMaker(task.completionDate)}</p>
                        </div>
                        {!isDeleteTasks && <div className='task-update'>
                            <button onClick={() => deleteTask(task._id)}><FaTrash /></button>
                            {task.status !== 'completed' && task.status !== 'cancelled' && <><button onClick={() => {
                                dispatch(EditActions.setEdit({
                                    isEdit: true,
                                    taskInfo: task.taskInfo,
                                    completionDate: task.completionDate,
                                    taskId:task._id
                                }))
                                navigate('/task_form', { replace: true })
                            }}><AiFillEdit /></button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'completed' } })} >Task Completed</button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'cancelled' } })}>Cancel Task</button></>}
                        </div>}
                    </div>
                })}
            </div>
        </React.Fragment>
    )
}
export default Body

