
import './App.css';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import { useState, useEffect } from 'react';
import Body from './components/Body';
import TaskForm from './components/TaskForm';
import LoginSignUp from './components/LoginSignUp';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loading from './components/Loading';
import ErrorModal from './components/ErrorModal';
import { useDispatch, useSelector } from 'react-redux';
import { BlurActions } from './store/slices/blur_slice';
import { ErrorModalActions } from './store/slices/errorModal_slice';
import { DeleteTasksActions } from './store/slices/deleteTasks';
import { FiltersAppliedActions } from './store/slices/filtersApplied-slice';
import { ResetCheckboxActions } from './store/slices/resetCheckbox-slice';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filterEnabler, setFilterEnabler] = useState({
    isFilters: false,
    isSortList: false,
    isYearList: false,
    isMonthList: false,
    isDateList: false,
    isStatus: false
  })

  useEffect(() => {
    if (localStorage.getItem('task_auth_token')) {
      navigate('/', { replace: true })
    } else {
      navigate('/login_signUp')
    }
  }, [navigate])

  const appClick = () => {
    dispatch(ResetCheckboxActions.setResetCheckbox(true))
    dispatch(DeleteTasksActions.setDeleteTasks(false))
    if (localStorage.getItem('task_auth_token')) {
      if (filterEnabler.isFilters) {
        setFilterEnabler({
          isFilters: false,
          isSortList: false,
          isYearList: false,
          isMonthList: false,
          isDateList: false,
          isStatus: false
        })
      }
    } else {
      dispatch(ErrorModalActions.setErrorModal(false))
      dispatch(BlurActions.setBlur(false))
    }
  }

  return (
    <div className="App" onClick={appClick}>
      <Navbar />
      <Filters filterEnabler={filterEnabler} filterSetterFunction={(data) => setFilterEnabler(data)} />
      <Routes>
        <Route path='/' element={ <Body />}></Route>
        <Route path='/task_form' element={<TaskForm />}></Route>
        <Route path='/login_signUp' element={<LoginSignUp />}></Route>
      </Routes>
      <Loading />
      <ErrorModal />
    </div>

  )
}

export default App;
