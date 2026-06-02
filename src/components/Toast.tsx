interface ToastProps {
  message: string;
}

function Toast({ message }: ToastProps) {
  return <div className={`toast ${message ? 'toast-visible' : ''}`}>{message}</div>;
}

export default Toast;
