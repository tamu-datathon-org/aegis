import { useActiveUser, UserCurrentStatus, UserProvider } from '../../components/UserProvider';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Navbar } from '../../components/Navbar';

function Home(): JSX.Element {
  const { user, status } = useActiveUser();
  const router = useRouter();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selected, setSelected] = useState("")

  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = "/auth/login?r=/apply";
    }
  }, [status])

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
      const response = await fetch('/apply/api/admin/getAllApplications');
      const data = await response.json();
      setApplicants(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllApplications();
  }, [])

  useEffect(() => {
    const getStats = async () => {
      try {
      const response = await fetch('/apply/api/admin/generateStats');
      const data = await response.json();
      } catch (error) {
        console.error(error);
      }
    }
    getStats();
  }, [])

  const Stats = () => {
    return (
      <div>Stats</div>
    );
  };

  const Applicants = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    }
    
    const filteredApplicants = applicants.filter((applicant) => {
        return (applicant.firstName.toLowerCase() + ' ' + applicant.lastName.toLowerCase()).includes(searchTerm.toLowerCase())
    });
    
    return (
      <div>
        <input value = {searchTerm} type="text" placeholder="Search by name" onChange={handleSearch} style={{marginBottom: "10px", padding: "0px", width: "350px"}} />
        {/* <button onClick={() => setSearchTerm('')}>Clear</button> */}
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>School</th>
            <th>Grad</th>
            <th>Classification</th>
            <th>Application Status</th>
          </tr>
          {filteredApplicants.map((applicant) => (
            <tr key={applicant.email}>
              <td>{applicant.firstName} {applicant.lastName} </td>
              <td>{applicant.email}</td>
              <td>{applicant.school}</td>
              <td>{applicant.anticipatedGradYear}</td>
              <td>{applicant.classification}</td>
              <td>{applicant.appStatus}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  };

  const Settings = () => {
    return (
      <div>Settings</div>
    );
  };

  const handleClick = (buttonLabel: SetStateAction<string>) => {
    setSelected(buttonLabel)
  }

  return (
    <>
      <Navbar/>
      <div className = "mainContent">
        <h1>ADMIN</h1>
        <div className="border-gradient border-gradient-purple" style={{alignItems: "center", height: "400px", padding: "10px"}}>

            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "50px"}}>
            <button onClick={() => handleClick("stats")}>Stats</button>
            <button onClick={() => handleClick("applicants")}>Applicants</button>
            <button onClick={() => handleClick("settings")}>Settings</button>
            </div>

            {selected === "stats" && <Stats />}
            {selected === "applicants" && <Applicants />}
            {selected === "settings" && <Settings />}
        </div>
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