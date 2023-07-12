import { LoginActions } from "../store/slices/login-slice";
import { useNavigate } from "react-router-dom";
import { BlurActions } from "../store/slices/blur_slice";
import { DeleteTasksActions } from "../store/slices/deleteTasks";
import { ErrorModalActions } from "../store/slices/errorModal_slice";
import { FiltersActions } from "../store/slices/filters-slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { LoadingActions } from "../store/slices/loading-slice";
import { LoginActions } from "../store/slices/login-slice";
import { QueryActions } from "../store/slices/query_slice";
import { ResetCheckboxActions } from "../store/slices/resetCheckbox-slice";
import { TaskDataActions } from "../store/slices/taskData-slice";
import { useDispatch } from "react-redux";

const useLogoutReset=()=>{

    
    return{
        
    }

}
export default useLogoutReset