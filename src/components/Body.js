import './Body.css'
import React, { useEffect } from 'react'
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteTasksActions } from '../store/slices/deleteTasks';
import dateMaker from './utils/dateMaker';
import { FiltersAppliedActions } from '../store/slices/filtersApplied-slice';
import { LoadingActions } from '../store/slices/loading-slice';
import { ResetCheckboxActions } from '../store/slices/resetCheckbox-slice';
import { TaskDataActions } from '../store/slices/taskData-slice';

function Body() {
    const dispatch = useDispatch()
    const [taskData, setTaskData] = useState()
    const isBlur = useSelector(state => state.Blur.isBlur)
    const isDeleteTasks = useSelector(state => state.DeleteTasks.isDeleteTasks)
    const query = useSelector(state => state.Query.query)
    const authToken = localStorage.getItem('task_auth_token')
    const [selectedTasks, setSelectedTasks] = useState('')
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
            if (data.status === 'ok') {
                dispatch(LoadingActions.setLoading(false))
                if (query) {
                    dispatch(FiltersAppliedActions.setFiltersApplied(true))
                }
                if(data.count===0){
                    dispatch(TaskDataActions.setTaskData(false))
                }else{
                    dispatch(TaskDataActions.setTaskData(true))
                }
                setTaskData(data)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(LoadingActions.setLoading(false))
            console.log(error)
        }
    }, [authToken, query, dispatch])

    const resetCheckboxFunction = useCallback(() => {
        selectedTasks.split('$').splice(1, selectedTasks.split('$').length).map(taskId => {
            if (document.getElementById(taskId)) {
                return document.getElementById(taskId).checked = false
            } else {
                return null
            }
        })
        setSelectedTasks('')
    },[selectedTasks])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    useEffect(() => {
        if (isResetCheckbox) {
            resetCheckboxFunction()
        }
    }, [isResetCheckbox,resetCheckboxFunction])

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
            console.log(error)
        }
    }


    /*const dateMaker = (completionDate) => {
        const date = new Date(completionDate)
        const month = () => {
            if (date.getMonth() === 0) {
                return 'January'
            } else if (date.getMonth() === 1) {
                return 'February'
            } else if (date.getMonth() === 2) {
                return 'March'
            } else if (date.getMonth() === 3) {
                return 'April'
            } else if (date.getMonth() === 4) {
                return 'May'
            } else if (date.getMonth() === 5) {
                return 'June'
            } else if (date.getMonth() === 6) {
                console.log()
                return 'July'
            } else if (date.getMonth() === 7) {
                return 'August'
            } else if (date.getMonth() === 8) {
                return 'September'
            } else if (date.getMonth() === 9) {
                return 'October'
            } else if (date.getMonth() === 10) {
                return 'November'
            } else if (date.getMonth() === 11) {
                return 'December'
            }
        }
        return date.getDay().toString() + ' ' + month() + ', ' + date.getFullYear().toString()
    }*/



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
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            {isDeleteTasks && <div className='delete_tasks'><button onClick={() => deleteTask(selectedTasks)}> Delete Tasks</button></div>}
            <div className={`task_container ${isBlur ? 'blur' : null}`}>
                {!isLoading && taskData && taskData.count === 0 && <div className="no_tasks">
                    <p>No tasks found.</p>
                </div>}
                {!isLoading && taskData && taskData.count > 0 && taskData.allTasks.map((task) => {
                    return <div className='task_body' key={task._id} onClick={e => e.stopPropagation()}>
                        <p className='task-status'>{task.status}</p>
                        <input type="checkbox" id={task._id} onChange={e => {
                            checkBoxHandler(task._id, e)
                        }} name="task_checkbox" onClick={() => dispatch(ResetCheckboxActions.setResetCheckbox(false))}></input>
                        <p className='task-content'>{task.taskInfo}</p>
                        <div className='completion_date'>
                            <p>Completion Date:</p>
                            <p>{dateMaker(task.completionDate)}</p>
                        </div>
                        {!isDeleteTasks && <div className='task-update'>
                            <button onClick={() => deleteTask(task._id)}><FaTrash /></button>
                            {task.status !== 'completed' && task.status !== 'cancelled' && <><button><AiFillEdit /></button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'completed' } })}>Completed</button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'cancelled' } })}>Cancel Task</button></>}
                        </div>}
                    </div>
                })}
            </div>
        </React.Fragment>
    )
}
export default Body

