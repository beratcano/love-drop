import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { View } from "react-native";
import Toast, { ToastType } from "../components/Toast";

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("info");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = useCallback((msg: string, toastType: ToastType = "info", duration = 3000) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setMessage(msg);
        setType(toastType);
        setVisible(true);

        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, duration);
    }, []);

    const hideToast = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            <View style={{ flex: 1 }}>
                {children}
                {visible && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            elevation: 9999
                        }}
                        pointerEvents="box-none"
                    >
                        <Toast
                            message={message}
                            type={type}
                            onDismiss={hideToast}
                        />
                    </View>
                )}
            </View>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
