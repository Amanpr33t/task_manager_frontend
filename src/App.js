import './App.css';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import { useState, useEffect } from 'react';
import Body from './components/Body';
import TaskForm from './components/TaskForm';
import LoginSignUp from './components/LoginSignUp';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loading from './components/Loading';
import ErrorPage from './components/ErrorPage';
import { useDispatch } from 'react-redux';
import { BlurActions } from './store/slices/blur_slice';
import { DeleteTasksActions } from './store/slices/deleteTasks';
import { ResetCheckboxActions } from './store/slices/resetCheckbox-slice';
import { Navigate } from 'react-router-dom';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filterEnabler, setFilterEnabler] = useState(false)
  const authToken = localStorage.getItem('task_auth_token')

  useEffect(() => {
    if (!authToken) {
      navigate('/login_signUp')
    }
  }, [navigate, authToken])

  const appClick = () => {
    dispatch(ResetCheckboxActions.setResetCheckbox(true))
    dispatch(DeleteTasksActions.setDeleteTasks(false))
    dispatch(BlurActions.setBlur(false))
    if (authToken && filterEnabler) {
      setFilterEnabler(false)
    }
  }

  return (
    <div className="App" onClick={appClick}>
      <Navbar />
      <Filters filterEnabler={filterEnabler} filterSetterFunction={(data) => setFilterEnabler(data)} />
      <Routes>
        {authToken && <Route path='/' element={<Body filterEnabler={filterEnabler}/>}></Route>}
        {authToken && <Route path='/task_form' element={<TaskForm />}></Route>}
        {!authToken && <Route path='/login_signUp' element={<LoginSignUp />}></Route>}
        <Route path='/error' element={<ErrorPage />}></Route>
        <Route path='*' element={<Navigate replace to='/' />}></Route>
      </Routes>
      <Loading />
      
    </div>

  )
}

export default App;
