import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";

export const authAPI = {
    signOut: async () => {
        const auth = getAuth(app);
        return await signOut(auth).then(() => {
            console.log('SignOut done')
            // Sign-out successful.
            return ({ status: 'Success' })
        }).catch((error) => {
            // An error happened.
            return ({ status: 'Error' })
        });
    },

    signUp: async (email, password) => {
        const auth = getAuth(app);
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;

                // ...
                return {
                    status: 'Success', payload: {
                        user: {
                            email: user.email,
                            isEmailVerified: user.emailVerified,
                            uid: user.uid,
                            accessToken: user.accessToken,
                            displayName: user.displayName
                        }
                    }
                };
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // .. 
                return ({ status: 'Error', errorCode, errorMessage })
            });
    },

    signIn: async (email, password) => {
        const auth = getAuth(app);
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                return {
                    status: 'Success', payload: {
                        user: {
                            email: user.email,
                            isEmailVerified: user.emailVerified,
                            uid: user.uid,
                            accessToken: user.accessToken,
                            displayName: user.displayName
                        }
                    }
                };
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return ({ status: 'Error', errorCode, errorMessage })
            });
    }

}
