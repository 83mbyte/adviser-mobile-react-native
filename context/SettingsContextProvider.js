import { createContext, useContext, useMemo, useReducer } from "react";


const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

const initialState = {

    chatSettings: {
        systemVersion: '4',
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual',
        replyFormat: 'Plain text',
        replyCount: false
    },
    imagesSettings: {
        size: 'A',
        style: 'vivid',
        quality: 'standard'
    }

}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'SET_SYSTEM_VERSION':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    systemVersion: action.payload
                }
            }
        case 'SET_REPLY_LENGTH':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    replyLength: action.payload
                }
            }
        case 'SET_REPLY_STYLE':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    replyStyle: action.payload
                }
            }
        case 'SET_REPLY_TONE':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    replyTone: action.payload
                }
            }
        case 'SET_REPLY_FORMAT':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    replyFormat: action.payload
                }
            }
        case 'SET_REPLY_COUNT':
            return {
                ...prevState,
                chatSettings: {
                    ...prevState.chatSettings,
                    replyCount: !prevState.chatSettings.replyCount
                }
            }
        case 'SET_IMAGE_SIZE':
            return {
                ...prevState,
                imagesSettings: {
                    ...prevState.imagesSettings,
                    size: action.payload
                }
            }
        case 'SET_IMAGE_STYLE':
            return {
                ...prevState,
                imagesSettings: {
                    ...prevState.imagesSettings,
                    style: action.payload
                }
            }
        case 'SET_IMAGE_QUALITY':
            return {
                ...prevState,
                imagesSettings: {
                    ...prevState.imagesSettings,
                    quality: action.payload
                }
            }
        default:
            break;
    }
}


const SettingsContextProvider = ({ children }) => {

    const [settingsState, dispatch] = useReducer(reducer, initialState);

    const settingsContextData = useMemo(() => ({
        data: settingsState,

        setSettings: (data) => {
            dispatch({
                type: data.type,
                payload: data.value
            })
        }

    }), [settingsState]);

    return (
        <SettingsContext.Provider value={settingsContextData}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;