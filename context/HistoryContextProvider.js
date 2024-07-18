import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { db } from "../firebaseConfig";
import { get, ref, child, update } from "firebase/database";
import { useAuthContext } from "./AuthContextProvider";
import { fsAPI } from "../lib/fsAPI";

const dbRef = ref(db);
const DB_CHAT_PATH = process.env.EXPO_PUBLIC_DB_CHAT_PATH;
const DB_IMAGE_PATH = process.env.EXPO_PUBLIC_DB_IMAGE_PATH;
const DB_USER_PATH = process.env.EXPO_PUBLIC_DB_USER_PATH;

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

const initialState = {

    chatHistory: {
        currentId: null,
        history: {},
        historyIndexes: {}

    },
    imagesHistory: {
        currentId: null,
        history: {},
        historyIndexes: {}
    }
}

const reducer = (prevState, action) => {
    switch (action.type) {

        case 'GET-HISTORY-INDEXES': {

            return {
                ...prevState,
                ['chatHistory']: {
                    ...prevState['chatHistory'],
                    historyIndexes: action.payload
                }
            }
        }

        case 'SET-CHAT-HISTORY-ID':
            return {
                ...prevState,
                ['chatHistory']: {
                    ...prevState['chatHistory'],
                    currentId: action.payload
                }

            }


        case 'GET-HISTORY-BY-PROVIDED-ID':
            return {
                ...prevState,
                ['chatHistory']: {
                    ...prevState['chatHistory'],
                    ['history']: {
                        ...prevState['chatHistory']['history'],
                        [action.payload.id]: action.payload.data

                    }
                }
            }
        case 'GET-IMAGES-HISTORY-BY-PROVIDED-ID':
            return {
                ...prevState,
                ['imagesHistory']: {
                    ...prevState['imagesHistory'],
                    ['history']: {
                        ...prevState['imagesHistory']['history'],
                        [action.payload.id]: action.payload.data

                    }
                }
            }
        case 'ADD-CHAT-HISTORY-ITEM':

            //check if the current id in the history state
            if (prevState['chatHistory']['history'][action.payload.historyId]) {

                return {
                    ...prevState,
                    chatHistory: {
                        ...prevState.chatHistory,
                        history: {
                            ...prevState.chatHistory.history,
                            [action.payload.historyId]: [
                                ...prevState.chatHistory.history[action.payload.historyId],
                                action.payload.value
                            ]
                        }
                    }
                }
            } else {

                return {
                    ...prevState,
                    chatHistory: {
                        ...prevState.chatHistory,
                        history: {
                            ...prevState.chatHistory.history,
                            [action.payload.historyId]: [action.payload.value]
                        },
                        historyIndexes: {
                            ...prevState.chatHistory.historyIndexes,
                            [action.payload.historyId]: action.payload.value.user.content
                        }
                    }
                }
            }

        case 'DELETE-CHAT-HISTORY-ITEM':

            const { [action.payload]: removedData, ...restDataIndexes } = prevState.chatHistory.historyIndexes;

            if (prevState.chatHistory.history && prevState.chatHistory.history[action.payload]) {
                // remove chat history + indexes from local state
                const { [action.payload]: removedDataHistory, ...restDataHistory } = prevState.chatHistory.history;

                return {
                    ...prevState,
                    chatHistory: {
                        ...prevState['chatHistory'],
                        history: restDataHistory,
                        historyIndexes: restDataIndexes

                    }
                }
            }
            // remove indexes from local state
            return {
                ...prevState,
                ['chatHistory']: {
                    ...prevState['chatHistory'],
                    historyIndexes: restDataIndexes
                }
            }


        // IMAGES related

        case 'GET-IMAGES-HISTORY-INDEXES':
            return {
                ...prevState,
                ['imagesHistory']: {
                    ...prevState['imagesHistory'],
                    historyIndexes: action.payload
                }
            }
        case 'SET-IMAGES-HISTORY-ID':
            return {
                ...prevState,
                ['imagesHistory']: {
                    ...prevState['imagesHistory'],
                    currentId: action.payload
                }
            }
        case 'ADD-IMAGE-TO-HISTORY':

            if (prevState['imagesHistory']['history'][action.payload.historyId]) {
                return {
                    ...prevState,
                    imagesHistory: {
                        ...prevState.imagesHistory,
                        history: {
                            ...prevState.imagesHistory.history,
                            [action.payload.historyId]: [
                                ...prevState.imagesHistory.history[action.payload.historyId],
                                action.payload.value
                            ]
                        }
                    }
                }

            } else {
                return {
                    ...prevState,
                    imagesHistory: {
                        ...prevState.imagesHistory,
                        history: {
                            ...prevState.imagesHistory.history,
                            [action.payload.historyId]: [action.payload.value]
                        },
                        historyIndexes: {
                            ...prevState.imagesHistory.historyIndexes,
                            [action.payload.historyId]: action.payload.value.title
                        }
                    }
                }
            }

        case 'DELETE-IMAGE-ITEM':
            return {
                ...prevState,
                imagesHistory: {
                    ...prevState.imagesHistory,
                    history: {
                        ...prevState.imagesHistory.history,
                        [action.payload.historyId]:
                            (prevState.imagesHistory.history[action.payload.historyId]).filter(
                                (item) => item.source !== action.payload.imageSource
                            )
                    }
                },
                // historyIndexes:{
                //     ...prevState,
                //     [action.payload.historyId]
                // }
            }

        case 'DELETE-IMAGES-HISTORY-ITEM':
            const { [action.payload]: removedImagesData, ...restImagesDataIndexes } = prevState.imagesHistory.historyIndexes;
            if (prevState.imagesHistory.history && prevState.imagesHistory.history[action.payload]) {
                // remove chat history + indexes from local state
                const { [action.payload]: removedImagesDataHistory, ...restImagesDataHistory } = prevState.imagesHistory.history;

                return {
                    ...prevState,
                    imagesHistory: {
                        ...prevState['imagesHistory'],
                        history: restImagesDataHistory,
                        historyIndexes: restImagesDataIndexes

                    }
                }
            }
            // remove indexes from local state
            return {
                ...prevState,
                ['imagesHistory']: {
                    ...prevState['imagesHistory'],
                    historyIndexes: restImagesDataIndexes
                }
            }


        default:
            return prevState
    }

}



