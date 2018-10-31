# Wabby
> **W**atch **a**nd **b**uild

Configurable file system watcher that runs arbitrary commands when specific directories of files change.

### Install
Install via NPM:
`npm install --save-dev shawn-mcginty/wabby`

### Configure

Wabby requires a config file `wabby.config.js` to exist in your project directory.

Example `wabby.config.js`
```javascript
'use strict';

const path = require('path');

module.exports = {
	watchers: [
		{
			command: 'npm',
			args: ['run', 'front-end-build'],
			pathsToWatch: [path.join(__dirname, 'client', 'src'), path.join(__dirname, 'client', 'test')],
		},
		{
			command: 'mix', // elixir backend
			args: ['run', '--no-halt'],
			pathsToWatch: [path.join(__dirname, 'lib'), path.join(__dirname, 'test')],
		}
	],
};
```

It's recommended to add wabby to package.json scripts for easy running.
```json
	"scripts": {
		"wabby": "wabby",
		"front-end-build": "webpack && mocha --recursive"
	}
```
### Run
`npm run wabby`
