const gulp = require("gulp");
const ts = require("gulp-typescript");
const del = require("del");
const tsProject = ts.createProject("tsconfig.json");
const pm2 = require('pm2');

const outputFolder = "dist";
const logFolder = "log";

const arg = (argList => {
	let arg = {}, a, opt, thisOpt, curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');

		if (opt === thisOpt) {
			// argument value
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;
		}
		else {
			// argument name
			curOpt = opt;
			arg[curOpt] = true;
		}
	}
	return arg;

})(process.argv);

gulp.task("clean", function () {
	return del([outputFolder, logFolder]);
});

gulp.task("compile", function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(outputFolder));
});

gulp.task('local', function () {
	pm2.connect(true, function () {
		pm2.start({
			name: 'loop-health',
			script: 'server.js',
			env: {
				"NODE_ENV": "default",
				// "BRAND": arg.brand
			}
		}, function () {
			pm2.streamLogs('loop-health', 0);
		});
	});
});

gulp.task('dev', function () {
	pm2.connect(true, function () {
		pm2.start({
			name: 'loop-health',
			script: 'server.js',
			env: {
				"NODE_ENV": "development",
				// "BRAND": arg.brand
			}
		}, function () {
			pm2.streamLogs('loop-health', 0);
		});
	});
});

gulp.task('local', gulp.series("clean", "compile", "local"));
gulp.task('dev', gulp.series("clean", "compile", "local"));