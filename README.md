# take-heart-australia

This is a project created during RHoK Sydney Summer Hackathon 2017. (25th-26th Nov)
There are at least 9 developers working on this during the weekend. So the codebase is a bit messy, and requires refactor and tidying up before continuing the work.

## How to run the project

* #### Install dependencies
  * `npm install` or `yarn` (if available)

* #### Compile sass to css
  * Install gulp https://gulpjs.com/
  * Run `gulp sass`

* #### Transpile and bundle client side javascript
  * run `npm install -g webpack` then `webpack`
  * **OR**, run `node_modules/.bin/webpack`

* #### Run express server
  * `npm start`
  * go to `http://localhost:3939/` or the address that is specified from server log

---

## Components of the application (see server.js for details)

* [Homepage](#homepage)
* [Training](#training)
* [Donation](#donation)
* [Database](#database)

### Homepage

Homepage contains `bootstrap` and `jquery`, some features are slider and video pop up. There is donation section in the page, and navigation bar which should be used on every page 

Routes:
* `/`

Files:
* `public/index.html` is the entry point
* Any assets in `public` folder (`public/**.jpeg`, `public/**.jpg`, `public/**.gif`) belong to Homepage
* `public/js/frontpage.js`
* `public/css/frontpage.css`

Todo list for homepage:
- [ ] Cleaning up comments
- [ ] Connecting `Donation` section in the page to [Donation Page](#donation)
- [ ] Fixing CSS
- [ ] Proper link for navigation bar
- [ ] In general, cleaning up the Homepage and fill in with real data

### Training

Routes:
* `/training`
* `/training-community.html`

Training page was planned to be a single page with 3 tabs `corporate`, `individual`, and `community chamption(?)`. Inside of each tab, there should be a form.
* Corporate: Targeted for companies, user from companies should be able to fill in their data to ask for training request. After the form is submitted, it should be stored inside database **(haven't been implemented)**
* Community champion (`/training-community.html`): Same logic with corporate
* Individual (`/training`): Targeted for any individual who wants to join public training. This tab contains *Eventbrite* implementations to facilitate event lookups.
To test *Eventbrite* implementation, log in to `take-heart-australia` *Eventbrite* account, then create a sample event, and then select some values for the dropdown and click `Apply` button, it should show up the sample event that you just created.
How it works:
  * **Server**:
    * When the page loaded, the server will make a request to *Eventbrite* API using *take-heart-australia* API Token
    * It will fetch all upcoming events listed in *take-heart-australia* Eventbrite account (`eventId`, `eventDateTime`, `eventVenueId`)
    * Then it will fetch the address details for each event (`eventAddress`)
    * After that it will inject data for the Eventbrite events to the `html` as a global variable (`Array` of object containing `eventId`, `eventVenue`, `eventDate`) (for more details see `server.js` in the `/training` route)
  * **Now moving to client side**:
    * It will build form dropdown for `stateLocation`, `venue` (address), `date`, and each of them will be prepopulated with upcoming *Eventbrite* events data
  * **Then for user interaction**:
    * User will select some filters before showing the events (state/venue/date)
    * When user clicks `Apply`, it will filter the data coming from server (that contains all events data), then only retrieve the filtered `eventId`
    * Using the `eventId`, it will draw `iframe` provided from *Eventbrite* developer page with the `eventId`
    * For every `eventId` there will be one `iframe` representing the event, and user can click on them to be redirected to **Eventbrite** page, where they will register for the events
    * For the future goal, we also want to pull the data from *Eventbrite* to the database(?)

Files:
  * `app` folder containing `html` and `sass` for the `/training` page.
  * The `sass` files will be compiled into `public/css/training.css` folder when running `gulp sass`
  * `src/training/`, containing javascript files for the client side and it contains `React`. It will be transpiled and bundled to `public/js/training.bundle.js` by running `webpack`.

Todo list for `/training`:
* [ ] Create 3 tabs in the page for `corporate`, `individual`, and `community`
* [ ] Moving `/training-community.html` into `community` tab
* [ ] Creating `corporate` form
* [ ] Moving the contents from `app` folder into `src` to tidy up project structure
* [ ] Adding navigation bar
* [ ] The approach taken by making multiple request to *Eventbrite* before giving response to the page in the server, is not ideal. The page loads too slow since we're making multiple linear requests beforehand (not parallel). There should be a caching layer in here, or better implementation

### Donation

Routes:
* `/donation`
* `/donation/*`
* `/donate_secure_pay`

### Database

Using `postgresql`
