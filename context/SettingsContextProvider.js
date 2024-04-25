import { createContext, useContext, useMemo, useReducer } from "react";

import { imageSettingsDescription, chatSettingsDescription } from "../lib/textData";

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

const initialState = {

    chatSettings: {
        systemVersion: chatSettingsDescription.systemVersion[1].value,
        replyLength: chatSettingsDescription.replyLength[1].value,
        replyStyle: chatSettingsDescription.replyStyle[1].value,
        replyTone: chatSettingsDescription.replyTone[1].value,
        replyFormat: chatSettingsDescription.replyFormat[1].value,
        replyCount: 1
    },
    imageSettings: {
        size: imageSettingsDescription.imageSize[1].value,
        style: imageSettingsDescription.imageStyle[1].value,
        quality: imageSettingsDescription.imageQuality[1].value
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
                    replyCount: action.payload
                }
            }
        case 'SET_IMAGE_SIZE':
            return {
                ...prevState,
                imageSettings: {
                    ...prevState.imageSettings,
                    size: action.payload
                }
            }
        case 'SET_IMAGE_STYLE':
            return {
                ...prevState,
                imageSettings: {
                    ...prevState.imageSettings,
                    style: action.payload
                }
            }
        case 'SET_IMAGE_QUALITY':
            return {
                ...prevState,
                imageSettings: {
                    ...prevState.imageSettings,
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
        setChatSettings: (data) => {
            dispatch({
                type: data.type,
                payload: data.value
            })
        },
        setImageSettings: (data) => {
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