require('dotenv').config({
  path: `${__dirname}/.env`,
});

const Nexmo = require('nexmo');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/dist`));

const userAcl = {
  paths: {
    '/v1/users/**': {},
    '/v1/conversations/**': {},
    '/v1/sessions/**': {},
    '/v1/devices/**': {},
    '/v1/image/**': {},
    '/v3/media/**': {},
    '/v1/applications/**': {},
    '/v1/push/**': {},
    '/v1/knocking/**': {},
  },
};

console.log(process.env.APP_ID)
console.log(process.env.PRIVATE_KEY)

privateKey = Buffer.from(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), 'utf-8');

// endpoint that doesn't authenticate the user
// it will simply return a JWT with every request
app.get('/api/jwt/:user', (req, res) => {
  const jwt = Nexmo.generateJwt(privateKey, {
    application_id: process.env.APP_ID,
    sub: req.params.user,
    exp: new Date().getTime() + 86400,
    acl: userAcl,
  });

  res.json({ user_jwt: jwt });
});

app.get('/api/data/stages', (req, res) => {
  res.json([
    {
      name: 'a',
      stitch: 'stagea',
      id: 'CON-1a7dd01f-120a-4dcd-a4d7-46ea9a46f1eb',
    },
    {
      name: 'b',
      stitch: 'stageb',
      id: 'CON-12bf3f5a-bb6e-4f2c-9f30-bd64afd227c4',
    },
    {
      name: 'c',
      stitch: 'stagec',
      id: 'CON-e130a407-cfac-4ff6-b12a-04c8914ed97b',
    },
  ]);
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`server started ${port}`);
