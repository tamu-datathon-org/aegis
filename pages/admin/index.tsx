import { useActiveUser, UserCurrentStatus, UserProvider } from '../../components/UserProvider';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Navbar } from '../../components/Navbar';
import axios from 'axios';

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
    //beginner/advanced
    const experienceLevels = ['Beginner', 'Advanced'];
    const experienceCounts = experienceLevels.map((level) => {
      return {
        level:level,
        count: applicants.filter((applicant) => {
          return (applicant.experienceLevel === level);
        }).length
      }
    });
    //grad students
    const totalGradStudents = applicants.filter((applicant) => {
      return applicant.classification === "Graduate";
    }).length;
    //applicants by school, veg/vegan and halal
    const schoolCounts: Record<string, number> = {};
    const dietaryCounts: Record<string, number> = {};
    dietaryCounts['mentions vegetarian/vegan only'] = 0;
    dietaryCounts['mentions halal only'] = 0;
    dietaryCounts['mentions both halal, vegetarian/vegan'] = 0;
    applicants.forEach((applicant) => {
      //check dietary restrictions
      const lowerRestrictions = applicant.dietaryRestrictions.toLowerCase();
      const containsHalal = lowerRestrictions.indexOf('halal') >= 0;
      const containsVegetarian = lowerRestrictions.indexOf('vegetarian') >= 0 ||
        lowerRestrictions.indexOf('vegeterian') >= 0 ||
        lowerRestrictions.indexOf('vegan') >= 0;
      if(containsHalal && containsVegetarian) {
        dietaryCounts['mentions both halal, vegetarian/vegan'] += 1;
      }
      else if(containsHalal) {
        dietaryCounts['mentions halal only'] += 1;
      }
      else if(containsVegetarian) {
        dietaryCounts['mentions vegetarian/vegan only'] += 1;
      }
      //check school
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
        <h6>Dietary Restrictions:</h6>
        {Object.keys(dietaryCounts).map(restriction => (
          <p key={restriction}>{restriction}: {dietaryCounts[restriction]}</p>
        ))}
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
        <h6>Experience Levels:</h6>
        {
          experienceCounts.map((level, index) => (
            <p key={index}>{level.level}: {level.count}
            </p>
          ))
        }
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
        // await fetch("/apply/api/admin/deleteApplicant", {
        //   method: "POST",
        //   body: JSON.stringify({email: email}),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        fetchAllApplications();
      } catch(err) {
        console.error(err)
      }
    }

    const rejectApplicant = async (email: string, firstName: string, lastName: string) => {
      try {

        const shouldReject = confirm(`Are you sure you want to reject ${firstName} ${lastName}?`);
        if(!shouldReject) {
          return;
        }

        await fetch("/apply/api/admin/rejectApplicant", {
          method: "POST",
          body: JSON.stringify({email: email, firstName: firstName, lastName: lastName}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        fetchAllApplications();
      } catch (err) {
        console.error(err)
      }
    }

    const acceptApplicant = async (email: string, firstName: string, lastName: string) => {
      try {

        const shouldAccept = window.confirm(`Are you sure you want to accept ${firstName} ${lastName}?`);
        if(!shouldAccept) {
          return;
        }

        await fetch("/apply/api/admin/acceptApplicant", {
          method: "POST",
          body: JSON.stringify({email: email, firstName: firstName, lastName: lastName}),
          headers: {
            "Content-Type": "application/json",
          },
        });

        fetchAllApplications();
      } catch(err) {
        console.error(err)
      }
    }

    const viewApplicant = async (email: string) => {
      // open in new window
        window.open(`/apply/admin/${email}`, '_blank');
    }
    
    return (
      <div>
        <input value = {searchTerm} type="text" placeholder="Search by name" onChange={handleSearch} style={{marginBottom: "10px", padding: "0px", width: "350px"}} />
        {/* <button onClick={() => setSearchTerm('')}>Clear</button> */}
        <table> 
          <tbody>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>School</th>
                <th>Grad</th>
                <th>Age</th>
                <th>Application Status</th>
                <th>Actions</th>
            </tr>
            {filteredApplicants.map((applicant) => (
                <tr key={applicant.email}>
                <td>{applicant.firstName} {applicant.lastName} </td>
                <td>{applicant.email}</td>
                <td>{applicant.school}</td>
                <td>{applicant.anticipatedGradYear}</td>

                {applicant.age ? (
                    applicant.age < 18 || applicant.age == '16-' ? (
                        <td style={{color: "red"}}>{applicant.age} !! (under 18)</td>
                    ) : (
                        <td>{applicant.age}</td>
                    )
                ) : (
                    <td style={{color: "blue"}}>{applicant.age} Missing. Resubmit plz</td>
                )}

                <td>{applicant.appStatus}</td>
                <td>
                    <div style={{display: "flex", justifyContent: "space-evenly", columnGap: "8px"}}>
                    <button type='button' style={{width: "24px", height: "24px"}} onClick={() => {acceptApplicant(applicant.email, applicant.firstName, applicant.lastName)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </button>

                    <button type='button' style={{width: "24px", height: "24px"}} onClick={() => {rejectApplicant(applicant.email, applicant.firstName, applicant.lastName)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>

                    {/* <button type='button' style={{width: "24px", height: "24px"}} onClick={() => deleteApplicant(applicant.email)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button> */}

                    <button type='button' style={{width: "24px", height: "24px"}} onClick={() => {viewApplicant(applicant.email)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512">
                        <g>
                            <path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z"/>
                        </g>
                        </svg>
                    </button>
                    </div>
                </td>
                </tr>
            
          ))}
          </tbody>
        </table>
      </div>
    );
  };

  const Settings = () => {
    return (
      <div>Settings</div>
    );
  };
  const Dietary = () => {
    const restrictedApplicants = applicants.filter((applicant) => {
      return applicant.dietaryRestrictions.trim() !== "";
    });
    return <div>
      Dietary
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Restrictions</th>
          </tr>
          {restrictedApplicants.map((applicant) => (
            <tr key={applicant.email}>
              <td>{applicant.firstName} {applicant.lastName}</td>
              <td>{applicant.dietaryRestrictions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  }

  const handleClick = (buttonLabel: SetStateAction<string>) => {
    setSelected(buttonLabel)
  }

  
  if(!user?.isAdmin) {
    return (
        <div>
        <h1>You are not authorized to view this service.</h1>
        </div>
    )
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
            <button onClick={() => handleClick("dietary")}>Dietary Restrictions</button>
            </div>

            {selected === "stats" && <Stats />}
            {selected === "applicants" && <Applicants />}
            {selected === "settings" && <Settings />}
            {selected === "dietary" && <Dietary />}
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