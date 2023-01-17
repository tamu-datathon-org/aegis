import { useActiveUser, UserCurrentStatus, UserProvider } from '../../components/UserProvider';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import allSchools from './schools.json';
import Image from 'next/image';

function Home(): JSX.Element {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, status } = useActiveUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [classification, setClassification] = useState("");
  const [anticipatedGradYear, setAnticipatedgradYear] = useState("");
  const [gender, setGender] = useState("");
  const [selfDescribeAns, setSelfDescribeAns] = useState("");
  const [hackathonsAttended, setHackathonsAttended] = useState("");
  const [hasTeam, setHasTeam] = useState("");
  const [eventSource, setEventSource] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [address, setAddress] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [programmingJoke, setProgrammingJoke] = useState("");
  const [unlimitedResourcesBuild, setUnlimitedResourcesBuild] = useState("");
  const [hiddenTalent, setHiddenTalent] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [extraInfo, setExtraInfo] = useState("");



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
    
        // TODO: FIX THIS GARBAGE CODE
        if(data.firstName != null) {
          setFirstName(data.firstName);
        }
        
        if(data.lastName != null) {
          setLastName(data.lastName);
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

      } catch (error) {
        console.error(error);
      }
    }
    fetchApplication();
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('/apply/api/updateApplication', {
        appStatus: "Submitted",
        firstName,
        lastName,
        school,
        major,
        classification,
        anticipatedGradYear,
        gender,
        selfDescribeAns,
        hackathonsAttended,
        hasTeam,
        eventSource,
        shirtSize,
        address,
        referenceLinks,
        programmingJoke,
        unlimitedResourcesBuild,
        hiddenTalent,
        dietaryRestrictions,
        extraInfo
      });
      if(response.status == 201) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSchools = allSchools.filter(currSchool => currSchool.schoolName.toLowerCase().includes(searchQuery?.toLowerCase()));
  const visibleSchools = filteredSchools.slice(0, 7);

  return (
    <>
      <div className = "horizontal">
        <div className="relativeContainer">
          <div className = "navBanner">
            <h1 className = "navText">TAMU Datathon 2023 Applications</h1>
            <Link href="/"><div className = "navButton"><div className = "navText">Dashboard</div></div></Link>
            <Link href="/application"><div className = "navButtonCurrDir"><div className = "navText">Application</div></div></Link>
            {!user?.isAdmin ? (
              <></>
              ) : (
                <Link href="/admin"><div className = "navButton"><div className = "navText">Admin</div></div></Link>
              )}
            <a href={`/auth/logout?r=${process.browser ? window.location.pathname : `${router.basePath}${router.asPath}`.replace(/\/$/, '')}`}>
              <div className = "navButton"><div className = "navText">Logout</div></div>
            </a>
            <Image alt="TD Logo" width={300} height={300} src="https://tamudatathon.com/static/img/logos/main-22.webp"></Image>
          </div>
        </div>

        <div className = "mainContent">
          <form onSubmit={handleSubmit}>
          <h1>APPLICATION</h1>
            <div className = "vertical">
              <label className = "requiredField">First name:</label>
              <input type="text" value={firstName} onChange={event => setFirstName(event.target.value)}/>

              <label className = "requiredField">Last name:</label>
              <input type="text" value={lastName} onChange={event => setLastName(event.target.value)}/>

              <label className = "requiredField"> What school do you go to? </label>
              <div className="helperText">Currently selected school: {school}</div>
              <input type="text" value={searchQuery} onChange={event => {
              setSearchQuery(event.target.value);
              setShowResults(true);
              }} onBlur={() => setShowResults(false)} onFocus={() => setShowResults(true)} placeholder="Search for a school" />
              {showResults && 
                <ul>
                  {visibleSchools.map((currSchool, index) => (
                    <li className = "suggestion-item" key={index} onMouseDown={() => {setSchool(currSchool.schoolName); setSearchQuery(currSchool.schoolName)}}>
                        {currSchool.schoolName}
                    </li>
                  ))}
                </ul>
              }

              <label className = "requiredField"> What's your major? </label>
              <input type = "text" value={major} onChange={event => setMajor(event.target.value)}/>

              <label className = "requiredField"> What classification are you? </label>
              <select value = {classification} onChange={event => setClassification(event.target.value)}>
                <option value="">---------</option>
                <option value="Fr">Freshman</option>
                <option value="So">Sophomore</option>
                <option value="Jr">Junior</option>
                <option value="Sr">Senior</option>
                <option value="Ma">Master's Student</option>
                <option value="PhD">PhD Student</option>
                <option value="O">Other</option>
              </select>

              {/* TODO: Determine if 2028 is an actual graduation year LOL */}
              <label className = "requiredField"> What is your anticipated graduation year?</label>
              <select value = {anticipatedGradYear} onChange={event => setAnticipatedgradYear(event.target.value)}>
                <option value="">---------</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

              <label className = "requiredField"> What's your gender? </label>
              <select value = {gender} onChange={event => setGender(event.target.value)}>
                <option value="">---------</option>
                <option value="NA">Prefer not to answer</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="NB">Non-binary</option>
                <option value="X">Prefer to self-describe</option>
              </select>

              {gender === "X" ? (
                <>
                  <label> Please self-describe </label>
                  <input type = "text" value={selfDescribeAns} onChange={event => setSelfDescribeAns(event.target.value)} placeholder="Please self-describe" />
                </>
              ) : (
                <></>
              )}

              {/* TODO: Add what race(s) do you identify with? */}

              <label className = "requiredField"> How many hackathons have you attended? </label>
              <select value = {hackathonsAttended} onChange={event => setHackathonsAttended(event.target.value)}>
                <option value="">---------</option>
                <option value="0">This will be my first!</option>
                <option value="1-3">1-3</option>
                <option value="4-7">4-7</option>
                <option value="8-10">8-10</option>
                <option value="10+">10+</option>
              </select>

              {/* TODO: Add "What technical skills do you have?" */}
              <label className = "requiredField"> Do you have a team yet? </label>
              <select value = {hasTeam} onChange={event => setHasTeam(event.target.value)}>
                <option value="">---------</option>
                <option value="No">I do have a team</option>
                <option value="Yes">I do not have a team</option>
              </select>

              {/* TODO: Find out if we use the TAMU Engineering newsletter lol */}
              <label className = "requiredField"> How did you hear about TAMU Datathon? </label>
              <select value = {eventSource} onChange={event => setEventSource(event.target.value)}>
                <option value="">---------</option>
                <option value="Friend">From a friend</option>
                <option value="Yard Sign">Yard sign</option>
                <option value="Social Media">Social media</option>
                <option value="Student Orgs">Through another student org</option>
                <option value="TD Organizer">From a TAMU Datathon organizer</option>
                <option value="ENGR Newsletter">From the TAMU Engineering Newsletter</option>
                <option value="MLH">Major League Hacking (MLH)</option>
                <option value="Attended Before">I've attended TAMU Datathon before</option>
              </select>

              <label className = "requiredField">What size shirt do you wear?</label>
              <select value = {shirtSize} onChange={event => setShirtSize(event.target.value)}>
                <option value="">---------</option>
                <option value="WXXS">Women's XXS</option>
                <option value="WXS">Women's XS</option>
                <option value="WS">Women's S</option>
                <option value="WM">Women's M</option>
                <option value="WL">Women's L</option>
                <option value="WXL">Women's XL</option>
                <option value="WXXL">Women's XXL</option>
                <option value="XXS">Unisex XXS</option>
                <option value="XS">Unisex XS</option>
                <option value="S">Unisex S</option>
                <option value="M">Unisex M</option>
                <option value="L">Unisex L</option>
                <option value="XL">Unisex XL</option>
                <option value="XXL">Unisex XXL</option>
              </select>

              <label>Address:</label>
              <input type = "text" value={address} onChange={event => setAddress(event.target.value)} placeholder="Enter a location" />
              <div className="helperText">You will not receive swag and prizes without an address.</div>

              {/* TODO: Upload your resume and use S3 AmazonAWS (if budget approved LMAO)*/}
              <label>Point us to anything you'd like us to look at while considering your application:</label>
              <input type = "text" value={referenceLinks} onChange={event => setReferenceLinks(event.target.value)} placeholder="ex. GitHub, Devpost, personal website, LinkedIn, etc." />

              <label className = "requiredField"> Tell us your best programming joke. </label>
              <textarea value={programmingJoke} onChange={event => setProgrammingJoke(event.target.value)}/>
              
              <label className = "requiredField"> What is the one thing you'd build if you had unlimited resources? </label>
              <textarea value={unlimitedResourcesBuild} onChange={event => setUnlimitedResourcesBuild(event.target.value)}/>

              <label className = "requiredField"> What's your hidden talent? </label>
              <textarea value={hiddenTalent} onChange={event => setHiddenTalent(event.target.value)}/>

              <label>Do you require any special accommodations at the event? Please list all dietary restrictions here.</label>
              <textarea value={dietaryRestrictions} onChange={event => setDietaryRestrictions(event.target.value)}/>

              <label>Anything else you would like us to know?</label>
              <textarea value={extraInfo} onChange={event => setExtraInfo(event.target.value)}/>

              <button type="submit">Submit application</button>
            </div>
          </form>
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