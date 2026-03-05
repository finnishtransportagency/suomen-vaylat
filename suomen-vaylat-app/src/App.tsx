import { useEffect, useState } from 'react';
import './resources/css/_colors.scss';
import './resources/css/custom.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';
import { HandleSharedWebSiteLink } from './components/share-website/HandleSharedWebSiteLink';
import Theme from './theme/theme';
import { setLoggedInUser } from './state/slices/rpcSlice';
import { useAppDispatch } from './state/hooks';
import { IS_EXTRANET } from './utils/appInfoUtil';

const StyledAppContainer = styled.div`
  width: 100%;
  height: var(--app-height);
  margin: 0;
  padding: 0;

  a {
    color: #0064af;
  }
`;

export async function fetchSession() {
  try {
    // Use manual so we can see redirect responses before the browser follows them.
    const res = await fetch('/session', {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      redirect: 'manual'
    });

    // If server intentionally returned JSON with redirect info (recommended)
    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, data };
    }

    // If fetch saw a 302/3xx: some browsers will expose the status (same-origin),
    // but for cross-origin redirects you may get an "opaqueredirect" type or a 0 status.
    if (
      res.type === 'opaqueredirect' ||
      (res.status >= 300 && res.status < 400)
    ) {
      //window.location.href = "/";
      return { ok: false, redirectTriggered: true };
    }

    // Standard auth failures if server returns 401/403
    if (res.status === 401 || res.status === 403) {
      // server might include { redirect } in body for XHR; try to read it.

      //try { body = await res.json(); } catch (e) { /* ignore */ }
      //if (body.redirect) {
      //  window.location.href = body.redirect;
      //  return { ok: false, redirectTriggered: true };
      //}
      //window.location.href = "/";
      return { ok: false, roles: [], user: null };
    }

    // Unexpected status: try to read body for diagnostics
    let txt = '';
    try {
      txt = await res.text();
    } catch (e) {
      /* ignore */
    }
    throw new Error(`Failed to fetch session: status=${res.status} ${txt}`);
  } catch (err: any) {
    // Network failures, CORS blocks, etc. will be caught here.
    console.error('fetchSession error:', err);
    // If you get a CORS redirect block, fallback to full navigation so auth can proceed:
    // This is useful if fetch failed because the server 302 led to a cross-origin resource
    // that doesn't allow CORS; a full browser navigation will succeed.
    // Only do this if you actually want to interrupt the app flow:
    // window.location.href = "/session";
    return { ok: false, error: err.message, roles: [], user: null };
  }
}
/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
const App = () => {
  const dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!IS_EXTRANET) return;
    async function fetchData() {
      // You can await here

      if (!isLoggedIn) {
        console.info('haetaan sessio');
        const { ok, data } = await fetchSession();
        if (ok) {
          dispatch(setLoggedInUser(data));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }

      //   {
      //   user: {
      //      uid: 'K1233454567',
      //      email: 'mock@example.com',
      //      lastLogin: '2025-09-01T15:27:12Z',
      //      etunimi: 'Etu',
      //      sukunimi: "Suku"
      //    },
      //   roles: ["user", "reader", "kaivaja"],
      //   }
    }
    fetchData();
  }, [dispatch, isLoggedIn]);

  let routerPrefix = '/';

  const appContainer = (
    <StyledAppContainer>
      <HandleSharedWebSiteLink />
      <PageTitle />
      <Layout />
    </StyledAppContainer>
  );

  return !IS_EXTRANET && isLoggedIn? (
    <>
      Logging in progress, please wait or refresh page and try again later. If
      problem continues contact paikkatieto@vayla.fi
    </>
  ) : (
    <Theme>
      <Routes>
        <Route
          path={routerPrefix}
          element={
            <StyledAppContainer>
              <PageTitle />
              <Layout />
            </StyledAppContainer>
          }
        />
        <Route
          path={routerPrefix + 'theme/:zoom/:x/:y/:themeId/:lang?'}
          element={appContainer}
        />
        <Route
          path={routerPrefix + 'link/:zoom/:x/:y/:maplayers/:lang?'}
          element={appContainer}
        />
      </Routes>
</Theme>
  );
};

export default App;
