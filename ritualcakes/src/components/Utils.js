import { toast } from "react-toastify";

// Success toast
export const handleSuccess = (msg) => {
  toast.success(msg, { position: "top-right" });
};

// Error toast
export const handleError = (msg) => {
  toast.error(msg, { position: "top-right" });
};
