[browser] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (https://polite-gnu-50.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js:12:6133)
 GET /onboard 200 in 141ms (next.js: 13ms, application-code: 128ms)
[browser] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (https://polite-gnu-50.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js:12:6133)
 GET / 200 in 160ms (next.js: 10ms, application-code: 150ms)
⨯ Error: @clerk/react: useClerkSignal can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider
    at SignIn (src\lib\clerk.tsx:202:35)
  200 |   const [success, setSuccess] = useState(false);
  201 |
> 202 |   const realSignIn = useRealSignIn();
      |                                   ^
  203 |   
  204 |   let signInLoaded = false;
  205 |   let signInClient: any = null; {
  digest: '2336294487'
}
 GET /admin 500 in 1659ms (next.js: 257ms, application-code: 1402ms)
[browser] ClerkRuntimeError: Clerk: Failed to load Clerk JS

(code="failed_to_load_clerk_js")


    at rejectWith (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_shared_dist_19jkmrs._.js:7687:33)
    at loadClerkJSScript (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_shared_dist_19jkmrs._.js:7705:85)
    at IsomorphicClerk.getClerkJsEntryChunk (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:3147:294)
    at IsomorphicClerk.getEntryChunks (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:3126:38)
    at new IsomorphicClerk (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:3073:45)
    at IsomorphicClerk.getOrCreateInstance (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:2387:343)
    at useLoadedIsomorphicClerk (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:3311:224)
    at ClerkProviderBase (http://localhost:3000/_next/static/chunks/node_modules_%40clerk_react_dist_18embk1._.js:3292:46)
    at Object.react_stack_bottom_frame (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:15037:24)
    at renderWithHooks (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:4620:24)
    at updateFunctionComponent (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:6081:21)
    at beginWork (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:6691:24)
    at runWithFiberInDEV (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:965:74)
    at performUnitOfWork (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:9555:97)
    at workLoopSync (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:9449:40)
    at renderRootSync (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:9433:13)
    at performWorkOnRoot (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:9061:186)
    at performWorkOnRootViaSchedulerTask (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_react-dom_096_9a-._.js:10255:9)
    at MessagePort.performWorkUntilDeadline (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_1amofcm._.js:2647:64) 
⨯ Error: @clerk/react: useClerkSignal can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider
    at SignIn (src\lib\clerk.tsx:202:35)
  200 |   const [success, setSuccess] = useState(false);
  201 |
> 202 |   const realSignIn = useRealSignIn();
      |                                   ^
  203 |   
  204 |   let signInLoaded = false;
  205 |   let signInClient: any = null; {
  digest: '2336294487'
}
 GET /admin 500 in 241ms (next.js: 10ms, application-code: 231ms)
