import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {Array.isArray(toasts) &&
        toasts.map((toast) => {
          if (!toast) return null;

          return (
            <Toast key={toast.id ?? Math.random()} {...toast}>
              <div className="grid gap-1">
                {toast?.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
                {toast?.description ? (
                  <ToastDescription>{toast.description}</ToastDescription>
                ) : null}
              </div>
              {toast?.action}
              <ToastClose />
            </Toast>
          );
        })}
      <ToastViewport />
    </ToastProvider>
  );
}
