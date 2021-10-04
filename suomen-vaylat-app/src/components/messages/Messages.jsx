import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const delayMs = 5000;

export const ShowInfo = (message) => {
    toast.info(message, {
        position: "top-right",
        autoClose: delayMs,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
};

export const ShowSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: delayMs,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
};

export const ShowWarning = (message) => {
    // toast.warn(message, {
    //     position: "top-right",
    //     autoClose: delayMs,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     });
};

export const ShowError = (message) => {
    console.log("message showerror ", message);

    // toast.error(message, {
    //     position: "top-right",
    //     autoClose: delayMs,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     });
    // <Notification>
    // </Notification>
};