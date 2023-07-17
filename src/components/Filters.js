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

    const [daysInMonth, setDaysInMonth] = useState(oddDays)
    const [isLeapYear, setIsLeapYear] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState({
        sort: null,
        year: null,
        month: null,
        date: null,
        status: null
    })
    const [applyButton, setApplyButton] = useState(false)

    const allFalseFilters = {
        isSortList: false,
        isYearList: false,
        isMonthList: false,
        isDateList: false,
        isStatus: false
    }

    const filterReset = () => filterSetterFunction({
        isFilters: true,
        ...allFalseFilters
    })

    useEffect(() => {
        if (!filterEnabler.isFilters) {
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
    }, [filterEnabler.isFilters, dispatch])

    useEffect(() => {
        if (appliedFilters.sort || appliedFilters.year || appliedFilters.month || appliedFilters.date || appliedFilters.status) {
            setApplyButton(true)
        } else {
            setApplyButton(false)
        }
    }, [appliedFilters.sort, appliedFilters.year, appliedFilters.month, appliedFilters.date, appliedFilters.status])

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
        filterReset()
    }

    const monthClick = (data) => {
        setDaysInMonth(data.oddOrEven)
        setAppliedFilters((filters) => {
            return { ...filters, month: data.month, date: null }
        })
        filterReset()
    }

    const statusClick = (status) => {
        setAppliedFilters((filters) => {
            return { ...filters, status: status }
        })
        filterReset()
    }


    const applyFiltersFunction = async () => {
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
        filterSetterFunction({
            isFilters: false,
            ...allFalseFilters
        })
    }

    return (
        <React.Fragment>
            {!isLoading && <div className={`filter_container`} >
                {!isDeleteTasks && <div className="button_container">
                    {!isFiltersApplied && isTaskData && !isAddTask && <button onClick={(e) => {
                        e.stopPropagation()
                        filterSetterFunction({
                            isFilters: true,
                            ...allFalseFilters
                        })
                        dispatch(FiltersAppliedActions.setFiltersApplied(false))
                    }
                    } >Filters</button>}

                    {!filterEnabler.isFilters && !isFiltersApplied && !isAddTask && authToken && <button onClick={() => navigate('/task_form', { replace: true })}>Add task</button>}

                    {isFiltersApplied && !isAddTask && <button onClick={() => {
                        dispatch(QueryActions.setQuery(''))
                        dispatch(AddTaskActions.setAddTask(false))
                        dispatch(FiltersAppliedActions.setFiltersApplied(false))
                        filterSetterFunction({
                            isFilters: false,
                            isSortList: false,
                            isYearList: false,
                            isMonthList: false,
                            isDateList: false,
                            isStatus: false
                        })
                    }}>Remove Filters</button>}

                    {isAddTask && <button onClick={() => navigate('/', { replace: true })}>Back to Home</button>}
                </div>}

                {filterEnabler.isFilters &&
                    <div className="filter_options">

                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="filter_heading" onClick={() => {
                                if (filterEnabler.isSortList) {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters
                                    })
                                } else {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters,
                                        isSortList: true
                                    })
                                }
                            }} >Sort</div>
                            {filterEnabler.isSortList && <div className="sort_content" >
                                <div onClick={() => {
                                    setAppliedFilters((filters) => {
                                        return { ...filters, sort: 'New' }
                                    })
                                    filterReset()
                                }}>New to Old</div>
                                <div onClick={() => {
                                    setAppliedFilters((filters) => {
                                        return { ...filters, sort: 'Old' }
                                    })
                                    filterReset()
                                }}>Old to New</div>
                            </div>}
                        </div>

                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="filter_heading" onClick={() => {
                                if (filterEnabler.isYearList) {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters
                                    })
                                } else {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters,
                                        isYearList: true
                                    })
                                }
                            }}>Year</div>
                            {filterEnabler.isYearList && <div className="year_content" >
                                <div onClick={() => yearClick({ year: 2023, isLeap: false })}>2023</div>
                                <div onClick={() => yearClick({ year: 2024, isLeap: true })}>2024</div>
                                <div onClick={() => yearClick({ year: 2025, isLeap: false })}>2025</div>
                                <div onClick={() => yearClick({ year: 2026, isLeap: false })}>2026</div>
                                <div onClick={() => yearClick({ year: 2027, isLeap: false })}>2027</div>
                                <div onClick={() => yearClick({ year: 2028, isLeap: true })}>2028</div>
                                <div onClick={() => yearClick({ year: 2029, isLeap: false })}>2029</div>
                                <div onClick={() => yearClick({ year: 2030, isLeap: false })}>2030</div>
                            </div>}
                        </div>

                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="filter_heading" onClick={() => {
                                if (filterEnabler.isMonthList) {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters
                                    })
                                } else {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters,
                                        isMonthList: true,
                                    })
                                }

                            }} >Month</div>
                            {filterEnabler.isMonthList && <div className="month_content" >
                                <div onClick={() => monthClick({
                                    month: 'January',
                                    oddOrEven: oddDays
                                })}>January</div>
                                <div onClick={() => monthClick({
                                    month: 'February',
                                    oddOrEven: isLeapYear ? leapDays : nonLeapDays
                                })}>February</div>
                                <div onClick={() => monthClick({
                                    month: 'March',
                                    oddOrEven: oddDays
                                })}>March</div>
                                <div onClick={() => monthClick({
                                    month: 'April',
                                    oddOrEven: evenDays
                                })}>April</div>
                                <div onClick={() => monthClick({
                                    month: 'May',
                                    oddOrEven: oddDays
                                })}>May</div>
                                <div onClick={() => monthClick({
                                    month: 'June',
                                    oddOrEven: evenDays
                                })}>June</div>
                                <div onClick={() => monthClick({
                                    month: 'July',
                                    oddOrEven: oddDays
                                })}>July</div>
                                <div onClick={() => monthClick({
                                    month: 'August',
                                    oddOrEven: oddDays
                                })}>August</div>
                                <div onClick={() => monthClick({
                                    month: 'September',
                                    oddOrEven: evenDays
                                })}>September</div>
                                <div onClick={() => monthClick({
                                    month: 'October',
                                    oddOrEven: oddDays
                                })}>October</div>
                                <div onClick={() => monthClick({
                                    month: 'November',
                                    oddOrEven: evenDays
                                })}>November</div>
                                <div onClick={() => monthClick({
                                    month: 'December',
                                    oddOrEven: oddDays
                                })}>December</div>
                            </div>}
                        </div>

                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="filter_heading" onClick={() => {
                                if (filterEnabler.isDateList) {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters
                                    })
                                } else {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters,
                                        isDateList: true
                                    })
                                }
                            }} >Date</div>
                            <div className="date_content" >
                                {filterEnabler.isDateList && daysInMonth.map((date) => {
                                    return <div onClick={() => {
                                        setAppliedFilters((filters) => {
                                            return { ...filters, date }
                                        })
                                        filterReset()
                                    }} key={date}>{date}</div>
                                })}
                            </div>
                        </div>

                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="filter_heading" onClick={() => {
                                if (filterEnabler.isStatus) {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters
                                    })
                                } else {
                                    filterSetterFunction({
                                        isFilters: true,
                                        ...allFalseFilters,
                                        isStatus: true
                                    })
                                }
                            }} >Status</div>
                            {filterEnabler.isStatus && <div className="status_content" >
                                <div onClick={() => statusClick('Pending')}>Pending</div>
                                <div onClick={() => statusClick('Completed')}>Completed</div>
                                <div onClick={() => statusClick('Delayed')}>Delayed</div>
                                <div onClick={() => statusClick('Cwancelled')}>Cancelled</div>
                            </div>}
                        </div>

                    </div>}

                {filterEnabler.isFilters && <div className="selected_filters" onClick={(e) => e.stopPropagation()}>
                    {appliedFilters.sort && <div className="selected_sort">
                        <p >{appliedFilters.sort}</p>
                        <p onClick={() => setAppliedFilters((filters) => {
                            return { ...filters, sort: null }
                        })}>X</p>
                    </div>}
                    {appliedFilters.year && <div className="selected_year">
                        <p>{appliedFilters.year}</p>
                        <p onClick={() => setAppliedFilters((filters) => {
                            return { ...filters, year: null }
                        })}>X</p>
                    </div>}
                    {appliedFilters.month && <div className="selected_month">
                        <p >{appliedFilters.month}</p>
                        <p onClick={() => setAppliedFilters((filters) => {
                            return { ...filters, month: null }
                        })}>X</p>
                    </div>}
                    {appliedFilters.date && <div className="selected_date">
                        <p>{appliedFilters.date}</p>
                        <p onClick={() => setAppliedFilters((filters) => {
                            return { ...filters, date: null }
                        })}>X</p>
                    </div>}
                    {appliedFilters.status && <div className="selected_status">
                        <p>{appliedFilters.status}</p>
                        <p onClick={() => setAppliedFilters(filters => {
                            return { ...filters, status: null }
                        })}>X</p>
                    </div>}
                </div>
                }
                {applyButton && <button onClick={e => {
                    e.stopPropagation()
                    applyFiltersFunction()
                }} className="apply_button">Apply</button>}
            </div>}
        </React.Fragment>
    )
}

export default Filters