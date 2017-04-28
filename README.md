# Challenge: Gatekeeper middleware

This is a challenge in Thinkful's *Web Development Bootcamp*.

You need to create a piece of middleware that parses request for a header with the name `x-username-and-password`. The value for that header should looke like this: `user=user@somewhere.com&pass=password`.

The middleware will need to parse the value for this request header, and then attempt to find a user object for the user with that username and password. If the user is located, its object should be added to the request as `req.user`. If not, `req.user` will be undefined.

This app has a single endpoint, `/api/users/me`, which is meant to return the first name, last name, user name, id, and position (aka job title) of an authenticated user. Your middleware will support that endpoint, which looks like this:

```javascript

app.get("/api/users/me", (req, res) => {
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});
```

In order to parse the request header, you will need to use the `query-string` package, which  we've already added as a dependency for this app.

`query-string`'s `.parse` method allows us to turn a string that looks like this: `key1=val1&key2=val2&key3=val3` into:

```javascript
{
    key1: 'val1',
    key2: 'val2',
    key3: 'val3'
}
```

So in your middlware, you'll need to use it to get an object with the `user` and `pass` from the request header `x-username-and-password` (if this request header was sent at all!).

