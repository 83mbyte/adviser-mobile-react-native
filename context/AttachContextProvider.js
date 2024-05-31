import { createContext, useContext, useMemo, useReducer } from "react";

const AttachsContext = createContext();

export const useAttachContext = () => {
    return useContext(AttachsContext);
}

const initialState = {
    attachmentsArray: [],
    showPickerModal: false,
    showWarningModal: false,
    sendAttachmentsOnly: false
};

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'SHOW-PICKER-MODAL':
            return {
                ...prevState,
                showPickerModal: action.payload
            }
        // case 'SHOW-WARNING-MODAL':
        //     return {
        //         ...prevState,
        //         showWarningModal: action.payload
        //     }
        case 'SEND-ATTACHMENTS-ONLY':
            return {
                ...prevState,
                sendAttachmentsOnly: action.payload
            }

        case 'EMPTY-ATTACHMENT-ARRAY':
            return {
                ...prevState,
                attachmentsArray: []
            }

        case 'ADD-ATTACHMENT':
            return {
                ...prevState,
                attachmentsArray: [...prevState.attachmentsArray, action.payload]
            }

        case 'DELETE-ATTACHMENT':
            let newState = (prevState.attachmentsArray).filter(item => item !== action.payload);
            return {
                ...prevState,
                attachmentsArray: [...newState]
            }

        default:
            return prevState;
    }
}

export const AttachContextProvider = ({ children }) => {

    const [attachState, dispatch] = useReducer(reducer, initialState);

    const attachContextData = useMemo(() => ({
        data: attachState,
        showAttachmentPicker: (value) => {
            dispatch({ type: 'SHOW-PICKER-MODAL', payload: value })
        },
        // showWarningModal: (value) => {
        //     dispatch({ type: 'SHOW-WARNING-MODAL', payload: value })
        // },
        sendAttachmentsOnly: (value) => {
            dispatch({ type: 'SEND-ATTACHMENTS-ONLY', payload: value })
        },
        clearAllItems: () => {
            dispatch({ type: 'EMPTY-ATTACHMENT-ARRAY' })
        },
        addAttachment: (attachment) => {
            dispatch({
                type: 'ADD-ATTACHMENT',
                payload: attachment
            })
        },
        deleteAttachment: (attachment) => {
            dispatch({
                type: 'DELETE-ATTACHMENT',
                payload: attachment
            })
        }

    }), [attachState])

    return (
        <AttachsContext.Provider value={attachContextData}>
            {children}
        </AttachsContext.Provider>
    )
}