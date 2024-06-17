import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { db } from "../firebaseConfig";
import { get, ref, child, update } from "firebase/database";
import { useAuthContext } from "./AuthContextProvider";

const dbRef = ref(db);
const DB_USER_PATH = process.env.EXPO_PUBLIC_DB_USER_PATH;

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

const initialState = {

    chatSettings: {
        systemVersion: 'GPT-3.5',
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual',
        replyFormat: 'HTML',
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
        case 'SET_SETTINGS_FROM_SERVER':
            return {
                ...prevState,
                ...action.payload
            }
        default:
            break;
    }
}


const SettingsContextProvider = ({ children }) => {
    const authContextData = useAuthContext();
    let userId = null;
    if (authContextData.data && authContextData.data.user) {

        userId = authContextData.data.user.uid;
    };

    const [settingsState, dispatch] = useReducer(reducer, initialState);

    const settingsContextData = useMemo(() => ({
        data: settingsState,

        setSettings: (data) => {


            dispatch({
                type: data.type,
                payload: data.value
            })
        },

        updateSettingsOnServer: (settingsPath, data) => {

            const updates = {};
            if (settingsPath && userId) {
                try {
                    updates[DB_USER_PATH + userId + '/settings/' + settingsPath] = { ...settingsState[settingsPath], ...data };
                    update(dbRef, updates);
                } catch (error) {
                    console.log('error while update settings on server..', error.message)

                }
            }
        },
        getSettingsFromServer: () => { }

    }), [settingsState]);

    useEffect(() => {

        //get data from online db
        if (userId) {
            get(child(dbRef, DB_USER_PATH + userId + '/settings'))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const server_data = snapshot.val();
                        dispatch({ type: 'SET_SETTINGS_FROM_SERVER', payload: server_data });
                    } else {
                        console.log("No data available");
                    }
                });
        }
    }, [userId])

    return (
        <SettingsContext.Provider value={settingsContextData}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;