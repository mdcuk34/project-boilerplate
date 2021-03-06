import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import { constructTestServer } from './test-utils';
// the mocked REST API data
import { mockUserResponse } from '../data-sources/mock-users';

const GET_USERS = gql`
  query userList {
    users {
      id
      firstName
      lastName
      emailAddress
      country
      signUpDate
    }
  }
`;

describe('Queries', () => {
  it('fetches list of users', async () => {
    // create an instance of ApolloServer that mocks out context, while reusing
    // existing dataSources, resolvers, and typeDefs.
    // This function returns the server instance as well as our dataSource
    // instances, so we can overwrite the underlying fetchers
    const { server, userAPI } = constructTestServer();

    // mock the datasources' underlying fetch methods, whether that's a REST
    // lookup in the RESTDataSource or the store query in the Sequelize datasource
    // @ts-ignore
    userAPI.get = jest.fn(() => ({ items: [mockUserResponse] }));

    // use our test server as input to the createTestClient fn
    // This will give us an interface, similar to apolloClient.query
    // to run queries against our instance of ApolloServer
    const { query } = createTestClient(server);
    const res = await query({ query: GET_USERS });
    expect(res).toMatchSnapshot();
  });
});
