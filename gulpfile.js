"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var csso = require("gulp-csso");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var postHtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlMin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var del = require("del");

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src(["source/img/*.*",
      "source/fonts/*.{woff,woff2}",
      "source/fonts/**/*.{woff,woff2}"
    ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(postHtml([
      include()
    ]))
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("img", function () {
  return gulp.src("build/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({
        plugins: [
          {
            convertStyleToAttrs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("build/img/*.{png,jpg}")
    .pipe(webp({quality: 95}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src([
    "source/img/icon-*-mobile.svg",
    "source/img/icon-mail.svg",
    "source/img/icon-phone.svg",
    "source/img/html*.svg"
  ])
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            removeAttrs:
              {
                attrs: "fill"
              }
          },
          {
            removeStyleElement: true
          }
        ]
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch([
    "source/img/icon-*-mobile.svg",
    "source/img/*-mail.svg",
    "source/img/*-phone.svg",
    "source/img/html*.svg"
  ], gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch(("source/js/**/*.js"), gulp.series("js", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "img",
  "webp",
  "sprite",
  "html",
  "js"
));

gulp.task("start", gulp.series("build", "server"));
