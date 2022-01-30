import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { Grid, Transition } from 'semantic-ui-react'

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
    const{ user } = useContext(AuthContext);
    const { data, loading, error } = useQuery(FETCH_POSTS_QUERY);

    if(data) {
        console.log(data);
    }
    if(error) {
        console.log(error);
        return "error"; // blocks rendering
    }

    return (
        <Grid columns={3} >
            <Grid.Row className='page-title' >
                <h1>Recent posts</h1>
            </Grid.Row>
            <Grid.Row>
            {user && (
               <Grid.Column>
                   <PostForm />
               </Grid.Column> 
            )}
            
                {loading ? (
                    <h1>Loading posts..</h1>
                    ) : (
                    <Transition.Group>
                        {
                        data && data.getPosts.map(post => (
                            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                        }
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}



export default Home;