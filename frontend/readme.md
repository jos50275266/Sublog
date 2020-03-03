# Next.js

```javascript
npm init --y
npm install --save next react react-dom

// package.json
"scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
}

npm run dev

npm install --save reactstrap react react-dom
```

## Configuration Settings

```javascript
// next.config.js

module.exports = {
  publicRuntimeConfig: {
    App_NAME: "SULOG",
    API_DEVELOPMENT: "http://localhost:8000/api",
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAIN_PRODUCTION: "https://sulog/com",
    DISQUS_SHORTNAME: "sulog",
    GOOGLE_CLIENT_ID:
      "518805803075-k0d67cpk2frtnh0409i6n3624fm8p7i8.apps.googleusercontent.com"
  }
};
```

### Styling Next.js components using CSS

To add CSS to a React Component in Next.js we insert it inside a snippet in the JSX, which start with

```react
<style jsx> {``} </style>
```

Inside this weird blocks we write plain CSS, we'd do in a `.css`file:

```react
<style jsx>{
	h1 {
      font-size: 3rem;
    }
}</style>
```

You can write it inside the JSX, like this:

```react
const Index = () => (
	<div>
    	<h1>Home Page</h1>

        <style jsx>{`
        	h1 {
                font-size: 3rem;
            }
        `}</style>
    </div>
)

export default Index;
```

Inside the block we can use interpolation of dynamically change the values. For example, here we assume `size` prop is being passed by the parent component, and we use it in the `styled-jsx` block:

```react
const Index = props => (
  <div>
		<h1>Home page</h1>

		<style jsx>{`
		  h1 {
		    font-size: ${props.size}rem;
		  }
		`}</style>
  </div>
)
```

If you want to apply some CSS globally, not scoped to a component, you add the `global` keyword to the `style` tag:

```react
<style jsx global>{`
	body {
		margin: 0;
	}
`}</style>
```

If you want to import an external CSS file in a Next.js component, you have to first install `@zeit/next-css`:

```javascript
npm install @zeit/next-css
```

and then create a configuration file in the root of the project, called `next.config.js`, with this content:

```javascript
const withCSS = require("@zeit/next-css");
module.exports = withCSS();
```

After restarting the Next app, you can now import CSS like you normally do with JavaScript libraries or components:

```javascript
import "../style.css";
```

You can also import a SASS file directly, using the [`@zeit/next-sass`](https://github.com/zeit/next-plugins/tree/master/packages/next-sass) library instead.

## Next.js

`dev` runs `next` which starts`Next.js` in development mode

`build` runs `next build` which builds the application for production usage

`start` runs `next start` which starts a Next.js productions server

- `Next.js` is built around concept of pages. A page is a `React Component` exported from a `.js, .jsx, .tx, or .tsx` file in the `pages` directory.

  [React]: https://reactjs.org/docs/components-and-props.html "React"

`Pages` are associated with a route based on their file name. For example, `pages/about.js` is mapped to `/about`. You can even add dynamic route parameters with the filename.

1. Create `pages` directory inside your project.
2. Populate `./pages/index.js` with following contents:

```react
function Homepage() {
    return <div>Welcome to Next.js!</div>
}

export default Homepage;
```

To start developing your application run `npm run dev`. This starts the development server on `http://localhost:3000`.

So far, we get:

- Automatic compilation and bundling (with `webpack` and `babel`)
- Hot code reloading
- Static generation and server-side rendering of `./pages/`
- Static file serving. `./public/` is mapped to `/`

https://nextjs.org/docs/basic-features/pages

## next/link

- https://velog.io/@jakeseo_me/Next.js-%EB%B9%A8%EB%A6%AC-%EB%B0%B0%EC%9A%B0%EA%B8%B0-y0jz9oebn0

- https://velog.io/@janghyoin/Jobshopper-project-NextJS%EC%97%90%EC%84%9C-styled-components-%EC%82%AC%EC%9A%A9-hwjzs423yw
