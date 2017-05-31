const express = require('express');
const queryString = require('query-string');

const app = express();


const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  }
];

function gateKeeper(req, res, next) {
  //  `Object.assign` here gives us a neat, clean way to express the following idea:
  //  We want to create an object with default
  //  values of `null` for `user` and `pass`,
  //  and *then*, if after parsing the request header
  //  we find values for `user` and `pass` set
  //  there, we'll use those over the default.
  //  Either way, we're guaranteed to end up
  //  with an object that has `user` and `pass`
  //  keys.
  const {user, pass} = Object.assign(
    {user: null, pass: null}, queryString.parse(req.get('x-username-and-password')));


  // ^^ the more verbose way to express this is:
  //
  // const parsedHeader = queryString.parse(req.get('x-username-and-password'));
  // const user = parsedHeader.user || null;
  // const pass = parsedHeader.pass || null;

  // if there's a user in `USERS` with the username
  // and password from the request headers,
  // we set `req.user` equal to that object.
  // Otherwise, `req.user` will be undefined.
  req.user = USERS.find(
    (usr, index) => usr.userName === user && usr.password === pass);
  // gotta call `next()`!!! otherwise this middleware
  // will hang.
  next();
}

// use `gateKeeper` for all routes in our app.
// this means `req.user` will always be added
// to the request object.
app.use(gateKeeper);


app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
