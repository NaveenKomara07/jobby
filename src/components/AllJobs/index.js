import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'
import { each } from 'immer/dist/internal'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount = () => {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobsApiUrl,optionsJobs)
    if (responseJobs.ok === true){
        const fetchedDataJobs = await responseJobs.json()
        const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            employmentType : eachItem.employment_type,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            location: eachItem.location,
            packagePerAnnum: eachItem.package_per_annum,
            rating: eachItem.rating,
            title: eachItem.title,
        }))
        this.setState({
            jobsData: updatedDataJobs,
            apiJobStatus: apiJobsStatusConstants.success,
        })
    } else{
        this.setState({apiJobStatus: apiJobsStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
      this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
      const {checkboxInputs} = this.state
      const inputNotInList = checkboxInputs.filter(
          eachItem => eachItem === event.target.id,
          )
          if (inputNotInList.length === 0){
              this.setState(
                  prevState => ({
                      checkboxInputs : [...prevState.checkboxInputs, event.target.id],
                  }),
                  this.onGetJobDetails,
              )
          } else {
              const filteredData = checkboxInputs.filter(
                  eachItem => eachItem !== event.target.id,
              )
              this.setState(
                  prevState => ({checkboxInputs: filteredData}),
                  this.onGetJobDetails.
              )
          }
  }

  onGetProfileView = () => {
      const {profileData, responseSuccess} = this.state
      if (responseSuccess){
          const {name, profileImageUrl, shortBio} = profileData[0]
          return(
              <div className="profile-container">
                  <img src={profileImageUrl} className="profile-icon" alt="profile" />
                  <h1 className="profile-name">{name}</h1>
                  <p className="profile-description">{shortBio}</p>
              </div>
          )
      }
      return null
  }

  onRetryProfile = () => {
      this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
      <div className="failure-button-container">
          <button className="failure-button"
           type="button"
           onClick={this.onRetryProfile}
           >
               retry
           </button>
      </div>
  )

  renderLoadingView = () => {
      <div className="loader-spinner" data-testid="loader">
          <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
  }

}
