import { useActiveUser, UserCurrentStatus, UserProvider } from '../../components/UserProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import allSchools from './schools.json';
import countriesData from './countries.json';
import { useToasts } from '@geist-ui/react';
import { Navbar } from '@/components/Navbar';

function Home(): JSX.Element {
  const router = useRouter();

  // for filtering with searchable lists (custom)
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [countryShowResults, setCountryShowResults] = useState(false);

  const { user, status } = useActiveUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [race, setRace] = useState('');
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
  const [interestReason, setInterestReason] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [mlhQ1, setmlhQ1] = useState(false);
  const [mlhQ2, setmlhQ2] = useState(false);
  const [mlhQ3, setmlhQ3] = useState(false);
  const [liabilityTerms, setLiabilityTerms] = useState(false);

  const [resume, setResume] = useState<File | null>(null);

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

        if(data.age != null) {
            setAge(data.age);
        }
        
        if(data.country != null) {
            setCountry(data.country);
            setCountrySearchQuery(data.country);
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

        if(data.race != null) {
            setRace(data.race);
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

        if(data.interestReason != null) {
            setInterestReason(data.interestReason);
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

        if(data.liabilityTerms != null) {
            setLiabilityTerms(data.liabilityTerms);
        }

        if(data.resume != null) {
            setResume(data.resume);
        }

      } catch (error) {
        console.error(error);
      }
    }

    fetchApplication();
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, setToast: any) => {
    event.preventDefault();

    const fieldsToValidate = [
        { variable: firstName, label: 'First Name' },
        { variable: lastName, label: 'Last Name' },
        { variable: age, label: 'Age' },
        { variable: country, label: 'Country' },
        { variable: school, label: 'School' },
        { variable: major, label: 'Major' },
        { variable: classification, label: 'Classification' },
        { variable: anticipatedGradYear, label: 'Anticipated Graduation Year' },
        { variable: gender, label: 'Gender' },
        { variable: race, label: 'Race/Ethnicity' },
        { variable: hackathonsAttended, label: 'Hackathons Attended' },
        { variable: experienceLevel, label: 'Experience Level' },
        { variable: hasTeam, label: 'Has a Team' },
        { variable: eventSource, label: 'Event Source' },
        { variable: shirtSize, label: 'Shirt Size' },
        { variable: programmingJoke, label: 'Programming Joke' },
        { variable: unlimitedResourcesBuild, label: 'Unlimited Resources Build' },
        { variable: interestReason, label: 'Interest Reason' },
    ];
    
    const missingFields = [];
    
    for (let i = 0; i < fieldsToValidate.length; i++) {
        const field = fieldsToValidate[i];
        const fieldValue = field.variable.trim();
        
        if (fieldValue === '') {
            missingFields.push(field.label);
        }
    }

    if(!resume)
        missingFields.push("Resume file");

    if(!mlhQ1)
        missingFields.push("MLH question 1");

    if(!mlhQ2)
        missingFields.push("MLH question 2");

    if(!liabilityTerms)
        missingFields.push("TAMU Datathon Talent Release and Liability Terms");
    
    if (missingFields.length > 0) {
        const missingFieldsList = missingFields.join(', ');
        const errorMessage = `Please fill in all required fields: ${missingFieldsList}`;
        setToast({ text: errorMessage, type: 'error', delay: 3000 });
        return;
    }

    try {
        const response = await axios.post('/apply/api/updateApplication', {
        appStatus: 'Submitted',
        authId: user?.authId,
        firstName,
        lastName,
        age,
        country,
        phoneNumber,
        school,
        major,
        classification,
        anticipatedGradYear,
        gender,
        selfDescribeAns,
        race,
        hackathonsAttended,
        experienceLevel,
        hasTeam,
        eventSource,
        shirtSize,
        address,
        referenceLinks,
        programmingJoke,
        unlimitedResourcesBuild,
        interestReason,
        dietaryRestrictions,
        extraInfo,
        mlhQ1,
        mlhQ2,
        mlhQ3,
        liabilityTerms
      });

      const formData = new FormData();

      const file = resume;

      const filename = encodeURIComponent(file?.name || "");
      const fileType = encodeURIComponent(file?.type || "");
    
      const res = await fetch(
        `/apply/api/upload-url?fileType=${fileType}&firstName=${firstName}&lastName=${lastName}`
      )
      const { url, fields } = await res.json()
      
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const upload = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if(response.status == 201 && res.status == 200) {
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
        setResume(e.target.files?.[0]!);
  };


  const filteredSchools = allSchools.filter(currSchool => currSchool.schoolName.toLowerCase().includes(searchQuery?.toLowerCase()));
  const visibleSchools = filteredSchools.slice(0, 7);

  const filteredCountries = countriesData.filter(currCountry => currCountry.name.toLowerCase().includes(countrySearchQuery?.toLowerCase()));
  const visibleCountries = filteredCountries.slice(0, 7);

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

              <div className='input-wrapper'>
                <label htmlFor='age' className = 'requiredField'>Age:</label>
                <select id="age" value={age} onChange={event => setAge(event.target.value)} required>
                    <option value=''>---------</option>
                    <option value="16-">16 or younger</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24+">24 or older</option>
                </select>              
               </div>

              <div className='input-wrapper'>
                <label htmlFor='country' className = 'requiredField'>Country of Residence:</label>
                <div className='helperText'>Currently selected country: {country}</div>
                <input type='text' id='country' value={countrySearchQuery} onChange={event => {
                // removes autocomplete locally (so it doesn't block our search results)
                event.target.setAttribute('autocomplete', 'off');
                setCountrySearchQuery(event.target.value);
                setCountryShowResults(true);
                }} onBlur={() => setCountryShowResults(false)} onFocus={() => setCountryShowResults(true)} placeholder='Search for a country' />
                {countryShowResults && 
                  <ul style={{margin: 0}}>
                    {visibleCountries.map((currCountry, index) => (
                      <li className = 'suggestion-item' key={index} onMouseDown={() => {setCountry(currCountry.name); setCountrySearchQuery(currCountry.name)}}>
                          {currCountry.name}
                      </li>
                    ))}
                  </ul>
                }
                </div>

              <div className='input-wrapper'>
                <label htmlFor='phoneNumber'>Phone number:</label>
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
                <select id='major' value={major} onChange={(event) => setMajor(event.target.value)} required>
                    <option value=''>---------</option>
                    <option value='Computer science, computer engineering, or software engineering'>
                        Computer science, computer engineering, or software engineering
                    </option>
                    <option value='Another engineering discipline'>
                        Another engineering discipline (such as civil, electrical, mechanical, etc.)
                    </option>
                    <option value='Information systems, information technology, or system administration'>
                        Information systems, information technology, or system administration
                    </option>
                    <option value='A natural science (such as biology, chemistry, physics, etc.)'>
                        A natural science (such as biology, chemistry, physics, etc.)
                    </option>
                    <option value='Mathematics or statistics'>
                        Mathematics or statistics
                    </option>
                    <option value='Web development or web design'>
                        Web development or web design
                    </option>
                    <option value='Business discipline (such as accounting, finance, marketing, etc.)'>
                        Business discipline (such as accounting, finance, marketing, etc.)
                    </option>
                    <option value='Humanities discipline (such as literature, history, philosophy, etc.)'>
                        Humanities discipline (such as literature, history, philosophy, etc.)
                    </option>
                    <option value='Social science (such as anthropology, psychology, political science, etc.)'>
                        Social science (such as anthropology, psychology, political science, etc.)
                    </option>
                    <option value='Fine arts or performing arts (such as graphic design, music, studio art, etc.)'>
                        Fine arts or performing arts (such as graphic design, music, studio art, etc.)
                    </option>
                    <option value='Health science (such as nursing, pharmacy, radiology, etc.)'>
                        Health science (such as nursing, pharmacy, radiology, etc.)
                    </option>
                    <option value='Other (please specify)'>Other (please specify)</option>
                    <option value='Undecided / No Declared Major'>Undecided / No Declared Major</option>
                    <option value='My school does not offer majors / primary areas of study'>My school does not offer majors / primary areas of study</option>
                    <option value='Prefer not to answer'>Prefer not to answer</option>
                </select>
            </div>

              <div className='input-wrapper'>
                <label htmlFor='classification' className = 'requiredField'> What classification are you? </label>
                <select value = {classification} id='classification' onChange={event => setClassification(event.target.value)} required>
                    <option value=''>---------</option>
                    <option value='LessThanSecondary'>Less than Secondary / High School</option>
                    <option value='Secondary'>Secondary / High School</option>
                    <option value='Undergrad2Year'>Undergraduate University (2 year - community college or similar)</option>
                    <option value='Undergrad3PlusYear'>Undergraduate University (3+ year)</option>
                    <option value='Graduate'>Graduate University (Masters, Professional, Doctoral, etc)</option>
                    <option value='CodeSchool'>Code School / Bootcamp</option>
                    <option value='Vocational'>Other Vocational / Trade Program or Apprenticeship</option>
                    <option value='PostDoc'>Post Doctorate</option>
                    <option value='Other'>Other</option>
                    <option value='NotStudent'>I’m not currently a student</option>
                    <option value='PreferNotToAnswer'>Prefer not to answer</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='anticipatedGradYear' className = 'requiredField'> What is your anticipated graduation year?</label>
                <select value = {anticipatedGradYear} id='anticipatedGradYear' onChange={event => setAnticipatedgradYear(event.target.value)} required>
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
                <label htmlFor='gender' className = 'requiredField'> What's your gender? </label>
                <select value = {gender} id='gender' onChange={event => setGender(event.target.value)}>
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


             <div className='input-wrapper'>
                <label htmlFor='race' className = 'requiredField'> What race(s) do you identify with? </label>
                <select value={race} id='race' onChange={event => setRace(event.target.value)} required>
                <option value=''>---------</option>
                <option value='Asian Indian'>Asian Indian</option>
                <option value='Black or African'>Black or African</option>
                <option value='Chinese'>Chinese</option>
                <option value='Filipino'>Filipino</option>
                <option value='Guamanian or Chamorro'>Guamanian or Chamorro</option>
                <option value='Hispanic / Latino / Spanish Origin'>Hispanic / Latino / Spanish Origin</option>
                <option value='Japanese'>Japanese</option>
                <option value='Korean'>Korean</option>
                <option value='Middle Eastern'>Middle Eastern</option>
                <option value='Native American or Alaskan Native'>Native American or Alaskan Native</option>
                <option value='Native Hawaiian'>Native Hawaiian</option>
                <option value='Samoan'>Samoan</option>
                <option value='Vietnamese'>Vietnamese</option>
                <option value='White'>White</option>
                <option value='Other Asian (Thai, Cambodian, etc)'>Other Asian (Thai, Cambodian, etc)</option>
                <option value='Other Pacific Islander'>Other Pacific Islander</option>
                <option value='Other (Please Specify)'>Other (Please Specify)</option>
                <option value='Prefer Not to Answer'>Prefer Not to Answer</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='hackathonsAttended' className = 'requiredField'> How many hackathons have you attended? </label>
                <select value = {hackathonsAttended} id='hackathonsAttended' onChange={event => setHackathonsAttended(event.target.value)} required>
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
                <label htmlFor='experienceLevel' className = 'requiredField'> What is your experience level in Data Science? </label>
                <select value = {experienceLevel} id='experienceLevel' onChange={event => setExperienceLevel(event.target.value)} required>
                  <option value=''>---------</option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Advanced'>Advanced</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='hasTeam' className = 'requiredField'> Do you have a team yet? </label>
                <select id='hasTeam' value = {hasTeam} onChange={event => setHasTeam(event.target.value)} required>
                  <option value=''>---------</option>
                  <option value='No'>I do have a team</option>
                  <option value='Yes'>I do not have a team</option>
                </select>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='eventSource' className = 'requiredField'> How did you hear about TAMU Datathon? </label>
                <select id='eventSource' value = {eventSource} onChange={event => setEventSource(event.target.value)} required>
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
                <label htmlFor='shirtSize' className = 'requiredField'>What size shirt do you wear?</label>
                <select id='shirtSize' value = {shirtSize} onChange={event => setShirtSize(event.target.value)} required>
                  <option value=''>---------</option>
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
                <label htmlFor='address' className = 'requiredField'>Upload your resume (PDF only, 1MB max):</label>
                <input type="file" required accept="application/pdf" onChange={handleFileChange}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='reflinks'>Point us to anything you'd like us to look at while considering your application:</label>
                <input type = 'text' id ='reflinks' value={referenceLinks} onChange={event => setReferenceLinks(event.target.value)} placeholder='ex. GitHub, Devpost, personal website, LinkedIn, etc.' />
              </div>

              <div className='input-wrapper'>
                <label htmlFor='programmingJoke' className = 'requiredField'> Tell us your best programming joke. </label>
                <textarea id='programmingJoke' required value={programmingJoke} onChange={event => setProgrammingJoke(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='unlimitedResourcesBuild' className = 'requiredField'> What is the one thing you'd build if you had unlimited resources? </label>
                <textarea id='unlimitedResourcesBuild' required value={unlimitedResourcesBuild} onChange={event => setUnlimitedResourcesBuild(event.target.value)}/>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='interestReason' className = 'requiredField'> What drives your interest in being a part of TAMU Datathon? </label>
                <textarea id='interestReason' required value={interestReason} onChange={event => setInterestReason(event.target.value)}/>
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
                <label htmlFor='mlhQ1' className="requiredField">
                    I have read and agree to the <a className="mlh" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ1" required className="checkBox" checked={mlhQ1} onChange={event => setmlhQ1(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='mlhQ2' className="requiredField">
                    I authorize you to share my application / registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the <a className="mlh" href="https://mlh.io/privacy">MLH Privacy Policy</a>. I further agree to the terms of both the <a className="mlh" href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">MLH Contest Terms and Conditions</a> and the <a className="mlh" href="https://mlh.io/privacy">MLH Privacy Policy</a>.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ2" required className="checkBox" checked={mlhQ2} onChange={event => setmlhQ2(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='mlhQ3'>
                    I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.
                </label>
                <div>
                    <input type="checkbox" id="mlhQ3" className="checkBox" checked={mlhQ3} onChange={event => setmlhQ3(event.target.checked)}/>
                </div>
              </div>

              <div className='input-wrapper'>
                <label htmlFor='liabilityTerms' className="requiredField">
                    I agree to TAMU Datathon's <a className="mlh" href="https://tamudatathon.com/legal/talent_liability_terms">Talent Release and Liability terms</a>.
                </label>
                <div>
                    <input type="checkbox" id="liabilityTerms" className="checkBox" checked={liabilityTerms} onChange={event => setLiabilityTerms(event.target.checked)}/>
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