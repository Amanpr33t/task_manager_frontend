import { configureStore } from "@reduxjs/toolkit";
import FiltersSlice from "./slices/filters-slice";
import BlurSlice from "./slices/blur_slice";
import LoginSlice from "./slices/login-slice";
import LoadingSlice from "./slices/loading-slice";
import ErrorModalSlice from "./slices/errorModal_slice";
import DeleteTasksSlice from "./slices/deleteTasks";
import QuerySlice from "./slices/query_slice";
import FiltersAppliedSlice from "./slices/filtersApplied-slice";
import ResetCheckboxSlice from "./slices/resetCheckbox-slice";
import TaskDataSlice from "./slices/taskData-slice";
import LogoutClickSlice from "./slices/logoutClick_slice";
import AddTaskSlice from "./slices/addTask-slice";
import EditSlice from "./slices/edit-slice";

const store = configureStore({
  reducer: {
    Filters: FiltersSlice.reducer,
    Blur: BlurSlice.reducer,
    Login: LoginSlice.reducer,
    Loading: LoadingSlice.reducer,
    ErrorModal: ErrorModalSlice.reducer,
    DeleteTasks: DeleteTasksSlice.reducer,
    Query: QuerySlice.reducer,
    FiltersApplied: FiltersAppliedSlice.reducer,
    ResetCheckbox: ResetCheckboxSlice.reducer,
    TaskData: TaskDataSlice.reducer,
    LogoutClick: LogoutClickSlice.reducer,
    AddTask: AddTaskSlice.reducer,
    Edit: EditSlice.reducer
  }
})

export default store