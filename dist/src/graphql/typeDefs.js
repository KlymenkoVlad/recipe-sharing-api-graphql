export const gql = String.raw;
export default gql `
  type Recipe {
    name: String
    description: String
    createdAt: String
    thumbsUp: Int
    thumbsDown: Int
  }

  type User {
    id: ID
    name: String
    username: String
    createdAt: String
    updatedAt: String
    token: String
  }

  input RecipeInput {
    name: String!
    description: String!
  }

  input RegisterUserInput {
    name: String
    username: String!
    password: String!
  }

  input LoginUserInput {
    username: String!
    password: String!
  }

  type Query {
    recipe(ID: ID!): Recipe!
    getRecipes(amount: Int): [Recipe]
  }

  type Mutation {
    createRecipe(recipeInput: RecipeInput): Recipe!
    deleteRecipe(ID: ID!): Boolean
    editRecipe(ID: ID!, recipeInput: RecipeInput): Boolean

    register(registerUserInput: RegisterUserInput): User
    login(loginUserInput: LoginUserInput): User
  }
`;
