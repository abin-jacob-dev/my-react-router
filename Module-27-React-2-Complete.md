# Module 27 | React 2

> Concise study notes. Try the snippets and answer the quick checks.

## Table of Contents

- [React Router & Navigation](#react-router-navigation)
- [Global State in React](#global-state-in-react)
- [Memoization Techniques](#memoization-techniques)
- [Custom Hooks in React](#custom-hooks-in-react)
- [Higher Order Components (HOC)](#higher-order-components-hoc)
- [npm run build](#npm-run-build)
- [TL;DR](#tl-dr)

---

## React Router & Navigation


### Overview

#### What?
React apps do not reload the whole page. The URL changes, React shows a different component, and the page does **not** refresh. React Router connects **URL → Component**.

#### Why?
Without routing, you only swap UI with state. The URL never changes, so you cannot bookmark, share, or use back/forward. Routing makes the URL the source of truth.

#### Basic Project Structure
```
src/
 ├── main.jsx
 ├── router.jsx
 ├── App.jsx
 └── pages/
       ├── Home.jsx
       ├── About.jsx
       ├── Dashboard.jsx
       ├── Profile.jsx
       └── Settings.jsx
```
Each file has one clear job.

#### Complete Flow (Mental Model)
1. App starts → `main.jsx` runs
2. `RouterProvider` activates the router
3. Router checks the current URL
4. Matching route is found
5. Correct component renders inside `<Outlet />`
6. When URL changes → React re-renders the right components, no page refresh

#### Try yourself
Change the URL from `/home` to `/about` in your browser. Does the page flash/reload? It should not.

#### What happens if...?
...you use `<a href="/about">` instead of `<Link>`? The browser reloads the whole page and you lose client-side state.

#### Quick check
1. What connects URL to component? → React Router.
2. Does routing refresh the page? → No.

#### Common mistake
Using normal `<a>` tags for in-app navigation. Use `<Link>`.

---

### things! (Gallery View)

#### What?
A Notion gallery page that lists all child pages of this topic (the 8 guides below). It has no extra lesson content.

#### Why?
It is an index view. Use it to jump to any guide quickly.

#### Try yourself
Open `things!` and click any card — it opens the matching guide.

#### Quick check
1. Does `things!` add new concepts? → No, it only links to guides.

#### Common mistake
Treating the gallery as a lesson page. It is just navigation.


---

### Why React Needs Routing

#### What?
Conditional rendering swaps components with state (`{page === "home" && <Home />}`). Routing swaps components with the **browser URL**. They solve different problems.

#### Why?
Conditional rendering manages UI state. Routing manages navigation state tied to the URL. Real apps need URLs, bookmarks, back/forward, deep links.

#### Code
```jsx
{page === "home" && <Home />}
{page === "about" && <About />}
```

#### Problems without routing
- URL does not change
- Cannot bookmark pages
- Refresh resets app state
- Back/forward buttons break
- Cannot share links to views

#### What routing adds
- URL ↔ Component Tree
- Refresh keeps you on the same page
- Back/forward works
- Bookmarks and deep links work
- Large apps stay manageable

#### Architectural difference
| Conditional rendering | Routing |
|---|---|
| Controls UI visibility | Controls navigation |
| Uses local state | Uses browser history |
| No URL changes | URL reflects state |
| Good for small toggles | Required for real apps |

#### When do you need routing?
- Multiple pages
- Deep linking
- Browser navigation support
- App grows beyond simple toggles

For tiny apps, conditional rendering is fine.

#### Try yourself
Add a second "page" using only `useState`. Try refreshing — your view resets. That is the limitation.

#### What happens if...?
...you skip routing in a 10-page app? Users cannot share or bookmark any view.

#### Quick check
1. Conditional rendering uses what? → Local state.
2. Routing uses what as source of truth? → The URL.

#### Common mistake
Thinking conditional rendering replaces routing. It does not.

---

### Setting Up Basic Routing

#### What?
Install `react-router-dom`, define routes in `router.jsx`, and activate them with `RouterProvider` in `main.jsx`.

#### Why?
React has no router built in. You must connect React to the browser URL explicitly.

#### Code

Install:
```bash
npm install react-router-dom
```

`main.jsx` (entry point):
```jsx
// main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; //import this
import router from "./router";                     //and this

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />             //add this instead of app.jsx
  </StrictMode>
);
```

`router.jsx` (route map):
```jsx
// router.jsx

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
    path: "/home",
    element: <Home />
    path: "/about",
    element: <About />
  }
]);

export default router;
```

`App.jsx` (navigation):
```jsx
import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <nav>
        <Link to="/home">Home</Link> |
        <Link to="/about">About</Link>
      </nav>

      <h1>Welcome</h1>
    </div>

export default App;
```

#### Key concepts
- `path` — the URL path (`/`, `/home`, `/about`)
- `element` — component rendered when URL matches
- `Link` — changes URL without refreshing (use instead of `<a>`)

#### What happens when you click a Link?
1. URL changes
2. Router checks matching path
3. Matching component renders
4. No page reload

#### BrowserRouter method (alternative)
```jsx
import { BrowserRouter } from "react-router-dom";
<BrowserRouter>
  <App />
</BrowserRouter>

import { Routes, Route } from "react-router-dom";
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

import { Link } from "react-router-dom";
<Link to="/">Home</Link>
```

#### Try yourself
Create `/home` and `/about` pages, then click between them. Check the Network tab — no full reload.

#### What happens if...?
...you forget `RouterProvider`? Routing never activates; navigation does nothing.

#### Quick check
1. Which component activates routing? → `RouterProvider`.
2. Why `Link` over `<a>`? → `Link` does not reload the page.

#### Common mistake
Forgetting to export `router` from `router.jsx`, or using `<a>` instead of `<Link>`.

---

### Nested Routes

#### What?
Nested routes render a child component **inside** a parent component based on URL structure. The parent stays; only a section changes.

#### Why?
Real pages share layouts (`/dashboard/profile` and `/dashboard/settings` share the dashboard shell). Nested routes model this.

#### Code
```jsx
// router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        path: "dashboard",
        element: <Dashboard />,
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
        ],
      },
]);

export default router;
```

Parent must use `<Outlet />`:
```jsx
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Outlet />
    </div>
  );

export default Dashboard;
```

#### Key ideas
- `children` creates parent→child route relationship
- Child routes render inside the parent's `<Outlet />`
- URL structure mirrors component structure

#### Index route (default child)
```jsx
{ index: true, element: <Profile /> }
```
Now `/dashboard` renders `Profile` by default.

#### What happens when URL changes?
- `/dashboard/profile` → App → Dashboard → Profile
- `/dashboard/settings` → only Profile swaps to Settings; Dashboard stays

#### Nested vs flat
| Flat | Nested |
|---|---|
| Replace whole page | Replace part of page |
| Simpler | More scalable |
| Small apps | Structured layouts |

#### Try yourself
Remove `<Outlet />` from `Dashboard`. Navigate to `/dashboard/profile` — the child disappears.

#### What happens if...?
...you over-nest small apps? Code becomes harder to follow. Keep nesting for shared layouts only.

#### Quick check
1. Where do child routes render? → Inside `<Outlet />`.
2. What does `index: true` do? → Default child route.

#### Common mistake
Forgetting `<Outlet />` in the parent, so children never appear.

---

### Outlet

#### What?
`<Outlet />` is a placeholder. It tells React Router: "render the matched child route here."

#### Why?
Needed whenever a route has `children`. Without it, child routes have nowhere to render.

#### Code
```jsx
{
  path: "dashboard",
  element: <Dashboard />,
  children: [
    { path: "profile", element: <Profile /> }
  ]
}
```
```jsx
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Outlet />
    </div>
  );
}
```

#### Passing data with Outlet (context)
```jsx
<Outlet context={{ user }} />
```
```jsx
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { user } = useOutletContext();
  return <h3>{user.name}</h3>;
}
```

#### Key points
- Renders matched child routes
- Required for nested routes
- Does not control navigation
- Can pass data via context
- Works only in parents with children

#### Try yourself
Add `context={{ user }}` to `<Outlet />` and read it in a child with `useOutletContext`.

#### What happens if...?
...`<Outlet />` is missing? Child route never renders.

#### Quick check
1. What renders inside `<Outlet />`? → The matched child route.
2. Can `<Outlet />` pass data? → Yes, via context.

#### Common mistake
Treating `<Outlet />` like a component you import content into. It is just a slot.

---

### useNavigate

#### What?
`useNavigate` returns a function to change the URL with JavaScript (programmatic navigation). Used inside functions, not JSX.

#### Why?
Sometimes navigation depends on logic (form submit, login success). `<Link>` is for clicks; `useNavigate` is for code.

#### Code
```jsx
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/about")}>
      Go to About
    </button>
  );
}
```

#### Dynamic routes
```jsx
navigate(`/users/${id}`);
```
Works with routes like `{ path: "users/:id", element: <UserDetails /> }`.

#### Replace instead of push
```jsx
navigate("/login", { replace: true });
```
Prevents going back to the previous page. Useful after login/logout.

#### Back / forward
```jsx
navigate(-1); // go back
navigate(1);  // go forward
```

#### useNavigate vs Link
| Link | useNavigate |
|---|---|
| Declarative | Imperative |
| Used in JSX | Used in functions |
| UI clicks | Logic-based redirects |
| Simple | Conditional |

Use `<Link>` for normal nav; `useNavigate` when logic decides.

#### Common use cases
- Redirect after form submission
- Redirect after login/logout
- Navigation inside event handlers

#### Try yourself
Add a "Go back" button calling `navigate(-1)` and test it after navigating twice.

#### What happens if...?
...you call `navigate` during render instead of in an event? It can cause infinite loops. Call it in handlers/effects.

#### Quick check
1. `useNavigate` is a hook or component? → Hook.
2. `{ replace: true }` does what? → Replaces history entry.

#### Common mistake
Using `useNavigate` for simple clickable links. Use `<Link>` instead.

---

### Dynamic Route Parameters (useParams)

#### What?
Dynamic segments (`:id`) let one route match many URLs like `/users/101`, `/users/202`. `useParams` reads the value.

#### Why?
You cannot create a route per ID. Dynamic params make URLs data-driven.

#### Code
Define route:
```jsx
{
  path: "users/:id",
  element: <UserDetails />
}
```
Read param:
```jsx
import { useParams } from "react-router-dom";

function UserDetails() {
  const { id } = useParams();

  return <h2>User ID: {id}</h2>;
}
```

Navigate programmatically:
```jsx
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();

  const goToUser = (id) => {
    navigate(`/users/${id}`);
  };

  return <button onClick={() => goToUser(101)}>Open User</button>;
}
```

#### Try yourself
Change URL to `/users/999` and confirm `useParams` returns `"999"`.

#### What happens if...?
...param name in route (`:id`) differs from destructure (`const { userId }`)? You get `undefined`. Names must match.

#### Quick check
1. What symbol marks a dynamic segment? → `:`.
2. `useParams()` returns what? → An object of params.

#### Common mistake
Forgetting the `:` in the path, making it a static route.

---

### Protected Routes

#### What?
A protected route blocks access unless a condition (usually login) is true. Otherwise it redirects (e.g., to `/login`).

#### Why?
Some pages (dashboard, profile, admin) must not be public.

#### Code
Step 1 — `ProtectedRoute` component:
```jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const isLoggedIn = false; // authentication flag

	if (!isLoggedIn) {
		return <Navigate to="/login" />;
	}

	return children;
}
```

Step 2 — use in router:
```jsx
import ProtectedRoute from "./ProtectedRoute";

{
	path: "dashboard",
	element: (
		<ProtectedRoute>
			<Dashboard />
		</ProtectedRoute>
	),
}
```

#### Flow
1. User opens `/dashboard`
2. `ProtectedRoute` runs
3. Check `isLoggedIn`
4. `false` → redirect to `/login`
5. `true` → render `Dashboard`

#### Real auth source
Usually from Context, Redux, localStorage, or JWT:
```jsx
const isLoggedIn = localStorage.getItem("token");
```

#### Navigate vs useNavigate
| Navigate | useNavigate |
|---|---|
| Component | Hook |
| Used in JSX return | Used in functions |
| Auto redirect | Programmatic |
| `<Navigate to="/login" />` | `navigate("/login")` |

#### Common use cases
- Dashboard, profiles, order history
- Admin panels, settings

#### Try yourself
Set `isLoggedIn = true` and confirm `/dashboard` renders. Set `false` and confirm redirect to `/login`.

#### What happens if...?
...you check auth only in the component but not the route? Users can still hit the URL directly. Guard at the route.

#### Quick check
1. What component redirects? → `<Navigate />`.
2. Where should auth be checked? → In the route guard.

#### Common mistake
Reading auth from state that is not ready on first render, causing flicker or wrong redirect.

---

### useSearchParams

#### What?
`useSearchParams` reads and updates **query parameters** (`?menu=display`) in the URL without refreshing.

#### Why?
Query params store small UI state (filters, tabs, search) that should be shareable.

#### Code
```jsx
import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const menu = searchParams.get("menu");

  return (
    <div>
      <h1>Settings</h1>

      <button onClick={() => setSearchParams({ menu: "display" })}>
        Display Settings
      </button>

      <button onClick={() => setSearchParams({ menu: "audio" })}>
        Audio Settings
      </button>

      {menu === "display" && <h2>Display Settings</h2>}
      {menu === "audio" && <h2>Audio Settings</h2>}
    </div>
  );
}
```

#### How it works
- Click "Display Settings" → URL becomes `/settings?menu=display`
- Click "Audio Settings" → URL becomes `/settings?menu=audio`
- `searchParams.get("menu")` reads the value

#### Simple definition
`useSearchParams` lets you read and update query parameters in the URL without refreshing the page.

#### Try yourself
Add a third button "Privacy" setting `menu=privacy` and show a matching heading.

#### What happens if...?
...you call `setSearchParams` with a string instead of an object? It may replace all params. Pass an object to keep it predictable.

#### Quick check
1. Where do query params live? → After `?` in the URL.
2. Which hook reads them? → `useSearchParams`.

#### Common mistake
Using query params for data that should be a route param, or vice versa.

---

### Final Recall
- React Router connects **URL → Component** without page refresh.
- Use `<Link>` / `useNavigate`, not `<a>`, for in-app nav.
- `main.jsx` uses `RouterProvider`; `router.jsx` maps `path` → `element`.
- Nested routes share layouts; children render in `<Outlet />`.
- `useParams` reads `:id` segments; `useSearchParams` reads `?query` values.
- Protected routes guard with `<Navigate />` based on auth state.

---

## Global State in React

### Prop Drilling

#### What?
Prop drilling is passing data through components that do not use it, just so a deeply nested component can access it.

#### Why?
It creates unnecessary coupling and clutter. It is fine for small trees but painful in large apps.

#### Example
```text
App → Layout → Sidebar → Profile → Avatar
```
If `Avatar` needs `user`, every level must forward it:
```jsx
<Layout user={user} />
<Sidebar user={user} />
<Profile user={user} />
```

#### Try yourself
Add a prop to a deeply nested child and watch how many components you must update.

#### What happens if...?
...you refactor the tree? Every forwarding prop must be updated. Context avoids this.

#### Quick check
1. What is prop drilling? → Forwarding props through unused components.
2. When is it acceptable? → Small component trees.

#### Common mistake
Passing props through 5+ levels instead of using Context.

---

### Context API

#### What?
Context lets you share data across components without manual prop passing. Create a context, wrap with a Provider, read with `useContext`.

#### Why?
Removes prop drilling. Data lives in one place and broadcasts to consumers.

#### Code
Create:
```jsx
import { createContext } from "react";
const UserContext = createContext();
```

Provide:
```jsx
<UserContext.Provider value={user}>
  <App />
</UserContext.Provider>
```

Consume:
```jsx
import { useContext } from "react";
const user = useContext(UserContext);
```

#### Important mental model
Context is a broadcast mechanism, not magic storage. When the value changes, all consumers re-render.

#### Structuring in a separate file
```text
/context
  UserContext.js
```
```jsx
export const UserContext = createContext();
```
Improves reusability and separation.

#### Try yourself
Wrap two sibling components in a Provider and read the same value in both without props.

#### What happens if...?
...you put mutable objects in context without memoizing? Consumers re-render on every parent render.

#### Quick check
1. What hook reads context? → `useContext`.
2. What triggers consumer re-renders? → Provider value change.

#### Common mistake
Treating context as global mutable state and mutating it directly.

---

### Creating a Custom Context Provider

#### What?
Move context state and logic into a dedicated provider component instead of putting it in `App`.

#### Why?
Encapsulation, separation of concerns, scalability, easier testing.

#### Code
```jsx
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState("Guest");

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
```

In `main.jsx`:
```jsx
<UserProvider>
  <App />
</UserProvider>
```

#### Why not put everything in App?
It mixes layout, business logic, state management, and context config in one place. A custom provider keeps `App` focused on UI.

#### Try yourself
Create a `ThemeProvider` and wrap your app with it.

#### Quick check
1. What does a provider component encapsulate? → State + logic.
2. Where is it mounted? → Above `App`.

#### Common mistake
Creating the provider inside `App` and recreating it every render.

---

### React use() — Modern Data Reading API

#### What?
`use()` is a React function that reads context values or promises (async data) inside components.

#### Why?
Unifies reading context and async data under one API. Can be called conditionally (unlike hooks).

#### Code
Context (old vs new):
```jsx
const user = useContext(UserContext); // old
const user = use(UserContext);       // new
```

Async data:
```jsx
const data = use(fetchData());
```
If the promise is not resolved, React pauses rendering until ready.

#### Key difference
| Hooks | use() |
|---|---|
| Must follow Rules of Hooks | Not a traditional hook |
| Context only | Context + promises |
| Cannot be conditional | Can be conditional |

#### Try yourself
Replace `useContext` with `use` in a component and confirm identical output.

#### Quick check
1. Can `use()` read promises? → Yes.
2. Can `use()` be called in a condition? → Yes.

#### Common mistake
Calling `use()` with a promise created inline each render, causing infinite suspense loops.

---

### Pros & Cons

#### Advantages
- Avoids prop drilling
- Centralized shared state
- Cleaner components (no unnecessary props)
- Built into React (no extra library)

#### Disadvantages
- All consumers re-render when value changes
- Not ideal for very large/complex state (use Redux/Zustand/Recoil)
- Harder debugging in large apps
- Provider hell with too many providers

#### Summary table
| Advantages | Disadvantages |
|---|---|
| Avoids prop drilling | Causes re-renders |
| Cleaner structure | Not for complex state |
| Built into React | Debugging harder |
| Easy to implement | Provider clutter |

#### Try yourself
Nest 4 providers and observe the tree in React DevTools.

#### Quick check
1. Main downside of Context? → Consumer re-renders.
2. When prefer Redux/Zustand? → Large complex state.

#### Common mistake
Using Context for rapidly changing values (e.g., mouse position) causing performance issues.


---

## Memoization Techniques

### Overview

#### What?
React re-renders on state/prop changes. `useMemo`, `useCallback`, and `React.memo` help skip unnecessary work by keeping references stable.

#### Why?
Re-renders are normal; expensive work during re-renders is the problem. These are optimization tools, not required for basic apps.

#### Mental model
- `{} !== {}`, `[] !== []`, `() => {} !== () => {}` (reference inequality)
- React compares props by reference, not deep equality.

#### Practical rule
Use them when you pass objects/functions to memoized children, have measurable perf issues, or handle large datasets. Otherwise keep it simple.

#### Try yourself
Log renders in a child while clicking a counter in the parent (without memoization).

#### Quick check
1. Does React do deep prop comparison? → No, shallow/reference.
2. Are memoization hooks required? → No.

#### Common mistake
Memoizing everything "just in case", hurting readability.

---

### React.memo

#### What?
`React.memo` is a HOC that skips re-rendering a component when its props have not changed (shallow comparison).

#### Why?
Prevents children from re-rendering when parent re-renders but props are identical.

#### Code
```jsx
import React from "react";

const Child = React.memo(function Child({ name }) {
  console.log("Child rendered");
  return <p>{name}</p>;
});
```

#### Example
```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <Child name="Shaad" />
    </>
  );
}
```
Clicking increments `count`; `Child` does not re-render because `name` is unchanged.

#### Important: shallow comparison
- Primitives compared by value: `5 === 5`
- Objects/arrays/functions compared by reference: `{} !== {}`

#### Common re-render problems
```jsx
<Child options={{ dark: true }} />   // new object every render
<Child items={[1, 2, 3]} />          // new array every render
<Child onClick={() => console.log("Hi")} /> // new function every render
```

#### Fix with useMemo / useCallback
```jsx
const options = useMemo(() => ({ dark: true }), []);
const handleClick = useCallback(() => console.log("Hi"), []);
```

#### When to use
- Expensive components
- Parent re-renders frequently
- Props usually stable

#### When not to use
- Very simple components
- Props change often
- No performance issue

#### Limitations
`React.memo` only checks props. It does not block re-renders from state updates, context updates, or parent logic changes.

#### Try yourself
Pass an inline object prop to a memoized child and watch it re-render; then stabilize with `useMemo`.

#### Quick check
1. What does `React.memo` compare? → Props (shallow).
2. Does it block context-driven re-renders? → No.

#### Common mistake
Expecting `React.memo` to stop all re-renders.

---

### useMemo

#### What?
`useMemo` remembers the result of a calculation and recomputes only when dependencies change.

#### Why?
Avoids re-running expensive calculations on every render.

#### Code
```jsx
const value = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

#### Why pass a function?
React must control when to run the calculation. Writing `useMemo(expensiveCalculation(data), [data])` would run it every render.

#### Dependency array
```jsx
const sorted = useMemo(() => items.sort(), [items]);
```
Recomputes only when `items` changes (shallow comparison).

#### Empty deps
```jsx
const value = useMemo(() => computeValue(), []);
```
Runs once; value never changes.

#### Stable objects
```jsx
const options = useMemo(() => ({ theme: "dark" }), []);
```
Keeps object reference stable across renders.

#### What useMemo does NOT do
It does not stop re-renders; it only skips unnecessary calculations.

#### Try yourself
Add `console.log` inside the `useMemo` factory and change unrelated state — it should not log.

#### Quick check
1. What does `useMemo` return? → A memoized value.
2. When does it recompute? → When deps change.

#### Common mistake
Using `useMemo` for cheap calculations; overhead outweighs benefit.

---

### useCallback

#### What?
`useCallback` remembers a function and returns the same reference unless dependencies change.

#### Why?
Function props are recreated every render. Stable references prevent unnecessary child re-renders (with `React.memo`).

#### Code
```jsx
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

#### With dependencies
```jsx
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

#### Relationship to useMemo
```jsx
useCallback(fn, deps) ≈ useMemo(() => fn, deps)
```
`useMemo` for values, `useCallback` for functions (clearer intent).

#### What useCallback does NOT do
It does not stop component re-renders and does not make functions faster; it only stabilizes references.

#### Try yourself
Pass a `useCallback`-wrapped handler to a `React.memo` child and toggle unrelated state — child should not re-render.

#### Quick check
1. `useCallback` returns what? → A memoized function.
2. When is it recreated? → When deps change.

#### Common mistake
Wrapping every handler in `useCallback` by default.


---

## Custom Hooks in React

### What?
A custom hook is a function (name starts with `use`) that reuses stateful logic across components. It can call other hooks.

### Why?
Avoids repeating logic, keeps components clean, improves readability and separation of concerns.

### Naming rule
Must start with `use`: `useCounter`, `useFetch`, `useAuth`. Not `counterHook`.

### Basic example
```jsx
import { useState } from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

function Counter() {
  const { count, increment, decrement } = useCounter(0);
  return (
    <>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </>
  );
}
```

### Real-world example (fetching)
```jsx
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

function Users() {
  const { data, loading } = useFetch("/api/users");
  if (loading) return <p>Loading...</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### Rules
- Do: start name with `use`, call hooks inside, return values/functions.
- Don't: call hooks inside loops/conditions; call outside components/hooks.

### Custom hook vs component
| Custom Hook | Component |
|---|---|
| Reuses logic | Renders UI |
| Returns data/functions | Returns JSX |
| Uses hooks | May use hooks |

### Composition
Custom hooks can call other custom hooks:
```jsx
function useAuth() {
  const { data } = useFetch("/api/user");
  return data;
}
```

### Try yourself
Extract a `useToggle` hook and use it in two different components.

### Quick check
1. Must a custom hook start with `use`? → Yes.
2. What does it return? → Data/functions (not JSX).

### Common mistake
Putting UI/rendering logic inside a hook.

---

## Higher Order Components (HOC)

### What?
A HOC is a function that takes a component and returns a new enhanced component. It wraps; it does not modify the original.

### Why?
Reuse cross-cutting behavior (auth, logging, loading, data injection) across components without repeating code.

### Basic pattern
```jsx
function withFeature(WrappedComponent) {
  return function EnhancedComponent(props) {
    // logic here
    return <WrappedComponent {...props} />;
  };
}
```

### Examples

Logging:
```jsx
function withLogger(WrappedComponent) {
  return function Enhanced(props) {
    console.log("Rendered:", WrappedComponent.name);
    return <WrappedComponent {...props} />;
  };
}
const LoggedDashboard = withLogger(Dashboard);
```

Auth:
```jsx
function withAuth(WrappedComponent) {
  const isAuthenticated = true;
  if (!isAuthenticated) return <p>Please login</p>;
  return function Enhanced(props) {
    return <WrappedComponent {...props} />;
  };
}
```

Inject props:
```jsx
function withUser(WrappedComponent) {
  const user = "Shaad";
  return function Enhanced(props) {
    return <WrappedComponent {...props} user={user} />;
  };
}
```

Loading:
```jsx
function withLoading(WrappedComponent) {
  return function Enhanced({ isLoading, ...props }) {
    if (isLoading) return <p>Loading...</p>;
    return <WrappedComponent {...props} />;
  };
}
```

### Understanding `{...props}`
Spreads all received props to the wrapped component:
```jsx
props = { name: "Shaad", age: 21 }
<WrappedComponent {...props} /> // name="Shaad" age={21}
```

### Common mistakes
- `<Component props />` → `props = true` (lowercase treated as HTML tag)
- `<Component props={props} />` → sends whole object as single prop
- Correct: `<Component {...props} />`

### Composition
```jsx
const Enhanced = withAuth(withLogger(Component));
```
Runs inside-out: Component → withLogger → withAuth.

### Props collision
```jsx
return <WrappedComponent {...props} user="Admin" />;
```
If `user` already exists in props, it gets overwritten.

### Performance
Define HOCs outside components:
```jsx
// bad: recreates every render
function Home() {
  const Enhanced = withAuth(Component);
  return <Enhanced />;
}

// good
const Enhanced = withAuth(Component);
function Home() {
  return <Enhanced />;
}
```

### HOC vs custom hook
| HOC | Custom Hook |
|---|---|
| Wraps component | Reuses logic |
| Can control rendering | Cannot control rendering |
| Alters structure | Keeps structure |
| Less used now | Preferred in modern React |

### Downsides
- Wrapper hell (nested HOCs)
- Hard debugging
- Props conflicts
- Less readable if overused

### When to use
- Inject behavior into many components
- Conditional rendering
- Legacy code
- Wrapping third-party components

### Debugging tip
```jsx
EnhancedComponent.displayName = `withAuth(${WrappedComponent.name})`;
```
Helps in React DevTools.

### Try yourself
Wrap a component with `withLoading` and toggle `isLoading`.

### Quick check
1. What does a HOC return? → A new enhanced component.
2. Does it mutate the original? → No.

### Common mistake
Creating the enhanced component inside the render function.


---

## npm run build

### What?
`npm run build` runs the script defined in `package.json` (e.g., `vite build` or `react-scripts build`). It compiles developer-friendly code into browser-efficient production files.

### Why?
Browsers do not understand JSX or modern JS modules. Build transforms, bundles, minifies, and optimizes code for deployment.

### What happens during build
1. **Bundling** — all files (components, CSS, images, node_modules) combined into optimized bundles.
2. **JSX → JS** — `<div>Hello</div>` becomes `React.createElement("div", null, "Hello")`.
3. **Transpilation** — modern JS (optional chaining, ES6 modules) transformed for browser compatibility.
4. **Minification** — variable names shortened, whitespace/comments removed.
5. **Tree shaking** — unused imports removed.
6. **Asset optimization** — images/CSS compressed and hashed (e.g., `index.8fj39dk.js`) for caching.
7. **Output folder** — `dist/` (Vite) or `build/` (CRA): pure static HTML/CSS/JS. This is what you deploy.

### Dev vs build
| Dev server | Build |
|---|---|
| Fast, unoptimized | Optimized, minified |
| HMR enabled | Production-ready |
| Source code | Static files |

If something works in dev but breaks after build, you likely relied on dev-only behavior.

### Try yourself
Run `npm run build` and inspect the `dist/` folder — no JSX, no React source.

### Quick check
1. What does `npm run build` actually run? → The `build` script in `package.json`.
2. Output folder for Vite? → `dist/`.

### Common mistake
Deploying the `src/` folder instead of `dist/`/`build/`.

---

### Bundling Concepts — Babel & Webpack

#### What is bundling?
Combining multiple files into one (or few) optimized files for the browser.

#### Why bundling?
- Fewer HTTP requests
- Better performance
- Modular code organization
- Browser-compatible output

#### Problem without bundling
Browsers cannot handle JSX, modern JS (ES6+), or `import` statements directly.

#### Babel (code translator)
Converts modern JS/JSX into browser-compatible JS. It does NOT bundle.
```jsx
// Input
const App = () => <h1>Hello</h1>;

// Output (after Babel)
const App = function() {
  return React.createElement("h1", null, "Hello");
};
```
What Babel does:
- JSX → JS
- ES6+ → ES5
- Makes code browser-compatible

#### Webpack (bundler)
Bundles all files into one. Reads project, finds dependencies (imports), combines everything, outputs final bundle.

#### How they work together
```text
Your Code (JSX, ES6)
        ↓
     Babel (convert)
        ↓
   Webpack (bundle)
        ↓
   bundle.js
        ↓
     Browser
```

#### Core Webpack concepts
1. **Entry** — starting point: `entry: "./src/index.js"`
2. **Output** — final bundled file: `filename: "bundle.js"`, `path: "/dist"`
3. **Loaders** — tell Webpack how to handle files (babel-loader for JS/JSX, css-loader for styles)
4. **Plugins** — extra features (optimization, HTML generation)

#### Simple setup
```bash
npm install webpack webpack-cli babel-loader
```

#### Try yourself
Create a minimal Webpack config with entry/output and run it.

#### Quick check
1. What does Babel do? → Transforms code.
2. What does Webpack do? → Bundles files.
3. Does Babel bundle? → No.

#### Common mistake
Confusing Babel and Webpack roles; Babel transforms, Webpack bundles.

---

## TL;DR

- React Router connects **URL → Component** without page refresh.
- Use `<Link>` / `useNavigate`, not `<a>`, for in-app nav.
- `main.jsx` uses `RouterProvider`; `router.jsx` maps `path` → `element`.
- Nested routes share layouts; children render in `<Outlet />`.
- `useParams` reads `:id` segments; `useSearchParams` reads `?query` values.
- Protected routes guard with `<Navigate />` based on auth state.
- Context shares state without prop drilling; value changes re-render consumers.
- `React.memo` skips re-renders when props unchanged; `useMemo`/`useCallback` stabilize values/functions.
- Custom hooks reuse stateful logic; HOCs wrap components to add behavior.
- `npm run build` compiles to static production files; Babel transforms, Webpack bundles.
