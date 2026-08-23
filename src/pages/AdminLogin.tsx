import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [githubAvailable, setGithubAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/status')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          navigate('/admin');
          return;
        }
        setGithubAvailable(Boolean(data.githubOauthAvailable));
        if (!data.githubOauthAvailable) {
          setError('GitHub admin login is not configured yet.');
        }
      })
      .catch(() => setError('Unable to contact the authentication service.'))
      .finally(() => setChecking(false));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
          Admin Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Sign in with the authorized GitHub account to manage the portfolio CMS.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-200">
          {error && (
            <div className="mb-5 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
              {error}
            </div>
          )}

          <a
            href={githubAvailable ? "/api/auth/github" : undefined}
            aria-disabled={!githubAvailable || checking}
            className={`flex w-full justify-center items-center gap-2 rounded-md border py-2.5 px-4 text-sm font-medium shadow-sm transition-colors ${
              githubAvailable && !checking
                ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                : 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {checking ? 'Checking...' : 'Sign in with GitHub'}
          </a>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Only the configured administrator GitHub account is allowed.
          </p>
        </div>
      </div>
    </div>
  );
}
