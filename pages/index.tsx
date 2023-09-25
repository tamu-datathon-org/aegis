import { useActiveUser, UserCurrentStatus, UserProvider } from '../components/UserProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

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
    <Navbar/>
    <div className = "mainContent">
      <h1>DASHBOARD</h1>

      <form className="vertical boxShadowContainer" style={{alignItems: "center", height: "50vh", width: "75vw", padding: "10px"}}>
        <div className="dashboardText">APPLICATION STATUS:</div>
        <div className="dashStatus">{appStatus.toUpperCase()}</div>
        <button className="editButton"><Link className="dashboardText buttonText" href="/application">Edit your application</Link></button>
      </form>
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