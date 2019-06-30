# hubot-kdeploy

A hubot script that deploys to K8s via Mack

See [`src/kdeploy.coffee`](src/kdeploy.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-kdeploy --save`

Then add **hubot-kdeploy** to your `external-scripts.json`:

```json
["hubot-kdeploy"]
```

Set these envars:

HUBOT_KDEPLOY_PREFIX - deploy command prefix (default `kdeploy`, optional)
HUBOT_KDEPLOY_CONFIG_JSON - location of the JSON config file (default project root, optional)
HUBOT_KDEPLOY_MACK_XXX_API_KEY - the Mack API key for each target in config file (required)

## Sample Interaction

```
user1>> hubot kdeploy foobar to production
mack>> Deploying foorbar to production
```

## NPM Module

https://www.npmjs.com/package/hubot-kdeploy
