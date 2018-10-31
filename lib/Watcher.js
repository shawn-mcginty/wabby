// @flow
'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const psTree = require('ps-tree');

class Watcher {
	last/*:number*/;
	buildAndRun/*:Object*/;
	command/*:string*/;
	args/*:Array<string>*/;
	pathsToWatch/*:Array<string>*/;
	cwd/*:string*/;

	constructor (command/*:string*/, args/*:Array<string>*/, pathsToWatch/*:Array<string>*/, cwd/*:string*/) {
		this.last = Date.now();
		this.buildAndRun = {};
		this.command = command;
		this.args = args;
		this.pathsToWatch = pathsToWatch;
		this.cwd = cwd;
	}

	doBuildAndRun() {
		if (this.buildAndRun.kill) {
			psTree(this.buildAndRun.pid, (err, children) => {
				const pids = [ this.buildAndRun.pid ];

				if (err) {
					console.error(err);
				} else {
					children.map(proc => proc.PID)
						.forEach(pid => pids.push(pid));
				}

				pids.forEach((pid) => {
					try {
						process.kill(pid, 'SIGKILL');
					} catch(e) {
						console.error(e);
					}
				});

				this.buildAndRun = child_process.spawn(this.command, this.args, {
					detatched: true,
					cwd: this.cwd,
					stdio: 'inherit',
				});
			});
		} else {
			this.buildAndRun = child_process.spawn(this.command, this.args, {
				cwd: this.cwd,
				stdio: 'inherit',
			});
		}
	}

	watchTheRightStuff() {
		this.pathsToWatch.forEach(pathToWatch => this.watch(pathToWatch));
	}

	hasBeenSomeTime() {
		return Math.abs(this.last - Date.now()) > 500;
	}

	watch(pathToWatch/*:string*/) {
		fs.watch(pathToWatch, {rescursive: true}, () => {
			if (this.hasBeenSomeTime()) {
				this.doBuildAndRun()
			}
			this.last = Date.now();
		})
	}
}

module.exports = Watcher;