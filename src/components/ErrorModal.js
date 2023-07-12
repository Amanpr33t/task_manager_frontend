import React from "react";
import './ErrorModal.css'
import { useDispatch, useSelector } from "react-redux";
import { ErrorModalActions } from "../store/slices/errorModal_slice";
import { BlurActions } from "../store/slices/blur_slice";
function ErrorModal() {
    const dispatch = useDispatch()
    const { isErrorModal, message } = useSelector(state => state.ErrorModal)

    return (
        <React.Fragment>
            {isErrorModal && <div className="error_modal_container" onClick={(e) => e.stopPropagation()}>
                <div className="error_modal">
                    <div onClick={() => {
                        dispatch(ErrorModalActions.setErrorModal({
                            isErrorModal: true,
                            message: 'User credentials are incorrect. Please try again.'
                        }))
                        dispatch(BlurActions.setBlur(false))
                    }}>X</div>
                    <p>{message}</p>
                </div>
            </div>}
        </React.Fragment>
    )
}
export default ErrorModal