# React Router & Navigation — Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [things! (Gallery View)](#things-gallery-view)
3. [Why React Needs Routing](#why-react-needs-routing)
4. [Setting Up Basic Routing](#setting-up-basic-routing)
5. [Nested Routes](#nested-routes)
6. [Outlet](#outlet)
7. [useNavigate](#usenavigate)
8. [Dynamic Route Parameters (useParams)](#dynamic-route-parameters-useparams)
9. [Protected Routes](#protected-routes)
10. [useSearchParams](#usesearchparams)
11. [Final Recall](#final-recall)

---

## Overview

### What?
React apps do not reload the whole page. The URL changes, React shows a different component, and the page does **not** refresh. React Router connects **URL → Component**.

### Why?
Without routing, you only swap UI with state. The URL never changes, so you cannot bookmark, share, or use back/forward. Routing makes the URL the source of truth.

### Basic Project Structure
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

### Complete Flow (Mental Model)
1. App starts → `main.jsx` runs
2. `RouterProvider` activates the router
3. Router checks the current URL
4. Matching route is found
5. Correct component renders inside `<Outlet />`
6. When URL changes → React re-renders the right components, no page refresh

### Try yourself
Change the URL from `/home` to `/about` in your browser. Does the page flash/reload? It should not.

### What happens if...?
...you use `<a href="/about">` instead of `<Link>`? The browser reloads the whole page and you lose client-side state.

### Quick check
1. What connects URL to component? → React Router.
2. Does routing refresh the page? → No.

### Common mistake
Using normal `<a>` tags for in-app navigation. Use `<Link>`.

---

## things! (Gallery View)

### What?
A Notion gallery page that lists all child pages of this topic (the 8 guides below). It has no extra lesson content.

### Why?
It is an index view. Use it to jump to any guide quickly.

### Try yourself
Open `things!` and click any card — it opens the matching guide.

### Quick check
1. Does `things!` add new concepts? → No, it only links to guides.

### Common mistake
Treating the gallery as a lesson page. It is just navigation.


---

## Why React Needs Routing

### What?
Conditional rendering swaps components with state (`{page === "home" && <Home />}`). Routing swaps components with the **browser URL**. They solve different problems.

### Why?
Conditional rendering manages UI state. Routing manages navigation state tied to the URL. Real apps need URLs, bookmarks, back/forward, deep links.

### Code
```jsx
{page === "home" && <Home />}
{page === "about" && <About />}
```

### Problems without routing
- URL does not change
- Cannot bookmark pages
- Refresh resets app state
- Back/forward buttons break
- Cannot share links to views

### What routing adds
- URL ↔ Component Tree
- Refresh keeps you on the same page
- Back/forward works
- Bookmarks and deep links work
- Large apps stay manageable

### Architectural difference
| Conditional rendering | Routing |
|---|---|
| Controls UI visibility | Controls navigation |
| Uses local state | Uses browser history |
| No URL changes | URL reflects state |
| Good for small toggles | Required for real apps |

### When do you need routing?
- Multiple pages
- Deep linking
- Browser navigation support
- App grows beyond simple toggles

For tiny apps, conditional rendering is fine.

### Try yourself
Add a second "page" using only `useState`. Try refreshing — your view resets. That is the limitation.

### What happens if...?
...you skip routing in a 10-page app? Users cannot share or bookmark any view.

### Quick check
1. Conditional rendering uses what? → Local state.
2. Routing uses what as source of truth? → The URL.

### Common mistake
Thinking conditional rendering replaces routing. It does not.

---

## Setting Up Basic Routing

### What?
Install `react-router-dom`, define routes in `router.jsx`, and activate them with `RouterProvider` in `main.jsx`.

### Why?
React has no router built in. You must connect React to the browser URL explicitly.

### Code

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

### Key concepts
- `path` — the URL path (`/`, `/home`, `/about`)
- `element` — component rendered when URL matches
- `Link` — changes URL without refreshing (use instead of `<a>`)

### What happens when you click a Link?
1. URL changes
2. Router checks matching path
3. Matching component renders
4. No page reload

### BrowserRouter method (alternative)
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

### Try yourself
Create `/home` and `/about` pages, then click between them. Check the Network tab — no full reload.

### What happens if...?
...you forget `RouterProvider`? Routing never activates; navigation does nothing.

### Quick check
1. Which component activates routing? → `RouterProvider`.
2. Why `Link` over `<a>`? → `Link` does not reload the page.

### Common mistake
Forgetting to export `router` from `router.jsx`, or using `<a>` instead of `<Link>`.

---

## Nested Routes

### What?
Nested routes render a child component **inside** a parent component based on URL structure. The parent stays; only a section changes.

### Why?
Real pages share layouts (`/dashboard/profile` and `/dashboard/settings` share the dashboard shell). Nested routes model this.

### Code
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

### Key ideas
- `children` creates parent→child route relationship
- Child routes render inside the parent's `<Outlet />`
- URL structure mirrors component structure

### Index route (default child)
```jsx
{ index: true, element: <Profile /> }
```
Now `/dashboard` renders `Profile` by default.

### What happens when URL changes?
- `/dashboard/profile` → App → Dashboard → Profile
- `/dashboard/settings` → only Profile swaps to Settings; Dashboard stays

### Nested vs flat
| Flat | Nested |
|---|---|
| Replace whole page | Replace part of page |
| Simpler | More scalable |
| Small apps | Structured layouts |

### Try yourself
Remove `<Outlet />` from `Dashboard`. Navigate to `/dashboard/profile` — the child disappears.

### What happens if...?
...you over-nest small apps? Code becomes harder to follow. Keep nesting for shared layouts only.

### Quick check
1. Where do child routes render? → Inside `<Outlet />`.
2. What does `index: true` do? → Default child route.

### Common mistake
Forgetting `<Outlet />` in the parent, so children never appear.

---

## Outlet

### What?
`<Outlet />` is a placeholder. It tells React Router: "render the matched child route here."

### Why?
Needed whenever a route has `children`. Without it, child routes have nowhere to render.

### Code
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

### Passing data with Outlet (context)
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

### Key points
- Renders matched child routes
- Required for nested routes
- Does not control navigation
- Can pass data via context
- Works only in parents with children

### Try yourself
Add `context={{ user }}` to `<Outlet />` and read it in a child with `useOutletContext`.

### What happens if...?
...`<Outlet />` is missing? Child route never renders.

### Quick check
1. What renders inside `<Outlet />`? → The matched child route.
2. Can `<Outlet />` pass data? → Yes, via context.

### Common mistake
Treating `<Outlet />` like a component you import content into. It is just a slot.

---

## useNavigate

### What?
`useNavigate` returns a function to change the URL with JavaScript (programmatic navigation). Used inside functions, not JSX.

### Why?
Sometimes navigation depends on logic (form submit, login success). `<Link>` is for clicks; `useNavigate` is for code.

### Code
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

### Dynamic routes
```jsx
navigate(`/users/${id}`);
```
Works with routes like `{ path: "users/:id", element: <UserDetails /> }`.

### Replace instead of push
```jsx
navigate("/login", { replace: true });
```
Prevents going back to the previous page. Useful after login/logout.

### Back / forward
```jsx
navigate(-1); // go back
navigate(1);  // go forward
```

### useNavigate vs Link
| Link | useNavigate |
|---|---|
| Declarative | Imperative |
| Used in JSX | Used in functions |
| UI clicks | Logic-based redirects |
| Simple | Conditional |

Use `<Link>` for normal nav; `useNavigate` when logic decides.

### Common use cases
- Redirect after form submission
- Redirect after login/logout
- Navigation inside event handlers

### Try yourself
Add a "Go back" button calling `navigate(-1)` and test it after navigating twice.

### What happens if...?
...you call `navigate` during render instead of in an event? It can cause infinite loops. Call it in handlers/effects.

### Quick check
1. `useNavigate` is a hook or component? → Hook.
2. `{ replace: true }` does what? → Replaces history entry.

### Common mistake
Using `useNavigate` for simple clickable links. Use `<Link>` instead.

---

## Dynamic Route Parameters (useParams)

### What?
Dynamic segments (`:id`) let one route match many URLs like `/users/101`, `/users/202`. `useParams` reads the value.

### Why?
You cannot create a route per ID. Dynamic params make URLs data-driven.

### Code
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

### Try yourself
Change URL to `/users/999` and confirm `useParams` returns `"999"`.

### What happens if...?
...param name in route (`:id`) differs from destructure (`const { userId }`)? You get `undefined`. Names must match.

### Quick check
1. What symbol marks a dynamic segment? → `:`.
2. `useParams()` returns what? → An object of params.

### Common mistake
Forgetting the `:` in the path, making it a static route.

---

## Protected Routes

### What?
A protected route blocks access unless a condition (usually login) is true. Otherwise it redirects (e.g., to `/login`).

### Why?
Some pages (dashboard, profile, admin) must not be public.

### Code
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

### Flow
1. User opens `/dashboard`
2. `ProtectedRoute` runs
3. Check `isLoggedIn`
4. `false` → redirect to `/login`
5. `true` → render `Dashboard`

### Real auth source
Usually from Context, Redux, localStorage, or JWT:
```jsx
const isLoggedIn = localStorage.getItem("token");
```

### Navigate vs useNavigate
| Navigate | useNavigate |
|---|---|
| Component | Hook |
| Used in JSX return | Used in functions |
| Auto redirect | Programmatic |
| `<Navigate to="/login" />` | `navigate("/login")` |

### Common use cases
- Dashboard, profiles, order history
- Admin panels, settings

### Try yourself
Set `isLoggedIn = true` and confirm `/dashboard` renders. Set `false` and confirm redirect to `/login`.

### What happens if...?
...you check auth only in the component but not the route? Users can still hit the URL directly. Guard at the route.

### Quick check
1. What component redirects? → `<Navigate />`.
2. Where should auth be checked? → In the route guard.

### Common mistake
Reading auth from state that is not ready on first render, causing flicker or wrong redirect.

---

## useSearchParams

### What?
`useSearchParams` reads and updates **query parameters** (`?menu=display`) in the URL without refreshing.

### Why?
Query params store small UI state (filters, tabs, search) that should be shareable.

### Code
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

### How it works
- Click "Display Settings" → URL becomes `/settings?menu=display`
- Click "Audio Settings" → URL becomes `/settings?menu=audio`
- `searchParams.get("menu")` reads the value

### Simple definition
`useSearchParams` lets you read and update query parameters in the URL without refreshing the page.

### Try yourself
Add a third button "Privacy" setting `menu=privacy` and show a matching heading.

### What happens if...?
...you call `setSearchParams` with a string instead of an object? It may replace all params. Pass an object to keep it predictable.

### Quick check
1. Where do query params live? → After `?` in the URL.
2. Which hook reads them? → `useSearchParams`.

### Common mistake
Using query params for data that should be a route param, or vice versa.

---

## Final Recall
- React Router connects **URL → Component** without page refresh.
- Use `<Link>` / `useNavigate`, not `<a>`, for in-app nav.
- `main.jsx` uses `RouterProvider`; `router.jsx` maps `path` → `element`.
- Nested routes share layouts; children render in `<Outlet />`.
- `useParams` reads `:id` segments; `useSearchParams` reads `?query` values.
- Protected routes guard with `<Navigate />` based on auth state.
