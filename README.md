# cis400

## Use Yarn!!

`yarn add` to add libraries

`yarn install` to install dependencies

### Resolving yarn lock merge conflicts

<<<<<<< HEAD
Refer to [this](https://github.com/yarnpkg/yarn/issues/1776#issuecomment-269539948) discussion.
=======
Refer to (this)[https://github.com/yarnpkg/yarn/issues/1776#issuecomment-269539948] discussion.
>>>>>>> dc031682efc6e93c2aeb65952efcbe1209ac8ff8

### How to format everything if you aren't passing a format check

In /api: `yarn run formatAll`

In /mobile: `yarn run formatAll`
<<<<<<< HEAD

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
=======
>>>>>>> dc031682efc6e93c2aeb65952efcbe1209ac8ff8
