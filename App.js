import React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${'ADD_YOUR_GITHUB_TOKEN'}`,
  },
});

function App() {
  const [repos, setRepos] = React.useState([]);

  React.useEffect(() => {
    client
      .query({
        query: gql`
          {
            search(query: "stars:>1 language:JavaScript,typescript", type: REPOSITORY, first: 10, after: null) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                    nameWithOwner
                    stargazerCount
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
      })
      .then((result) => {
        setRepos(result.data.search.edges);
      });
  }, []);

  return (
    <div>
      <h1>Top 10 Starred Repositories for JavaScript and TypeScript Combined</h1>
      <ul>
        {repos.map((repo, index) => (
          <li key={index}>
            <a href={`https://github.com/${repo.node.nameWithOwner}`}>
              {repo.node.nameWithOwner} ({repo.node.stargazerCount} stars)
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
