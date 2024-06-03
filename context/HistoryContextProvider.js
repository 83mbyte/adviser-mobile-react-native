import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { db } from "../firebaseConfig";
import { get, onValue, ref, child } from "firebase/database";
import { useAuthContext } from "./AuthContextProvider";

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

const initialState = {

    chatHistory: {
        currentId: null,
        history: {}
    },
    imagesHistory: {
        currentId: null,
        history: {}
    }
}


const reducer = (prevState, action) => {
    switch (action.type) {
        case 'ADD_HISTORY_FROM_SERVER':
            return {
                ...prevState,
                [action.payload.path]: {
                    ...prevState[action.payload.path],
                    history: action.payload.data
                }
            }

        case 'SET_HISTORY_ID':

            return {
                ...prevState,
                [action.payload.path]: {
                    ...prevState[action.payload.path],
                    currentId: action.payload.key
                }
            }
        case 'DELETE_HISTORY_ITEM':
            const { [action.payload.key]: removedData, ...restData } = prevState[action.payload.path]['history'];
            return {
                ...prevState,
                [action.payload.path]: {
                    ...prevState[action.payload.path],
                    history: restData
                }
            }
        case 'ADD_HISTORY_ITEM':

            // add item to the history state if the historyID already exists in the state
            if ((prevState[action.payload.path]) && prevState[action.payload.path]['history'][action.payload.historyId]) {

                return {
                    ...prevState,
                    [action.payload.path]: {
                        ...prevState[action.payload.path],
                        history: {
                            ...prevState[action.payload.path]['history'],

                            [action.payload.historyId]: [
                                ...prevState[action.payload.path]['history'][action.payload.historyId],
                                action.payload.value
                            ]
                        }
                    }
                }

            }
            return {
                ...prevState,
                [action.payload.path]: {
                    ...prevState[action.payload.path],
                    history: {
                        ...prevState[action.payload.path]['history'],
                        [action.payload.historyId]: [
                            action.payload.value
                        ]
                    }

                }
            }

        case 'DELETE_IMAGE':

            return {
                ...prevState,
                imagesHistory: {
                    ...prevState.imagesHistory,
                    history: {
                        ...prevState.imagesHistory.history,
                        [action.payload.key]:
                            (prevState.imagesHistory.history[action.payload.key]).filter(
                                (item) => item.source !== action.payload.imageSource
                            )
                    }
                }
            }

        default:
            return { ...prevState }
    }

}

const HistoryContextProvider = ({ children }) => {
    const userId = useAuthContext().data.user.uid;

    const [historyState, dispatch] = useReducer(reducer, initialState);

    const historyContextData = useMemo(() => ({
        data: historyState,

        setHistoryId: ({ path, key }) => {
            if (path && key) {
                dispatch(
                    { type: 'SET_HISTORY_ID', payload: { path, key } }
                )
            } else {
                dispatch(
                    { type: 'SET_HISTORY_ID', payload: { path, key: Date.now() } }
                )
            }
        },
        deleteHistoryItem: ({ path, key }) => {
            dispatch({
                type: 'DELETE_HISTORY_ITEM',
                payload: { path, key }
            })
        },
        addHistoryItem: ({ path, historyId, value }) => {
            dispatch({
                type: 'ADD_HISTORY_ITEM',
                payload: { path, historyId, value }
            })
        },
        deleteImageFromHistory: ({ key, imageSource }) => {
            dispatch({
                type: 'DELETE_IMAGE',
                payload: { key, imageSource }
            })
        }
    }), [historyState]);

    useEffect(() => {
        // dev 
        dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: { path: 'chatHistory', data: DATA_TEMPLATE } });
        // dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: { path: 'imagesHistory', data: IMAGE_DATA_TEMPLATE } });

        //PROD
        // const dbRef = ref(db);
        // //get data from online db
        // get(child(dbRef, process.env.EXPO_PUBLIC_DB_USER_PATH + userId + '/chats'))
        //     .then(snapshot => {
        //         if (snapshot.exists()) {
        //             const server_data = snapshot.val();
        //             dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: { path: 'chatHistory', data: server_data } });
        //         } else {
        //             console.log("No data available");
        //         }
        //     });
    }, [])

    return (
        <HistoryContext.Provider value={historyContextData}>
            {children}
        </HistoryContext.Provider>
    )
}

export default HistoryContextProvider;


const DATA_TEMPLATE = {
    1711124571105: 'LOCAL Lorem ipsum dolor, sit amet consectetur adipisicing elit.',

}

const IMAGE_DATA_TEMPLATE = {
    123: [
        {
            id: '1a',
            title: 'Ferrari',
            source: 'https://i.pinimg.com/originals/fa/db/86/fadb8609df556d0f99bb815793cfa8ea.jpg'
        },
        {
            id: '2a',
            title: 'Chevrolet',
            source: 'https://f.vividscreen.info/soft/ef13d4cf09d3a0e0474200e427c803ed/Chevrolet-Camaro-Legendary-American-Car-square-l.jpg'
        },
        {
            id: '3a',
            title: 'abc',
            source: 'https://pics.craiyon.com/2023-09-05/5d01fa50476544a3aa6f8e84d965b8ad.webp'
        },
        {
            id: '4a',
            title: 'mers',
            source: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?cs=srgb&dl=pexels-mikebirdy-120049.jpg&fm=jpg'
        },
        {
            id: '5a',
            title: 'unknown',
            source: 'https://wallpapercave.com/wp/wp4471394.jpg'
        },
        {
            id: '6a',
            title: 'unknown_2',
            source: 'https://www.shutterstock.com/image-photo/oil-painting-beautiful-natural-landscape-260nw-2442446671.jpg'
        },
    ]
}