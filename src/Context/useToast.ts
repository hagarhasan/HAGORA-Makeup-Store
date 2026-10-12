import { useContext } from "react";
import { ToastContext, type ToastContextType } from "./toastContextStore";

export function useToast(): ToastContextType {
    return useContext(ToastContext);
}
