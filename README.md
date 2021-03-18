# cis400

## Use Yarn!!

`yarn add` to add libraries

`yarn install` to install dependencies

### Resolving yarn lock merge conflicts

Refer to [this](https://github.com/yarnpkg/yarn/issues/1776#issuecomment-269539948) discussion.

### How to format everything if you aren't passing a format check

In /api: `yarn run formatAll`

In /mobile: `yarn run formatAll`

### Reset the database

`yarn run resetDb`

### Routes

For all routes created, ensure authorizaiton of user via authmiddleware. For Example:

```ts
{
  eventRouter.post("/", [auth], async (req: Request, res: Response) => {
    ....
    // [auth] function puts the user id in the req, it can be accessed via:
    const id = (req as AuthRequest).user.id;

  }
}
```

### Loading in the Google Maps API Key on DEV

1. Get the API KEY from Ally
2. Create a file called .env in the api folder. Put the key in it as GOOGLE_MAPS_API_KEY=PastedKey
3. Run source .env to load in your api variables in the api folder
4. Then be happy :)

## Deploying Wigo

### Mobile

Our app is distributed for development through Expo.
In order to publish a release to expo, follow [these](https://docs.expo.io/workflow/publishing/) instructions.

## API

The API is deployed on Heroku. Deployment is handled through git. [Here's](https://devcenter.heroku.com/articles/git) a guide on how to deploy to Heroku using git.

The gist of it is that when you are ready to deploy, make sure that your changes are all committed (ie: git status returns "all up to date").
Change into the root WiGo folder and execute this command:

```sh
git subtree push --prefix api heroku master
```

We are pushing just the api folder to Heroku, since that is where the package.json and the code for the api lies. You should see a series of steps being executed
in order to prepare the code for production.
`
