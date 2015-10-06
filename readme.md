# json-bundler

json-bundler is a tool used internally at Wunderflats to merge JSON-files containing locale information together by name.

## Installation

```
npm i gulp-json-bundler
```

## Use Case

Imagine having a React application. Each component will need to define strings for its user interface. If these components should be multilingual, you will need locale files.

At Wunderflats, we use a directory layout that looks something like this:

```
src/
  components/
    component-1/
      locales/
        de-de.json
        en-us.json
      component-1.js
      component-1.scss
    component-2/
      locales/
        de-de.json
        fr-fr.json
      component-2.js
      component-2.scss
dist/
  locales/
    de-de.json
    en-us.json
    fr-fr.json
  app.js
```

In our build process, we want to merge all language files for each language together. E.g. `component-1/locales/de-de.json` and `component-2/locales/de-de.json` will be merged into a single file `de-de.json`, with their contents available as properties derivered from the file path.

The content of `component-1/locales/de-de.json` will be available as the deep property `components.component-1` inside the bundle `de-de.json` file.

## Example

### gulpfile.js

```javascript
gulp.task('locales', function() {
  return gulp
    .src('src/**/locales/**/*.json')
    .pipe(jsonBundler({
      omit: 'locales', // omits `locales` from the resulting json path
      master: 'de-de.json' // inherit missing keys from `de-de.json`
    }))
    .pipe(gulp.dest('dist'));
});
```
