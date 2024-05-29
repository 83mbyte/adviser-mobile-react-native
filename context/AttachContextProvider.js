import { createContext, useContext, useMemo, useReducer } from "react";

const AttachsContext = createContext();

export const useAttachContext = () => {
    return useContext(AttachsContext);
}

const initialState = {
    attachmentsArray: [],
    showModal: false
};

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'TOGGLE-MODAL':
            return {
                ...prevState,
                showModal: action.payload
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
            dispatch({ type: 'TOGGLE-MODAL', payload: value })
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