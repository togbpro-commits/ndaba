## Error Type
Runtime Error

## Error Message

Clerk: The <SignIn/> component is not configured correctly. The most likely reasons for this error are:

1. The "/admin" route is not a catch-all route.
It is recommended to convert this route to a catch-all route, eg: "/admin/[[...rest]]/page.tsx". Alternatively, you can update the <SignIn/> component to use hash-based routing by setting the "routing" prop to "hash".

2. The <SignIn/> component is mounted in a catch-all route, but all routes under "/admin" are protected by the middleware.
To resolve this, ensure that the middleware does not protect the catch-all route or any of its children. If you are using the "createRouteMatcher" helper, consider adding "(.*)" to the end of the route pattern, eg: "/admin(.*)". For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#create-route-matcher


Next.js version: 16.2.10 (Turbopack)
