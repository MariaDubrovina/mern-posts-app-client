import App from './App';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from "@apollo/client";
import { setContext } from "apollo-link-context";
 

const httpLink = createHttpLink({
    //uri: 'http://localhost:5000'
    uri: 'https://merng-posts-app.herokuapp.com/'
})

const setAuthorizationLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');

    return {
        headers: {Authorization: token ? `Bearer ${token}` : '' }
    };
});

const client = new ApolloClient({
    link: setAuthorizationLink.concat(httpLink),
    cache: new InMemoryCache()
})


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)