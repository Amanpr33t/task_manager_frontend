import React, { useState, useEffect } from "react";
import './Filters.css'
import { useDispatch, useSelector } from "react-redux";
import { BlurActions } from "../store/slices/blur_slice";
import { QueryActions } from "../store/slices/query_slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { useNavigate } from "react-router-dom";
import { AddTaskActions } from "../store/slices/addTask-slice";

function Filters(props) {
    const authToken = localStorage.getItem('task_auth_token')
    const { filterEnabler, filterSetterFunction } = props
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const oddDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    const evenDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    const leapDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
    const nonLeapDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]

    const isDeleteTasks = useSelector(state => state.DeleteTasks.isDeleteTasks)
    const isAddTask = useSelector(state => state.AddTask.isAddTask)
    const isFiltersApplied = useSelector(state => state.FiltersApplied.isFiltersApplied)
    const isTaskData = useSelector(state => state.TaskData.isTaskData)
    const isLoading = useSelector(state => state.Loading.isLoading)
    const isError = useSelector(state => state.Error.isError)

    const [daysInMonth, setDaysInMonth] = useState(oddDays)
    const [isLeapYear, setIsLeapYear] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState({
        sort: null,
        year: null,
        month: null,
        date: null,
        status: null
    })
    const [noFilterError, setNoFilterError] = useState(false)
    const [isFilterFirstClick, setIsFilterFirstClick] = useState(false)

    useEffect(() => {
        if (isFilterFirstClick) {
            if (!appliedFilters.sort && !appliedFilters.date && !appliedFilters.month && !appliedFilters.status && !appliedFilters.year) {
                setNoFilterError(true)
            } else {
                setNoFilterError(false)
            }
        }
    }, [appliedFilters.sort, appliedFilters.date, appliedFilters.month, appliedFilters.status, appliedFilters.year, isFilterFirstClick])

    useEffect(() => {
        if (!filterEnabler) {
            setIsFilterFirstClick(false)
            setNoFilterError(false)
        }
    }, [filterEnabler])

    useEffect(() => {
        if (!filterEnabler) {
            setAppliedFilters({
                sort: null,
                year: null,
                month: null,
                date: null,
                status: null
            })
            dispatch(BlurActions.setBlur(false))
        } else {
            dispatch(BlurActions.setBlur(true))
        }
    }, [filterEnabler, dispatch])

    const yearClick = (data) => {
        if (data.year === 2024 || data.year === 2028) {
            if (appliedFilters.month === 'February') {
                setDaysInMonth(leapDays)
            }
        } else if (appliedFilters.month === 'February') {
            setDaysInMonth(nonLeapDays)
        }
        setAppliedFilters((filters) => {
            return { ...filters, year: data.year, date: null }
        })
        setIsLeapYear(data.isLeap)
    }

    const monthClick = (data) => {
        setDaysInMonth(data.oddOrEven)
        setAppliedFilters((filters) => {
            return { ...filters, month: data.month, date: null }
        })
    }


    const applyFiltersFunction = async () => {
        if (!appliedFilters.sort && !appliedFilters.date && !appliedFilters.month && !appliedFilters.status && !appliedFilters.year) {
            return setNoFilterError(true)
        }
        const monthNumber = () => {
            if (appliedFilters.month === 'January') {
                return 'month=0'
            } else if (appliedFilters.month === 'February') {
                return 'month=1'
            } else if (appliedFilters.month === 'March') {
                return 'month=2'
            } else if (appliedFilters.month === 'April') {
                return 'month=3'
            } else if (appliedFilters.month === 'May') {
                return 'month=4'
            } else if (appliedFilters.month === 'June') {
                return 'month=5'
            } else if (appliedFilters.month === 'July') {
                return 'month=6'
            } else if (appliedFilters.month === 'August') {
                return 'month=7'
            } else if (appliedFilters.month === 'September') {
                return 'month=8'
            } else if (appliedFilters.month === 'October') {
                return 'month=9'
            } else if (appliedFilters.month === 'November') {
                return 'month=10'
            } else if (appliedFilters.month === 'December') {
                return 'month=11'
            }
        }
        const sortQuery = appliedFilters.sort ? `sort=${appliedFilters.sort.toLowerCase()}` : ''
        const yearQuery = appliedFilters.year ? `year=${appliedFilters.year}` : ''
        const monthQuery = appliedFilters.month ? monthNumber() : ''
        const dateQuery = appliedFilters.date ? `date=${appliedFilters.date}` : ''
        const statusQuery = appliedFilters.status ? `status=${appliedFilters.status.toLowerCase()}` : ''
        let query = `?${sortQuery}&${yearQuery}&${monthQuery}&${dateQuery}&${statusQuery}`
        if (query === '?&&&&') {
            query = ''
        }
        if (query.endsWith('&' || '&&' || '&&&' || '&&&&')) {
            if (query.endsWith('&&&&')) {
                query = query.substring(0, query.length - 4)
            } else if (query.endsWith('&&&')) {
                query = query.substring(0, query.length - 3)
            } else if (query.endsWith('&&')) {
                query = query.substring(0, query.length - 2)
            } else if (query.endsWith('&')) {
                query = query.substring(0, query.length - 1)
            }
        }
        if (query.startsWith('?&' || '?&&' || '?&&&' || '?&&&&')) {
            if (query.startsWith('?&&&&')) {
                query = '?' + query.substring(5)
            } else if (query.startsWith('?&&&')) {
                query = '?' + query.substring(4)
            } else if (query.startsWith('?&&')) {
                query = '?' + query.substring(3)
            } else if (query.startsWith('?&')) {
                query = '?' + query.substring(2)
            }
        }
        if (query.includes('&&&&') || query.includes('&&&') || query.includes('&&')) {
            if (query.includes('&&&&')) {
                query = query.replace('&&&&', '&')
            } else if (query.includes('&&&')) {
                query = query.replace('&&&', '&')
            } else if (query.includes('&&')) {
                query = query.replace('&&', '&')
            }
        }
        dispatch(QueryActions.setQuery(query))
        filterSetterFunction(false)
        setIsFilterFirstClick(false)
        setNoFilterError(false)
    }
    return (
        <React.Fragment>
            {!isLoading && !isError && <div className={`filter_container`} >
                {!isDeleteTasks && <div className="button_container">
                    {!isFiltersApplied && isTaskData && !isAddTask && <button onClick={(e) => {
                        e.stopPropagation()
                        filterSetterFunction(true)
                        dispatch(FiltersAppliedActions.setFiltersApplied(false))
                    }
                    } >Filters</button>}

                    {!filterEnabler && !isFiltersApplied && !isAddTask && authToken && <button onClick={() => navigate('/task_form', { replace: true })}>Add task</button>}

                    {isFiltersApplied && !isAddTask && <button onClick={() => {
                        dispatch(QueryActions.setQuery(''))
                        dispatch(AddTaskActions.setAddTask(false))
                        dispatch(FiltersAppliedActions.setFiltersApplied(false))
                        filterSetterFunction(false)
                    }}>Remove Filters</button>}

                    {isAddTask && <button onClick={() => navigate('/', { replace: true })}>Back to Home</button>}
                </div>}

                {filterEnabler &&
                    <> <div className="filter_options">


                        <select className="dropdown" onClick={(e) => e.stopPropagation()} onChange={(e) => {
                            setAppliedFilters((filters) => {
                                return { ...filters, sort: e.target.value }
                            })
                            setIsFilterFirstClick(true)
                           
                        }} name="sort" id="sort" defaultValue="Sort By" >
                            <option value="Sort By" disabled >Sort By</option>
                            <option value='New' >Newest</option>
                            <option value='Old' >Oldest</option>
                        </select>


                        <select className="dropdown" onClick={(e) => e.stopPropagation()} onChange={(e) => {
                            setIsFilterFirstClick(true)
                            let isLeap
                            if (parseInt(e.target.value % 4 === 0)) {
                                isLeap = true
                            } else {
                                isLeap = false
                            }
                            yearClick({ year: parseInt(e.target.value), isLeap })
                           
                        }} name="year" id="year" defaultValue="Year" >
                            <option value="Year" disabled >Year</option>
                            <option value='2023' >2023</option>
                            <option value='2024' >2024</option>
                            <option value='2025' >2025</option>
                            <option value='2026' >2026</option>
                            <option value='2027' >2027</option>
                            <option value='2028' >2028</option>
                            <option value='2029' >2029</option>
                        </select>

                        <select className="dropdown" onClick={(e) => e.stopPropagation()} onChange={(e) => {
                            setIsFilterFirstClick(true)
                            let oddOrEven
                            if (e.target.value.split('$')[1] === 'odd') {
                                oddOrEven = oddDays
                            } else if (e.target.value.split('$')[1] === 'even') {
                                oddOrEven = evenDays
                            } else if (e.target.value.split('$')[1] === 'leap') {
                                oddOrEven = leapDays
                            } else {
                                oddOrEven = nonLeapDays
                            }
                            monthClick({
                                month: e.target.value.split('$')[0],
                                oddOrEven: oddOrEven
                            })
                        }} name="month" id="month" defaultValue="Month" >
                            <option disabled >Year</option>
                            <option value="January$odd" >January</option>
                            <option value={`February$${isLeapYear ? 'leap' : 'notLeap'}`} >February</option>
                            <option value='March$odd' >March</option>
                            <option value='April$even' >April</option>
                            <option value='May$odd' >May</option>
                            <option value='June$even' >June</option>
                            <option value='July$odd' >July</option>
                            <option value='August$odd' >August</option>
                            <option value='September$even' >September</option>
                            <option value='October$odd' >October</option>
                            <option value='December$even' >November</option>
                            <option value='December$odd' >December</option>
                        </select>

                        <select className="dropdown" onClick={(e) => e.stopPropagation()} onChange={(e) => {
                            setIsFilterFirstClick(true)
                            setAppliedFilters((filters) => {
                                return { ...filters, date: e.target.value }
                            })
                           
                        }} name="date" id="date" defaultValue="Date" >
                            <option disabled >Date</option>
                            {daysInMonth.map(date => {
                                return <option value={date} key={date} >{date}</option>
                            })}

                        </select>


                        <select className="dropdown" onClick={(e) => e.stopPropagation()} onChange={(e) => {
                            setIsFilterFirstClick(true)
                            setAppliedFilters((filters) => {
                                return { ...filters, status: e.target.value }
                            })
                           
                        }} name="status" id="status" defaultValue="Status" >
                            <option disabled >Status</option>
                            <option value='Pending' >Pending</option>
                            <option value='Completed' >Completed</option>
                            <option value='Delayed' >Delayed</option>
                            <option value='Cancelled' >Cancelled</option>
                        </select>


                    </div>
                        {noFilterError && <p>No filter selected</p>}
                        <button onClick={e => {
                            e.stopPropagation()
                            applyFiltersFunction()
                        }} className="apply_button">Apply</button>
                    </>}
            </div>}
        </React.Fragment>
    )
}

export default Filters