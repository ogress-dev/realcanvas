// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher(['/TuSaiChi(.*)']);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) {
//     auth.protect();
//   }
// });

// Simple middleware placeholder
export default function middleware() {
  // No auth middleware
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
