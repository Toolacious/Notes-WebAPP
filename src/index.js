import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ApolloClient, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink, Observable } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { AuthProvider } from "./routes/auth";
import { setAccessToken, getAccessToken } from "./accessToken";

// Create an http link:
const httpLink = new HttpLink({
    uri: "http://localhost:4000/",
    credentials: "include",
});

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable((observer) => {
            let handle;
            Promise.resolve(operation)
                .then((operation) => {
                    const accessToken = getAccessToken();
                    console.log("request----" + accessToken);
                    if (accessToken) {
                        console.log("set header");
                        operation.setContext({
                            headers: {
                                authorization: `bearer ${accessToken}`,
                            },
                        });
                    } else console.log("no access token");
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) handle.unsubscribe();
            };
        })
);

const RefreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        console.log("Refresh----" + token);
        if (!token) {
            console.log("no found_refresh");
            return true;
        }

        try {
            const { exp, userId } = jwtDecode(token);
            if (userId) {
            }
            if (Date.now() >= exp * 1000) {
                return false;
            } else {
                return true;
            }
        } catch {
            return false;
        }
    },
    fetchAccessToken: () => {
        return fetch("http://localhost:4000/refresh_token", {
            method: "POST",
            credentials: "include",
        });
    },
    handleFetch: (accessToken) => {
        console.log("access token seting");
        console.log(accessToken);
        setAccessToken(accessToken);
    },
    handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
    },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors);
    console.log(networkError);
});

const client = new ApolloClient({
    link: ApolloLink.from([RefreshLink, errorLink, requestLink, httpLink]),
    cache: new InMemoryCache().restore({}),
});

const wrappedApp = (
    <ApolloProvider client={client}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ApolloProvider>
);

ReactDOM.render(wrappedApp, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
