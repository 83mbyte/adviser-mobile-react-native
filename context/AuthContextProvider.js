import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Text } from "react-native";
import { authAPI } from "../lib/authAPI";



const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext)
}
const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null
}
const reducer = (prevState, action) => {
    switch (action.type) {

        case 'SIGN_IN':
            console.log('SIGN_IN')
            return {
                ...prevState,
                isSignout: false,
                isLoading: false,
                user: action.payload.user
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                isSignout: true,
                isLoading: false,
                user: null
            };
        case 'RESTORE_TOKEN':
            console.log('RESTORE_TOKEN');
            return {
                ...prevState,

                isLoading: false,
                isSignout: false,
                user: action.payload.user
            };
        case 'NOT_LOGGED':
            console.log('NOT_LOGGED')
            return {
                ...prevState,
                isSignout: true,
                isLoading: false,
                user: null
            }
        default:
            return { ...prevState }
    }
}

export const AuthContextProvider = ({ children }) => {
    const auth = getAuth(app);

    const [authState, dispatch] = useReducer(reducer, initialState);

    const authContextData = useMemo(() => ({
        data: authState,

        signIn: async (email, password) => {

            let res = await authAPI.signIn(email, password);
            if (res && res.status == 'Success') {
                dispatch({
                    type: 'SIGN_IN',
                    payload: {
                        user: { ...res.payload.user }
                    }
                })
                return { status: 'Success' }
            } else {
                console.log('Error while Sign In',);
                dispatch({ type: 'NOT_LOGGED' })
                //TODO 
                //TODO  something like a toast to show error message
                //TODO 
            }
        },

        signOut: async () => {
            let res = await authAPI.signOut();
            if (res && res.status == 'Success') {
                dispatch({ type: 'SIGN_OUT' })
            } else {
                console.log('error while Sign Out');
                // TODO
                // TODO something like a toast to show error message
                // TODO
            }
        },

        signUp: async (email, password) => {


            let res = await authAPI.signUp(email, password);
            if (res && res.status == 'Success') {
                dispatch({
                    type: 'SIGN_IN',
                    payload: {
                        user: { ...res.payload.user }
                    }
                })
            } else {
                console.log('error while Sign Up');
                dispatch({ type: 'NOT_LOGGED' });
                // TODO
                // TODO something like a toast to show error message
                // TODO
            }

        }

    }), [authState]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            // prod mode If
            // if (user && user.emailVerified === true ) {

            // dev mode IF
            // if (user && user.emailVerified === true || (user && user.email === process.env.NEXT_PUBLIC_DEV_EMAIL)) {
            if (user) {
                dispatch({
                    type: 'RESTORE_TOKEN',
                    payload: {
                        user:
                        {
                            email: user.email,
                            isEmailVerified: user.emailVerified,
                            uid: user.uid,
                            accessToken: user.accessToken,
                            displayName: user.displayName
                        }
                    }
                })

            } else {
                dispatch({ type: 'NOT_LOGGED' })
            }
        })

        return () => {
            unsubscribe();
        };
    }, [])

    return (
        <AuthContext.Provider value={authContextData}>
            {
                authState.isLoading == true
                    ? <Text style={{ paddingTop: 200 }}>Please wait...</Text>
                    : children
            }
        </AuthContext.Provider >
    )
}
