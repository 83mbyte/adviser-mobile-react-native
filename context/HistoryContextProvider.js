import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

const initialState = {

    chatHistory: {
        currentId: null,
        history: {}
    },
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'ADD_HISTORY_FROM_SERVER':
            return {
                ...prevState,
                chatHistory: {
                    ...prevState.chatHistory,
                    history: {
                        ...action.payload
                    }
                }
            }

        case 'SET_HISTORY_ID':
            return {
                ...prevState,
                chatHistory: {
                    ...prevState.chatHistory,
                    currentId: action.payload
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
            console.log('ADD_HISTORY_ITEM', action.payload);

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

        default:
            return { ...prevState }
    }

}

const HistoryContextProvider = ({ children }) => {

    const [historyState, dispatch] = useReducer(reducer, initialState);

    const historyContextData = useMemo(() => ({
        data: historyState,

        setHistoryId: (value) => {
            if (value) {
                dispatch(
                    { type: 'SET_HISTORY_ID', payload: value }
                )
            } else {

                dispatch(
                    { type: 'SET_HISTORY_ID', payload: Date.now() }
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
        }
    }), [historyState]);

    useEffect(() => {
        // dev 
        dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: DATA_TEMPLATE });

        //PROD
        // get data from server
        //
        // let serverData = fetch(...);
        // if (serverData){
        //     dispatch({ type: 'ADD_HISTORY_FROM_SERVER', payload: serverData });
        // }
    }, [])

    return (
        <HistoryContext.Provider value={historyContextData}>
            {children}
        </HistoryContext.Provider>
    )
}

export default HistoryContextProvider;


const DATA_TEMPLATE = {
    123: [
        { assistant: { content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', format: 'Plain text' }, user: { content: 'Officiis in perferendis tempore fugit.' } },

        { assistant: { content: 'Accusantium neque fugiat possimus eligendi, quae adipisci animi consequatur aliquam dolorum in excepturi iste deleniti magnam quis praesentium dignissimos ullam impedit necessitatibus eos! Sed in aspernatur quisquam inventore ipsam, tempore harum ex! Culpa consectetur amet ipsum modi doloribus ratione harum laboriosam, fugit quisquam accusantium dignissimos doloremque eligendi sint, dolorem ut voluptatibus nemo itaque excepturi exercitationem vel quod accusamus soluta aliquid?', format: 'Plain text' }, user: { content: 'Libero facere ipsam quasi dolor eius doloribus' } },

    ],
    222: [
        {
            assistant: { content: 'Provident hic quae ullam similique aspernatur sunt incidunt, dolores veritatis aliquid dolorem dolore minima quam, ratione aut ea fugit recusandae illum distinctio, aperiam repudiandae fugiat consequatur! Laboriosam ipsum deserunt dolorum possimus, nesciunt placeat quibusdam dolore corrupti hic, vitae sequi obcaecati incidunt facilis sint natus illo. Sunt, laboriosam ducimus illum accusantium excepturi sapiente tenetur obcaecati.', format: 'Plain text' }, user: { content: 'Nisi, aspernatur! Hic accusamus voluptatem, est delectus explicabo unde doloremque! Rerum iste facere assumenda beatae perspiciatis?' }
        }
    ]
}