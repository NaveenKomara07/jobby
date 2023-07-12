import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import './index.css'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    id,
    jobDescription,
    employmentType,
    location,
    rating,
    title,
  } = similarJobData

  return (
    <li className="similar-job-li-container">
      <div className="img-job-title-container">
        <img
          src={companyLogoUrl}
          className="company-job-logo"
          alt="similar job company logo"
        />
        <div className="title-job-rating">
          <h1 className="title-job-heading">{title}</h1>
          <div className="star-job-rating">
            <AiFillStar className="star-job-icon" />
            <p className="rating-job-text">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-container">
        <h1 className="description-job-heading">Description</h1>
        <p className="description-job-para">{jobDescription}</p>
      </div>
      <div className="job-details-container">
        <div className="job-icon">
          <MdLocationOn className="location-job-icon" />
          <p className="location-job">{location}</p>
        </div>
        <div className="employment-job-type">
          <p className="job-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
