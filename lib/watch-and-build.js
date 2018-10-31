'use stric';

const fs = require('fs');
const path = require('path');

const Watcher = require('./Watcher');
const packageInfo = require('../package.json');

const cwd = process.cwd();
const rcPath = path.join(cwd, 'watch-and-build.config.js');

fs.access(rcPath, (err) => {
	if (err) {
		console.error(`No config exists at ${rcPath}\nVisit ${packageInfo.homepage} for config templates.`);
		process.exit(1);
		return;
	}

	const rc = require(rcPath);

	rc.watchers
		.map(watcherConf => new Watcher(watcherConf.command, watcherConf.args, watcherConf.pathsToWatch, cwd))
		.forEach(watcher => watcher.watchTheRightStuff());
});