import { useActiveUser, UserCurrentStatus, UserProvider } from '../../components/UserProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import allSchools from './schools.json';
import { useToasts } from '@geist-ui/react';
import { Navbar } from '@/components/Navbar';

function Home(): JSX.Element {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, status } = useActiveUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [classification, setClassification] = useState('');
  const [anticipatedGradYear, setAnticipatedgradYear] = useState('');
  const [gender, setGender] = useState('');
  const [selfDescribeAns, setSelfDescribeAns] = useState('');
  const [hackathonsAttended, setHackathonsAttended] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [hasTeam, setHasTeam] = useState('');
  const [eventSource, setEventSource] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [address, setAddress] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [programmingJoke, setProgrammingJoke] = useState('');
  const [unlimitedResourcesBuild, setUnlimitedResourcesBuild] = useState('');
  const [hiddenTalent, setHiddenTalent] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [mlhQ1, setmlhQ1] = useState(false);
  const [mlhQ2, setmlhQ2] = useState(false);
  const [mlhQ3, setmlhQ3] = useState(false);

  const [resume, setResume] = useState<File | null>(null);
  const [fakeResumeName, setFakeResumeName] = useState('File not chosen');

  const [, setToast] = useToasts();

  useEffect(() => {
    if (status == UserCurrentStatus.LoggedOut) {
      (window as any).location = '/auth/login?r=/apply';
    }
  }, [status])
    
  useEffect(() => {
      const fetchApplication = async () => {
        try {
        const response = await fetch('/apply/api/getApplication');
        const data = await response.json();
    
        // TODO: FIX THIS GARBAGE CODE
        if(data.firstName != null) {
          setFirstName(data.firstName);
        }
        
        if(data.lastName != null) {
          setLastName(data.lastName);
        }

        if(data.country != null) {
            setCountry(data.country);
        }

        if(data.phoneNumber != null) {
            setPhoneNumber(data.phoneNumber);
        }

        if(data.school != null) {
          setSchool(data.school);
          setSearchQuery(data.school);
        }

        if(data.major != null) {
          setMajor(data.major);
        }

        if(data.classification != null) {
          setClassification(data.classification);
        }

        if(data.anticipatedGradYear != null) {
          setAnticipatedgradYear(data.anticipatedGradYear);
        }

        if(data.gender != null) {
          setGender(data.gender);
        }

        if(data.selfDescribeAns != null) {
          setSelfDescribeAns(data.selfDescribeAns);
        }

        if(data.experienceLevel != null) {
          setExperienceLevel(data.experienceLevel);
        }  

        if(data.hackathonsAttended != null) {
          setHackathonsAttended(data.hackathonsAttended);
        }

        if(data.hasTeam != null) {
          setHasTeam(data.hasTeam);
        }

        if(data.eventSource != null) {
          setEventSource(data.eventSource);
        }

        if(data.shirtSize != null) {
          setShirtSize(data.shirtSize);
        }

        if(data.address != null) {
          setAddress(data.address);
        }

        if(data.referenceLinks != null) {
          setReferenceLinks(data.referenceLinks);
        }

        if(data.programmingJoke != null) {
          setProgrammingJoke(data.programmingJoke);
        }

        if(data.unlimitedResourcesBuild != null) {
          setUnlimitedResourcesBuild(data.unlimitedResourcesBuild);
        }

        if(data.hiddenTalent != null) {
          setHiddenTalent(data.hiddenTalent);
        }

        if(data.dietaryRestrictions != null) {
          setDietaryRestrictions(data.dietaryRestrictions);
        }

        if(data.extraInfo != null) {
          setExtraInfo(data.extraInfo);
        }

        if(data.mlhQ1 != null) {
            setmlhQ1(data.mlhQ1);
        }

        if(data.mlhQ2 != null) {
            setmlhQ2(data.mlhQ2);
        }

        if(data.mlhQ3 != null) {
            setmlhQ3(data.mlhQ3);
        }

        if(data.resume != null) {
            setResume(data.resume);
        }

        if(data.fakeResumeName != null) {
            setFakeResumeName(data.fakeResumeName);
        }

      } catch (error) {
        console.error(error);
      }
    }

    fetchApplication();
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, setToast: any) => {
    event.preventDefault();

    // Validate each fieldf
    const fieldsToValidate = [
        firstName,
        lastName,
        school,
        major,
        classification,
        anticipatedGradYear,
        gender,
        experienceLevel,
        hackathonsAttended,
        hasTeam,
        eventSource,
        shirtSize,
        programmingJoke,
        unlimitedResourcesBuild,
        hiddenTalent,
    ];

    for (let i = 0; i < fieldsToValidate.length; i++) {
        const field = fieldsToValidate[i];
        
        if (field.trim() === '' || fakeResumeName === 'File not chosen')  {
        const t = 'Please fill in all required fields. Index: ' + i;
          setToast({ text: t, type: 'error', delay: 3000 });
          return;
        }
    }

    try {
        const response = await axios.post('/apply/api/updateApplication', {
        appStatus: 'Submitted',
        firstName,
        lastName,
        country,
        phoneNumber,
        school,
        major,
        classification,
        anticipatedGradYear,
        gender,
        experienceLevel,
        hackathonsAttended,
        hasTeam,
        eventSource,
        shirtSize,
        programmingJoke,
        unlimitedResourcesBuild,
        hiddenTalent,
        mlhQ1,
        mlhQ2,
        mlhQ3,
        fakeResumeName
      });

      const formData = new FormData();
      if(resume) {
        formData.append('resume', resume);
      }

      const response2 = await axios.post('apply/api/uploadResume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Set the content type
        },
      });

      if(response.status == 201 && response2.status == 201) {
        setToast({ text: 'Application received!', type: 'success', delay: 3000 });
      } else {
        throw new Error();
      }
    } catch (error) {
      setToast({ text: 'Failed to upload application. Error: ' + error, type: 'error', delay: 3000 });
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setResume(e.target.files[0]);
        setFakeResumeName(e.target.files[0].name);
    }
  };


  const filteredSchools = allSchools.filter(currSchool => currSchool.schoolName.toLowerCase().includes(searchQuery?.toLowerCase()));
  const visibleSchools = filteredSchools.slice(0, 7);

  return (
    <>
      <Navbar/>
        <div className = 'mainContent'>
          <h1>APPLICATION</h1>
          <form className="boxShadowContainer" onSubmit={(event) => handleSubmit(event, setToast)}>
            <div className = 'vertical' style={{alignItems: 'center'}}>
              <div className='input-wrapper'>
                <label htmlFor='firstName' className = 'requiredField'>First name:</label>
                <input type='text' required value={firstName} id='firstName' onChange={event => setFirstName(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='lastName' className = 'requiredField'>Last name:</label>
                <input type='text' required value={lastName} id='lastName' onChange={event => setLastName(event.target.value)}/>
              </div>

              {/* <div className='input-wrapper'>
                <label htmlFor='country'>Country of Residence:</label>
                <input type='text' value={country} id='country' onChange={event => setCountry(event.target.value)}/>
              </div> */}

              <div className='input-wrapper'>
                <label htmlFor='phoneNumber'>Phone number</label>
                <input type='text' value={phoneNumber} id='phoneNumber' onChange={event => setPhoneNumber(event.target.value)}/>
              </div>


              <div className='input-wrapper'>
                <label htmlFor='searchQuery' className = 'requiredField'> What school do you go to? </label>
                <div className='helperText'>Currently selected school: {school}</div>
                <input type='text' required id='searchQuery' value={searchQuery} onChange={event => {
                // removes autocomplete locally (so it doesn't block our search results)
                event.target.setAttribute('autocomplete', 'off');
                setSearchQuery(event.target.value);
                setShowResults(true);
                }} onBlur={() => setShowResults(false)} onFocus={() => setShowResults(true)} placeholder='Search for a school' />
                {showResults && 
                  <ul style={{margin: 0}}>
                    {visibleSchools.map((currSchool, index) => (
                      <li className = 'suggestion-item' key={index} onMouseDown={() => {setSchool(currSchool.schoolName); setSearchQuery(currSchool.schoolName)}}>
                          {currSchool.schoolName}
                      </li>
                    ))}
                  </ul>
                }
              </div>

              <div className='input-wrapper'>
                <label htmlFor='major' className = 'requiredField'> What's your major? </label>
                <input type='text' required value={major} id='major' onChange={event => setMajor(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='classification' className = 'requiredField'> What classification are you? </label>
                <select value = {classification} onChange={event => setClassification(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='Fr'>Freshman</option>
                  <option value='So'>Sophomore</option>
                  <option value='Jr'>Junior</option>
                  <option value='Sr'>Senior</option>
                  <option value='Ma'>Master's Student</option>
                  <option value='PhD'>PhD Student</option>
                  <option value='O'>Other</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='anticipatedGradYear' className = 'requiredField'> What is your anticipated graduation year?</label>
                <select value = {anticipatedGradYear} onChange={event => setAnticipatedgradYear(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='2023'>2023</option>
                  <option value='2024'>2024</option>
                  <option value='2025'>2025</option>
                  <option value='2026'>2026</option>
                  <option value='2027'>2027</option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label className = 'requiredField'> What's your gender? </label>
                <select value = {gender} onChange={event => setGender(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='NA'>Prefer not to answer</option>
                  <option value='M'>Male</option>
                  <option value='F'>Female</option>
                  <option value='NB'>Non-binary</option>
                  <option value='X'>Prefer to self-describe</option>
                </select>
              </div>

              {gender === 'X' ? (
                <>
                  <div className='input-wrapper'>
                    <label> Please self-describe </label>
                    <input type = 'text' value={selfDescribeAns} onChange={event => setSelfDescribeAns(event.target.value)} placeholder='Please self-describe' />
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* TODO: Add what race(s) do you identify with? */}

              <div className='input-wrapper'>
                <label className = 'requiredField'> How many hackathons have you attended? </label>
                <select value = {hackathonsAttended} onChange={event => setHackathonsAttended(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='0'>This will be my first!</option>
                  <option value='1-3'>1-3</option>
                  <option value='4-7'>4-7</option>
                  <option value='8-10'>8-10</option>
                  <option value='10+'>10+</option>
                </select>
              </div>

              {/* TODO forgor */}
              <div className='input-wrapper'>
                <label className = 'requiredField'> What is your experience level in Data Science? </label>
                <select value = {experienceLevel} onChange={event => setExperienceLevel(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Advanced'>Advanced</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label className = 'requiredField'> Do you have a team yet? </label>
                <select value = {hasTeam} onChange={event => setHasTeam(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='No'>I do have a team</option>
                  <option value='Yes'>I do not have a team</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label className = 'requiredField'> How did you hear about TAMU Datathon? </label>
                <select value = {eventSource} onChange={event => setEventSource(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='Friend'>From a friend</option>
                  <option value='Social Media'>Social media</option>
                  <option value='Student Orgs'>Through another student org</option>
                  <option value='TD Organizer'>From a TAMU Datathon organizer</option>
                  <option value='ENGR Newsletter'>From the TAMU Engineering Newsletter</option>
                  <option value='MLH'>Major League Hacking (MLH)</option>
                  <option value='Attended Before'>I've attended TAMU Datathon before</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
              
              <div className='input-wrapper'>
                <label className = 'requiredField'>What size shirt do you wear?</label>
                <select value = {shirtSize} onChange={event => setShirtSize(event.target.value)}>
                  <option value=''>---------</option>
                  <option value='XXS'>Unisex XXS</option>
                  <option value='XS'>Unisex XS</option>
                  <option value='S'>Unisex S</option>
                  <option value='M'>Unisex M</option>
                  <option value='L'>Unisex L</option>
                  <option value='XL'>Unisex XL</option>
                  <option value='XXL'>Unisex XXL</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='address'>Address:</label>
                <input type = 'text' id='address' value={address} onChange={event => setAddress(event.target.value)} placeholder='Enter a location' />
                <div className='helperText'>You will not receive swag and prizes without an address.</div>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='address' className = 'requiredField'>Upload your resume (PDF only):</label>
                <input type="file" accept=".pdf" onChange={handleFileChange} style={{color: "transparent"}}/>
                {fakeResumeName}
              </div>

              <div className='input-wrapper'>
                <label htmlFor='reflinks'>Point us to anything you'd like us to look at while considering your application:</label>
                <input type = 'text' id ='reflinks' value={referenceLinks} onChange={event => setReferenceLinks(event.target.value)} placeholder='ex. GitHub, Devpost, personal website, LinkedIn, etc.' />
              </div>

              <div className='input-wrapper'>
                <label htmlFor='programmingJoke' className = 'requiredField'> Tell us your best programming joke. </label>
                <textarea id='programmingJoke' value={programmingJoke} onChange={event => setProgrammingJoke(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='unlimitedResourcesBuild' className = 'requiredField'> What is the one thing you'd build if you had unlimited resources? </label>
                <textarea id='unlimitedResourcesBuild' value={unlimitedResourcesBuild} onChange={event => setUnlimitedResourcesBuild(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='hiddenTalent' className = 'requiredField'> What's your hidden talent? </label>
                <textarea id='hiddenTalent' value={hiddenTalent} onChange={event => setHiddenTalent(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='dietaryRestrictions'>Do you require any special accommodations at the event? Please list all dietary restrictions here.</label>
                <textarea id='dietaryRestrictions' value={dietaryRestrictions} onChange={event => setDietaryRestrictions(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='extraInfo'>Anything else you would like us to know?</label>
                <textarea id='extraInfo' value={extraInfo} onChange={event => setExtraInfo(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <div style={{fontStyle: 'italic'}}>We are currently in the process of partnering with MLH. The following 3 checkboxes are for this partnership. If we do not end up partnering with MLH, your information will not be shared.</div>
                <label className="requiredField">
                    I have read and agree to the <a className="mlh" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ1" className="checkBox" checked={mlhQ1} onChange={event => setmlhQ1(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <label className="requiredField">
                    I authorize you to share my application / registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the <a className="mlh" href="https://mlh.io/privacy">MLH Privacy Policy</a>. I further agree to the terms of both the <a className="mlh" href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">MLH Contest Terms and Conditions</a> and the <a className="mlh" href="https://mlh.io/privacy">MLH Privacy Policy</a>.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ2" className="checkBox" checked={mlhQ2} onChange={event => setmlhQ2(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <label>
                    I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ3" className="checkBox" checked={mlhQ3} onChange={event => setmlhQ3(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <button className='appButton' type='submit'>Submit application</button>
              </div>
            </div>
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