import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const router = useRouter();
  const [appStatus, setAppStatus] = useState("Loading...");


  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = "/auth/login?r=/apply";
    }
  }, [status])


  useEffect(() => {
    const fetchApplication = async () => {
      try {
      const response = await fetch('/apply/api/getApplication');
      const data = await response.json();

      if(data.appStatus != null) {
        setAppStatus(data.appStatus);
      } else {
        setAppStatus("Incomplete");
      }

      } catch (error) {
        console.error(error);
      }
    }
    fetchApplication();
  }, [])

  return (
    <>
      <div className = "horizontal">
        <div className="relativeContainer">
          <div className = "navBanner">
            <h1 className = "navText">TAMU Datathon 2023 Applications</h1>
            <Link href="/"><div className = "navButtonCurrDir"><div className = "navText">Dashboard</div></div></Link>
            {/* <Link href="/application"><div className = "navButton"><div className = "navText">Application</div></div></Link> */}
            {!user?.isAdmin ? (
              <></>
              ) : (
                <Link href="/admin"><div className = "navButton"><div className = "navText">Admin</div></div></Link>
              )}
            <a href={`/auth/logout?r=${process.browser ? window.location.pathname : `${router.basePath}${router.asPath}`.replace(/\/$/, '')}`}>
              <div className = "navButton"><div className = "navText">Logout</div></div>
            </a>
            <Image alt="TD Logo" src="https://tamudatathon.com/static/img/logos/main-22.webp"></Image>
          </div>
        </div>

        {/* <div className="relativeContainer2"> */}
          <div className = "mainContent">
            <h1>DASHBOARD</h1>

            <form>
              <div>APPLICATION STATUS: </div>
              {appStatus.toUpperCase()}

              <Link href="/application"><div className = "navButton">Edit your application</div></Link>
            </form>
          </div>
        {/* </div> */}

      </div>
    </>
  );

}

export default function HomePage() {
  return (
    <UserProvider>
      <Home/>
    </UserProvider>
  )
}