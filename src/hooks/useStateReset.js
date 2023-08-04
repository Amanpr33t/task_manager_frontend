
import { LoadingActions } from "../store/slices/loading-slice";
import { BlurActions } from "../store/slices/blur_slice";
import { DeleteTasksActions } from "../store/slices/deleteTasks";
import { FiltersActions } from "../store/slices/filters-slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { QueryActions } from "../store/slices/query_slice";
import { ResetCheckboxActions } from "../store/slices/resetCheckbox-slice";
import { TaskDataActions } from "../store/slices/taskData-slice";
import { AddTaskActions } from "../store/slices/addTask-slice";
import { useDispatch } from "react-redux";
import { EditActions } from "../store/slices/edit-slice";

const useStateReset = () => {
    const dispatch = useDispatch()
    const stateReset = () => {
        dispatch(AddTaskActions.setAddTask(false))
        dispatch(BlurActions.setBlur(false))
        dispatch(DeleteTasksActions.setDeleteTasks(false))
        dispatch(FiltersActions.setFilters({
            sort: null,
            year: null,
            month: null,
            date: null,
            status: null
        }))
        dispatch(FiltersAppliedActions.setFiltersApplied(false))
        dispatch(LoadingActions.setLoading(false))
        dispatch(QueryActions.setQuery(''))
        dispatch(ResetCheckboxActions.setResetCheckbox(false))
        dispatch(TaskDataActions.setTaskData(false))
        dispatch(EditActions.setEdit({
            isEdit: false,
            content: null,
            completionDate: null,
            taskId: null
        }))
    }
    return {
        stateReset
    }
}
export default useStateReset