const HistoryContextProvider = ({ children }) => {

    const authContextData = useAuthContext();
    let userId = null;
    if (authContextData.data && authContextData.data.user) {

        userId = authContextData.data.user.uid;
    }

    const [historyState, dispatch] = useReducer(reducer, initialState);

    const historyContextData = useMemo(() => ({
        data: historyState,
        setChatHistoryId: (valueId) => {
            if (valueId) {
                // check if 'valueId' exists at local state history, if NOT - request history data with such 'valueId' from server  
                if (historyState.chatHistory.history && !historyState.chatHistory.history[valueId]) {

                    get(child(dbRef, DB_CHAT_PATH + userId + '/' + valueId))
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const server_data = snapshot.val();
                                dispatch({ type: 'GET-HISTORY-BY-PROVIDED-ID', payload: { id: valueId, data: server_data } })
                            } else {
                                console.log("No data available");
                            }
                        });
                }
                dispatch(
                    { type: 'SET-CHAT-HISTORY-ID', payload: valueId }
                )
            } else {
                dispatch(
                    { type: 'SET-CHAT-HISTORY-ID', payload: Date.now() }
                )
            }
        },
        addChatHistoryItem: ({ historyId, data }) => {

            const updates = {};


            // send data to server
            if (historyState.chatHistory.history && historyState.chatHistory.history[historyId]) {
                // if history of current chat exists
                updates[DB_CHAT_PATH + userId + '/' + historyId] = [...historyState.chatHistory.history[historyId], data];

            } else {
                //if no history  
                updates[DB_CHAT_PATH + userId + '/' + historyId] = [data];
                updates[DB_USER_PATH + userId + '/chats'] = { ...historyState.chatHistory.historyIndexes, [historyId]: data.user.content }
            }
            update(dbRef, updates)
                .then(() => {
                    // update local state 
                    dispatch({ type: 'ADD-CHAT-HISTORY-ITEM', payload: { historyId, value: data } });
                })
                .catch((error) => console.log('error while add chat history item ', error));


        },
        deleteChatHistoryItem: (historyId) => {
            const updates = {};

            const { [historyId]: removedData, ...restDataIndexes } = historyState.chatHistory.historyIndexes;

            updates[DB_USER_PATH + userId + '/chats'] = { ...restDataIndexes };
            updates[DB_CHAT_PATH + userId + '/' + historyId] = null;

            update(dbRef, updates)
                .then(() => dispatch({ type: 'DELETE-CHAT-HISTORY-ITEM', payload: historyId }))
                .catch((error) => {
                    //  writing failed...
                    console.log('error while delete chat item')
                });
        },
        setImagesHistoryId: (valueId) => {

            if (valueId) {
                // check if 'valueId' exists at local state history, if NOT - request history data with such 'valueId' from server  
                if (historyState.imagesHistory.history && !historyState.imagesHistory.history[valueId]) {

                    get(child(dbRef, DB_IMAGE_PATH + userId + '/' + valueId))
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const server_data = snapshot.val();
                                dispatch({ type: 'GET-IMAGES-HISTORY-BY-PROVIDED-ID', payload: { id: valueId, data: server_data } })
                            } else {
                                console.log("No data available");
                            }
                        });
                }
                dispatch(
                    { type: 'SET-IMAGES-HISTORY-ID', payload: valueId }
                )
            } else {
                dispatch(
                    { type: 'SET-IMAGES-HISTORY-ID', payload: Date.now() }
                )
            }
        },

        addImagesHistoryItem: ({ historyId, data }) => {

            const updates = {};

            // send data to server
            if (historyState.imagesHistory.history && historyState.imagesHistory.history[historyId]) {
                // if history of current chat exists
                updates[DB_IMAGE_PATH + userId + '/' + historyId] = [...historyState.imagesHistory.history[historyId], data];

            } else {
                //if no history  
                updates[DB_IMAGE_PATH + userId + '/' + historyId] = [data];
                updates[DB_USER_PATH + userId + '/images'] = { ...historyState.imagesHistory.historyIndexes, [historyId]: data.title }
            }
            update(dbRef, updates)
                .then(() => {
                    // update local state 
                    dispatch({ type: 'ADD-IMAGE-TO-HISTORY', payload: { historyId, value: data } });
                })
                .catch((error) => console.log('error while add images history item ', error));
        },

        deleteImageItem: ({ historyId, imageSource }) => {
            const updates = {};
            let newHistory = historyState.imagesHistory.history[historyId].filter(item => item.source !== imageSource);

            updates[DB_IMAGE_PATH + userId + '/' + historyId] = newHistory;
            update(dbRef, updates)
                .then(() => {
                    // remove file from user folder
                    fsAPI.deleteFileInUserFolder(imageSource).then((res) => {
                        if (res.status == 'Success') {
                            dispatch({ type: 'DELETE-IMAGE-ITEM', payload: { historyId, imageSource } })
                        }
                    })
                })
                .catch((error) => {
                    //  delete operation failed...
                    console.log(`Error while delete a single image item: `, error)
                });

        },
        deleteImagesHistoryItem: async (historyId) => {
            const updates = {};
            const { [historyId]: removedData, ...restDataIndexes } = historyState.imagesHistory.historyIndexes;

            updates[DB_USER_PATH + userId + '/images'] = { ...restDataIndexes };
            updates[DB_IMAGE_PATH + userId + '/' + historyId] = null;

            update(dbRef, updates)
                .then(() => {

                    fsAPI.deleteFilesFromAppStorage(historyId)
                        .then(res => {
                            if (res.status == 'Success') {
                                dispatch({ type: 'DELETE-IMAGES-HISTORY-ITEM', payload: historyId })
                            }
                        });
                })
                .catch((error) => {
                    //  writing failed...
                    console.log('Error while delete images history item: ', error)
                });
        }



    }), [historyState]);

    useEffect(() => {
        // dev 
        // if (userId) {

        //     dispatch({ type: 'GET-HISTORY-INDEXES', payload: DATA_TEMPLATE });
        // }
        // dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: { path: 'imagesHistory', data: IMAGE_DATA_TEMPLATE } });

        //PROD
        //
        //get data from online db

        const checkIndexes = async (userId) => {
            await get(child(dbRef, DB_USER_PATH + userId + '/chats'))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const server_data = snapshot.val();
                        dispatch({ type: 'GET-HISTORY-INDEXES', payload: server_data });
                    } else {
                        // console.log("No chats indexes data available");
                    }
                });

            await get(child(dbRef, DB_USER_PATH + userId + '/images'))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const server_data = snapshot.val();
                        dispatch({ type: 'GET-IMAGES-HISTORY-INDEXES', payload: server_data });
                    } else {
                        //  console.log("No images indexes data available");
                    }
                });
        }
        if (userId) {
            checkIndexes(userId)
        }
    }, [userId])

    return (
        <HistoryContext.Provider value={historyContextData}>
            {children}
        </HistoryContext.Provider>
    )
}

export default HistoryContextProvider;


const DATA_TEMPLATE = {
    1711124571105: 'LOCA8L Lorem ipsum dolor, sit amet consectetur adipisicing elit.',

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