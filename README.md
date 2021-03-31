# DIY Depot (CAPSTONE PROJECT - Incomplete)

## Setting up local dev environment
* Install NodeJS 15.7.0: [NodeJS](https://nodejs.org/en/)
* run `npm install`
* run `npm run build-dev-watch`
* run `npm start`
* browse to: [Localhost](http://localhost:8080) and verify that website loads

## Working in the project

### Front End

When working in the front end you will be working out of `./src`. `Bootstrapper.tsx` will allow you to load various parts of the front-end experience depending on where you are browsed to. Whenever the backend create a new .html file you must go in and create a front end bound place to load your entry point. For example the home page uses `./pages/index.html` within there a call to `window.bootstrapApp("HOME");` is made. `"HOME"` is an name I put in the switch case of `Bootstrapper.tsx` to know to load the home part of the app reference `./src/Home/Home.tsx`. As long as `npm run build-dev-watch` and the route is added to `server_mapping.json` before `npm start` is ran you will be able to just reload the page to see your new JS changes.

For help with MaterialUI and typescript reference: [MaterialUI](https://material-ui.com/guides/typescript/)

### Backend

To add a new page to the application add the `.html` page to `./pages/{name}.html` then add the route you want to browse to and the file to load in `server_mapping.json` this follows the format:
```
{
    "path": "/{route}",
    "file": "{filename}.html"
}
```

Then you will have to kill your current `npm start` instance and run `npm start` again. After this browse to the route and make sure that it loaded properly.
