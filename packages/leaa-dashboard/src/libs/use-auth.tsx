import React, { useState, useEffect, useContext, createContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { apolloClient } from '@leaa/dashboard/src/libs/apollo-client.lib';
import { HASURA_GET_USER } from '@leaa/dashboard/src/graphqls/user.query';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';
import config from '../../config';
import { authUtil } from '../utils/auth.util';

// Add your Firebase credentials
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
}

const authContext = createContext();
const AuthProvider = authContext.Provider;
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

const getUser = id =>
  apolloClient
    .query<any>({
      query: HASURA_GET_USER,
      variables: { id },
      fetchPolicy: 'network-only',
    })
    .then(({ data }) => {
      return data;
    });

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const [userInfo, setUserInfo] = useState<IAuthInfo>(authUtil.getAuthInfo());
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = email => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async firebaseUser => {
      let token = '';
      let idTokenResult = null;
      if (firebaseUser) {
        try {
          token = await firebaseUser.getIdToken(true);
          idTokenResult = await firebaseUser.getIdTokenResult();
          const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims'];
          if (hasuraClaim) {
            setUser(firebaseUser);
            authUtil.setAuthToken(token);
          } else {
            const metadataRef = firebase.database().ref(`metadata/${firebaseUser.uid}/refreshTime`);
            metadataRef.on('value', async data => {
              // if (!data.exists) return;
              // Force refresh to pick up the latest custom claims changes.
              token = await firebaseUser.getIdToken(true);
              idTokenResult = await firebaseUser.getIdTokenResult();
              authUtil.setAuthToken(token);
              setUser(firebaseUser);
            });
          }
          const fetchUserInfo = await getUser(firebaseUser.uid);
          setUserInfo(fetchUserInfo);
        } catch (err) {
          console.log(err);
        }
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userInfo) {
      authUtil.setAuthInfo(userInfo);
    }
  }, [userInfo]);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthProvider value={auth}>{children}</AuthProvider>;
}
