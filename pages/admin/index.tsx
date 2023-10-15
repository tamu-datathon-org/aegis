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

  const fetchAllApplications = async () => {
    try {
    const response = await fetch('/apply/api/admin/getAllApplications');
    const data = await response.json();
    setApplicants(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
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
    //total applicants
    const totalApplicants = applicants.length;
    //shirt sizes
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const sizeCounts = sizes.map((size) => {
      return {
        size: size,
        count: applicants.filter((applicant) => {
          return (applicant.shirtSize === size);
      }).length
    }});
    //vegetarians
    const numVegetarianVegan = applicants.filter((applicant) => {
        const lowerRestrictions = applicant.dietaryRestrictions.toLowerCase();
        return (lowerRestrictions.indexOf("vegetarian") > -1 || lowerRestrictions.indexOf("vegan") > -1);
    }).length;
    //grad students
    const totalGradStudents = applicants.filter((applicant) => {
      return applicant.classification === "Graduate";
    }).length;
    //applicants by school
    const schoolCounts: Record<string, number> = {};
    applicants.forEach((applicant) => {
      if(schoolCounts[applicant.school] !== undefined) {
        schoolCounts[applicant.school] += 1;
      }
      else {
        schoolCounts[applicant.school] = 1;
      }
    });
    return (
      <div>
        <h6>Total Applicants: {totalApplicants}</h6>
        <h6>Total Grad Students: {totalGradStudents}</h6>
        <h6>Vegetarian/Vegan: {numVegetarianVegan}</h6>
        <h6>Shirt Size Counts:</h6>
        {sizeCounts.map((size, index) => (
          <p key={index}>{size.size}: {size.count}
          </p> 
        ))
        }
        <h6>Applicants By School:</h6>
        {Object.keys(schoolCounts).map(school => (
          <p key={school}>{school}: {schoolCounts[school]}</p>
        ))}
      </div>
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

    const deleteApplicant = async (email: string) => {
      try {
        await fetch("/apply/api/admin/deleteApplicant", {
          method: "POST",
          body: JSON.stringify({email: email}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        fetchAllApplications();
      } catch(err) {
        console.error(err)
      }
    }

    const rejectApplicant = async (email: string) => {
      try {
        await fetch("/apply/api/admin/rejectApplicant", {
          method: "POST",
          body: JSON.stringify({email: email}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        fetchAllApplications();
      } catch (err) {
        console.error(err)
      }
    }

    const acceptApplicant = async (email: string) => {
      try {
        await fetch("/apply/api/admin/acceptApplicant", {
          method: "POST",
          body: JSON.stringify({email: email}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        fetchAllApplications();
      } catch(err) {
        console.error(err)
      }
    }
    
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
            <th>Actions</th>
          </tr>
          {filteredApplicants.map((applicant) => (
            <tr key={applicant.email}>
              <td>{applicant.firstName} {applicant.lastName} </td>
              <td>{applicant.email}</td>
              <td>{applicant.school}</td>
              <td>{applicant.anticipatedGradYear}</td>
              <td>{applicant.classification}</td>
              <td>{applicant.appStatus}</td>
              <td>
                <div style={{display: "flex", justifyContent: "space-evenly", columnGap: "8px"}}>
                  <button type='button' style={{width: "24px", height: "24px"}} onClick={() => {acceptApplicant(applicant.email)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>

                  <button type='button' style={{width: "24px", height: "24px"}} onClick={() => {rejectApplicant(applicant.email)}}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  </button>

                  {/* <button type='button' style={{width: "24px", height: "24px"}} onClick={() => deleteApplicant(applicant.email)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button> */}
                </div>
              </td>
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
        <div style={{alignItems: "center", height: "400px", padding: "10px"}}>

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