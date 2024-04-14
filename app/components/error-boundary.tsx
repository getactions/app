import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "@remix-run/react";

export function ErrorBoundary() {
  const location = useLocation();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container flex flex-col gap-6 py-4">
        <div className="flex flex-col items-center gap-2">
          <picture>
            <source
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.webp"
              type="image/webp"
            />
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.gif"
              alt="🛸"
              width="128"
              height="128"
            />
          </picture>
          <h2 className="text-4xl font-extrabold text-center">
            Where is this page?
          </h2>
          <h3 className="text-xl text-snow">
            Sorry, but I can't find this page:
          </h3>
          <pre className="whitespace-pre-wrap break-all text-body-lg mt-4">
            {location.pathname}
          </pre>
          <Link to="/" className="text-body-md underline mt-4 text-pink">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return <h1>Unknown Error</h1>;
}
