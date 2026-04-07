import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { employees } from '../data/employees'
import Header from './Header'
import Footer from './Footer'
import {
  Rocket, Heart, Lightbulb, ShieldCheck, Globe, BarChart3,
  Users, Eye, Target
} from 'lucide-react'

function getPhoto(emp) {
  if (!emp.photo) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=15151f&color=0cf&size=128&font-size=0.4&bold=true`
  }
  const baseUrl = import.meta.env.BASE_URL || '/'
  if (emp.photo.startsWith('/') && baseUrl !== '/') {
    return `${baseUrl}${emp.photo.slice(1)}`
  }
  return emp.photo
}

const sdeIds = ['sahil-gupta', 'naresh-kose']

const internIds = [
  'ayush-paradkara', 'bhumi-singh', 'ashutosh-dwivedi',
  'siddharth-lodhi', 'ankit-kuswaha', 'pravesh-tripati',
  'vasu-sethiya', 'prince-sulekhiya', 'suhani-deshmukh',
  'utkarsh-sharma', 'ashish-kumar', 'affan-ahmad',
  'bharti-sahu', 'shivam-suryawanshi', 'harshit-mishra', 'talib'
]

const traineeIds = [
  'pushpraj-patel', 'kunal-sutrakar',
  'mayank-sahu', 'aaditya-raj',
  'anshika-sarathe', 'raunak-dhanotiya'
]

function shortRole(title) {
  if (title === 'Software Development Engineer') return 'Software\nDevelopment\nEngineer'
  if (title.includes('(SDE-1)')) return 'SDE-1'
  if (title.includes('Lead')) return 'Team Lead'
  if (title.includes('RevOps') || title.includes('Revenue')) return 'Revenue Operations (...'
  if (title.includes('Software Development')) return 'Software Developme...'
  return title.length > 22 ? title.slice(0, 20) + '...' : title
}

const TeamDirectory = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { memberName } = useParams()
  const [photoModal, setPhotoModal] = useState({ isOpen: false, photo: '', name: '' })

  const openPhotoModal = (photo, name) => {
    setPhotoModal({ isOpen: true, photo, name })
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closePhotoModal = () => {
    setPhotoModal({ isOpen: false, photo: '', name: '' })
    document.body.style.overflow = 'unset' // Restore scrolling
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && photoModal.isOpen) {
        closePhotoModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [photoModal.isOpen])
  
  // State for expandable content
  const [expandedSkills, setExpandedSkills] = useState({})
  const [expandedIntros, setExpandedIntros] = useState({})
  
  // Helper functions for expanding content
  const toggleSkills = (memberId) => {
    setExpandedSkills(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }))
  }
  
  const toggleIntro = (memberId) => {
    setExpandedIntros(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }))
  }

  // Helper function to render expandable skills
  const renderExpandableSkills = (member) => {
    if (!member.keySkills || member.keySkills.length === 0) return null
    
    return (
      <div className="member-card-skills">
        <h5 className="skills-title">KEY SKILLS</h5>
        <div className="skills-tags">
          {(expandedSkills[member.id] ? member.keySkills : member.keySkills.slice(0, 3)).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {member.keySkills.length > 3 && (
            <span 
              className="skill-tag more" 
              onClick={() => toggleSkills(member.id)}
              style={{ cursor: 'pointer' }}
            >
              {expandedSkills[member.id] ? 'Show less' : `+${member.keySkills.length - 3} more`}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Helper function to render expandable intro
  const renderExpandableIntro = (member) => {
    return (
      <div className="member-card-intro">
        <h5 className="intro-title">PROFESSIONAL INTRO</h5>
        <p className="intro-text">
          {member.professionalIntro ? 
            (expandedIntros[member.id] || member.professionalIntro.length <= 150 ? 
              member.professionalIntro : 
              `${member.professionalIntro.substring(0, 150)}...`
            ) : 
            'Professional introduction not available.'
          }
          {member.professionalIntro && member.professionalIntro.length > 150 && (
            <span 
              className="expand-link"
              onClick={() => toggleIntro(member.id)}
              style={{ cursor: 'pointer', color: '#00c6ff', marginLeft: '5px', fontWeight: '500' }}
            >
              {expandedIntros[member.id] ? 'Show less' : 'Read more'}
            </span>
          )}
        </p>
      </div>
    )
  }
  
  const ceo = employees.find(e => e.id === 'kaustubh-singh')
  const cto = employees.find(e => e.id === 'yash-singh')
  const tl = employees.find(e => e.id === 'saurabh-patle')
  const revOps = employees.find(e => e.id === 'revenue-ops')

  const sdeGroup = sdeIds.map(id => employees.find(e => e.id === id)).filter(Boolean)
  const internGroup = internIds.map(id => employees.find(e => e.id === id)).filter(Boolean)
  const traineeGroup = traineeIds.map(id => employees.find(e => e.id === id)).filter(Boolean)

  // Function to determine section for a member
  const getMemberSection = (memberId) => {
    if (memberId === 'kaustubh-singh' || memberId === 'yash-singh') {
      return 'leadership'
    }
    if (memberId === 'saurabh-patle') {
      return 'technology'
    }
    if (memberId === 'revenue-ops') {
      return 'revenue-operations'
    }
    if (sdeIds.includes(memberId)) {
      return 'sde-1'
    }
    if (internIds.includes(memberId)) {
      return 'software-development-engineer'
    }
    if (traineeIds.includes(memberId)) {
      return 'software-development-engineer'
    }
    return 'team'
  }

  // Function to get member name for URL
  const getMemberUrlName = (memberId) => {
    const member = employees.find(e => e.id === memberId)
    if (member) {
      return member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    return memberId
  }

  // Function to find member by URL name
  const findMemberByUrlName = (urlName) => {
    return employees.find(member => {
      const memberUrlName = member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return memberUrlName === urlName
    })
  }

  // Function to scroll to member card and update URL
  const scrollToMember = (memberId) => {
    const memberCard = document.getElementById(`member-card-${memberId}`)
    if (memberCard) {
      // Update URL (use push instead of replace for proper back button behavior)
      const section = getMemberSection(memberId)
      const memberName = getMemberUrlName(memberId)
      console.log(`Navigating to: /${section}/${memberName} for member: ${memberId}`)
      navigate(`/${section}/${memberName}`)
      
      // Scroll to card with a slight delay to ensure navigation completes
      setTimeout(() => {
        memberCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        
        // Add highlight effect
        memberCard.classList.add('highlight-card')
        setTimeout(() => {
          memberCard.classList.remove('highlight-card')
        }, 2000)
      }, 100)
    } else {
      console.log(`Member card not found for: ${memberId}`)
    }
  }

  // Handle URL-based navigation and scroll behavior
  useEffect(() => {
    console.log('useEffect triggered. memberName:', memberName, 'pathname:', location.pathname)
    if (memberName) {
      // If there's a memberName in URL, scroll to that member
      const member = findMemberByUrlName(memberName)
      console.log('Found member for URL name:', member)
      if (member) {
        // Delay to ensure DOM is ready
        setTimeout(() => {
          const memberCard = document.getElementById(`member-card-${member.id}`)
          console.log('Member card found:', memberCard)
          if (memberCard) {
            memberCard.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
            memberCard.classList.add('highlight-card')
            setTimeout(() => {
              memberCard.classList.remove('highlight-card')
            }, 2000)
          }
        }, 500)
      }
    } else {
      // If no memberName (base URL), scroll to top with a slight delay
      console.log('No memberName, scrolling to top')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }, [memberName, location.pathname])

  return (
    <div className="main-page">
      {/* New Header */}
      <Header />

      {/* ========== ORG TREE (exact hierarchy) ========== */}
      <div className="org-tree-container">
        <ul className="org-tree">
          {/* Level 1: CEO */}
          <li>
            <div 
              onClick={() => scrollToMember(ceo.id)} 
              className="node ceo-node"
              style={{ cursor: 'pointer' }}
            >
              <div className="node-photo">
                <img 
                  src={getPhoto(ceo)} 
                  alt={ceo.name} 
                  onClick={(e) => {
                    e.stopPropagation()
                    openPhotoModal(getPhoto(ceo), ceo.name)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="node-name">{ceo.name}</div>
              <div className="node-role">Founder & CEO</div>
            </div>

            <ul>
              {/* Level 2: CTO */}
              <li>
                <div 
                  onClick={() => scrollToMember(cto.id)} 
                  className="node cto-node"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="node-photo">
                    <img 
                      src={getPhoto(cto)} 
                      alt={cto.name} 
                      onClick={(e) => {
                        e.stopPropagation()
                        openPhotoModal(getPhoto(cto), cto.name)
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="node-name">{cto.name}</div>
                  <div className="node-role">CTO</div>
                </div>

                <ul>
                  {/* Level 3: TL & RevOps */}
                  <li>
                    <div className="trunk-nodes">
                      {/* Sub-level trunk: Saurabh (Team Lead) */}
                      <div 
                        onClick={() => scrollToMember(tl.id)} 
                        className="node tl-node"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="node-photo">
                          <img 
                            src={getPhoto(tl)} 
                            alt={tl.name} 
                            onClick={(e) => {
                              e.stopPropagation()
                              openPhotoModal(getPhoto(tl), tl.name)
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <div className="node-name">{tl.name}</div>
                        <div className="node-role">Team Lead</div>
                      </div>

                      {/* Asymmetric branch: Prachi (RevOps) */}
                      <div className="prachi-branch">
                        <div className="prachi-h-line" />
                        <div className="prachi-v-line" />
                        <div 
                          onClick={() => scrollToMember(revOps.id)} 
                          className="node revops-node"
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="node-photo">
                            <img 
                              src={getPhoto(revOps)} 
                              alt={revOps.name} 
                              onClick={(e) => {
                                e.stopPropagation()
                                openPhotoModal(getPhoto(revOps), revOps.name)
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                          <div className="node-name">{revOps.name}</div>
                          <div className="node-role">Revenue Operations (...</div>
                        </div>
                      </div>
                    </div>

                    {/* Level 4: The 3 team groups (SDE, Software Development Engineer, Software Development Engineer) */}
                    <ul className="teams-row">
                      <li>
                        <div className="team-group group-sde">
                          {/* <div className="team-group-label">SDE</div> */}
                          <div className="team-group-grid">
                            {sdeGroup.map(m => (
                              <div 
                                key={m.id} 
                                onClick={() => scrollToMember(m.id)} 
                                className="team-member"
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="tm-photo">
                                  <img 
                                    src={getPhoto(m)} 
                                    alt={m.name} 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openPhotoModal(getPhoto(m), m.name)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="tm-name">{m.name}</div>
                                <div className="tm-role">{shortRole(m.jobTitle)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="team-group group-intern">
                          {/* <div className="team-group-label">INTERNS</div> */}
                          <div className="team-group-grid">
                            {internGroup.map(m => (
                              <div 
                                key={m.id} 
                                onClick={() => scrollToMember(m.id)} 
                                className="team-member"
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="tm-photo">
                                  <img 
                                    src={getPhoto(m)} 
                                    alt={m.name} 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openPhotoModal(getPhoto(m), m.name)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="tm-name">{m.name}</div>
                                <div className="tm-role">{shortRole(m.jobTitle)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="team-group group-trainee">
                          {/* <div className="team-group-label">TRAINEES</div> */}
                          <div className="team-group-grid">
                            {traineeGroup.map(m => (
                              <div 
                                key={m.id} 
                                onClick={() => scrollToMember(m.id)} 
                                className="team-member"
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="tm-photo">
                                  <img 
                                    src={getPhoto(m)} 
                                    alt={m.name} 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openPhotoModal(getPhoto(m), m.name)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="tm-name">{m.name}</div>
                                <div className="tm-role">{shortRole(m.jobTitle)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* TEAM DIRECTORY - Member Cards */}
      <div className="team-directory-section">
        <h2 className="team-directory-title">Team Directory</h2>
        <p className="team-directory-subtitle">Discover all CloudNexus team members.</p>

        {/* Leadership Section */}
        <div className="member-section">
          <div className="member-section-header">
            <h3 className="member-section-title">Leadership</h3>
            <span className="member-count">{[ceo, cto].filter(Boolean).length} members</span>
          </div>
          
          <div className="member-cards-grid">
            {/* CEO Card */}
            {ceo && (
              <div id={`member-card-${ceo.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(ceo)} 
                      alt={ceo.name} 
                      onClick={() => openPhotoModal(getPhoto(ceo), ceo.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{ceo.name}</h4>
                    <p className="member-card-title">{ceo.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{ceo.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{ceo.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{ceo.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{ceo.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{ceo.timeZone}</span>
                  </div>
                </div>

                {ceo.keySkills && ceo.keySkills.length > 0 && (
                  <div className="member-card-skills">
                    <h5 className="skills-title">KEY SKILLS</h5>
                    <div className="skills-tags">
                      {(expandedSkills[ceo.id] ? ceo.keySkills : ceo.keySkills.slice(0, 3)).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                      {ceo.keySkills.length > 3 && (
                        <span 
                          className="skill-tag more" 
                          onClick={() => toggleSkills(ceo.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {expandedSkills[ceo.id] ? 'Show less' : `+${ceo.keySkills.length - 3} more`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="member-card-intro">
                  <h5 className="intro-title">PROFESSIONAL INTRO</h5>
                  <p className="intro-text">
                    {ceo.professionalIntro ? 
                      (expandedIntros[ceo.id] || ceo.professionalIntro.length <= 150 ? 
                        ceo.professionalIntro : 
                        `${ceo.professionalIntro.substring(0, 150)}...`
                      ) : 
                      'Professional introduction not available.'
                    }
                    {ceo.professionalIntro && ceo.professionalIntro.length > 150 && (
                      <span 
                        className="expand-link"
                        onClick={() => toggleIntro(ceo.id)}
                        style={{ cursor: 'pointer', color: '#00c6ff', marginLeft: '5px', fontWeight: '500' }}
                      >
                        {expandedIntros[ceo.id] ? 'Show less' : 'Read more'}
                      </span>
                    )}
                  </p>
                </div>

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTO Card */}
            {cto && (
              <div id={`member-card-${cto.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(cto)} 
                      alt={cto.name} 
                      onClick={() => openPhotoModal(getPhoto(cto), cto.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{cto.name}</h4>
                    <p className="member-card-title">{cto.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{cto.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{cto.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{cto.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{cto.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{cto.timeZone}</span>
                  </div>
                </div>

                {cto.keySkills && cto.keySkills.length > 0 && (
                  <div className="member-card-skills">
                    <h5 className="skills-title">KEY SKILLS</h5>
                    <div className="skills-tags">
                      {(expandedSkills[cto.id] ? cto.keySkills : cto.keySkills.slice(0, 3)).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                      {cto.keySkills.length > 3 && (
                        <span 
                          className="skill-tag more" 
                          onClick={() => toggleSkills(cto.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {expandedSkills[cto.id] ? 'Show less' : `+${cto.keySkills.length - 3} more`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {renderExpandableIntro(cto)}

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technology Section - Only Saurabh */}
        <div className="member-section">
          <div className="member-section-header">
            <h3 className="member-section-title">Technology</h3>
            <span className="member-count">1 member</span>
          </div>
          
          <div className="member-cards-grid">
            {/* Team Lead Card - Saurabh */}
            {tl && (
              <div id={`member-card-${tl.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(tl)} 
                      alt={tl.name} 
                      onClick={() => openPhotoModal(getPhoto(tl), tl.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{tl.name}</h4>
                    <p className="member-card-title">{tl.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{tl.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{tl.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{tl.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{tl.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{tl.timeZone}</span>
                  </div>
                </div>

                {renderExpandableSkills(tl)}

                {renderExpandableIntro(tl)}

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Operations Section - Only Prachi */}
        <div className="member-section">
          <div className="member-section-header">
            <h3 className="member-section-title">Revenue Operations</h3>
            <span className="member-count">1 member</span>
          </div>
          
          <div className="member-cards-grid">
            {revOps && (
              <div id={`member-card-${revOps.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(revOps)} 
                      alt={revOps.name} 
                      onClick={() => openPhotoModal(getPhoto(revOps), revOps.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{revOps.name}</h4>
                    <p className="member-card-title">{revOps.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{revOps.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{revOps.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{revOps.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{revOps.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{revOps.timeZone}</span>
                  </div>
                </div>

                {renderExpandableSkills(revOps)}

                {renderExpandableIntro(revOps)}

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SDE-1 Section - Sahil and Naresh */}
        <div className="member-section">
          <div className="member-section-header">
            <h3 className="member-section-title">SDE-1</h3>
            <span className="member-count">{sdeGroup.length} members</span>
          </div>
          
          <div className="member-cards-grid">
            {sdeGroup.map((member) => (
              <div key={member.id} id={`member-card-${member.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(member)} 
                      alt={member.name} 
                      onClick={() => openPhotoModal(getPhoto(member), member.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{member.name}</h4>
                    <p className="member-card-title">{member.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{member.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{member.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{member.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{member.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{member.timeZone}</span>
                  </div>
                </div>

                {renderExpandableSkills(member)}

                {renderExpandableIntro(member)}

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Software Development Engineer Section */}
        <div className="member-section">
          <div className="member-section-header">
            <h3 className="member-section-title">Software Development Engineer</h3>
            <span className="member-count">{internGroup.length + traineeGroup.length} members</span>
          </div>
          
          <div className="member-cards-grid">
            {[...internGroup, ...traineeGroup].map((member) => (
              <div key={member.id} id={`member-card-${member.id}`} className="member-card">
                <div className="member-card-header">
                  <div className="member-card-avatar">
                    <img 
                      src={getPhoto(member)} 
                      alt={member.name} 
                      onClick={() => openPhotoModal(getPhoto(member), member.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="member-card-info">
                    <h4 className="member-card-name">{member.name}</h4>
                    <p className="member-card-title">{member.jobTitle}</p>
                  </div>
                </div>
                
                <div className="member-card-details">
                  <div className="member-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{member.location}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{member.contact}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{member.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Date of joining:</span>
                    <span className="detail-value">{member.dateOfJoining}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="detail-label">Time Zone:</span>
                    <span className="detail-value">{member.timeZone}</span>
                  </div>
                </div>

                {renderExpandableSkills(member)}

                {renderExpandableIntro(member)}

                <div className="member-card-footer">
                  <div className="social-links">
                    <div className="social-link">LinkedIn</div>
                    <div className="social-link">GitHub</div>
                    <div className="social-link">Portfolio</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WHO WE ARE */}
      <div className="section" id="about">
        <div className="section-label">About CloudNexus</div>
        <h2 className="section-title">Who <span>we are</span></h2>
        <div className="section-underline" />
        <div className="who-we-are-card">
          <p>
            At CloudNexus, we are more than just an IT consulting company. We are innovators,
            problem-solvers, and architects of the digital future. We specialize in providing
            modern IT solutions that help businesses remain competitive, efficient, and secure
            in an era where technology is at the core of every business decision.
          </p>
          <p>
            Our team of technology experts, strategists, and problem solvers collaborate
            closely with clients to deliver tailored solutions that enhance efficiency, drive
            growth, and accelerate innovation — from cloud migration and software development
            to automation and cybersecurity.
          </p>
          <div className="who-pills">
            <span className="who-pill"><span className="who-pill-dot" />Cloud Migration</span>
            <span className="who-pill"><span className="who-pill-dot" />AI &amp; Automation</span>
            <span className="who-pill"><span className="who-pill-dot" />Cybersecurity</span>
            <span className="who-pill"><span className="who-pill-dot" />Software Development</span>
            <span className="who-pill"><span className="who-pill-dot" />Digital Strategy</span>
          </div>
        </div>
      </div>
      {/* WHY CLOUDNEXUS */}
      <div className="section">
        <h2 className="section-title">Why <span>CloudNexus?</span></h2>
        <p className="section-body" style={{ marginTop: 12 }}>
          Choosing the right technology partner is crucial for business success. At CloudNexus,
          we do not just offer IT solutions — we create transformative experiences that drive
          innovation, efficiency, and growth.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <Rocket size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Innovative &amp; scalable solutions</h4>
            <p>We leverage the latest advancements in cloud computing, AI, and automation to build future-ready IT solutions.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <Heart size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Tailored approach</h4>
            <p>Every business is unique, and so are our solutions. We align digital solutions with specific business goals.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <Lightbulb size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Product-driven innovation</h4>
            <p>By combining creative and analytical approaches, we build digital products that drive simplicity, innovation, efficiency, and scalability.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <ShieldCheck size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Security &amp; reliability</h4>
            <p>Cybersecurity and data protection are at the core of everything we do. Our security-first approach protects your business.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <Globe size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Expert team &amp; global experience</h4>
            <p>We bring deep industry knowledge and extensive experience, helping enterprises navigate the global technology landscape.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
              <BarChart3 size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4>Business-centric results</h4>
            <p>Our focus is on delivering tangible business results, optimizing efficiency, improving productivity, and reducing costs.</p>
          </div>
        </div>
        <div className="feature-card-center-wrap">
          <div className="feature-card">
            <div className="fc-icon" style={{ background: 'rgba(0,204,255,0.06)', margin: '0 auto 22px' }}>
              <Users size={22} color="#00ccff" strokeWidth={1.5} />
            </div>
            <h4 style={{ textAlign: 'center' }}>End-to-end support</h4>
            <p style={{ textAlign: 'center' }}>From initial consultation to post-deployment support, we offer end-to-end services to ensure your IT ecosystem is running smoothly 24/7.</p>
          </div>
        </div>
      </div>
      {/* VISION & MISSION */}
      <div className="section" id="vision">
        <h2 className="section-title">Our <span>vision &amp; mission</span></h2>
        <div className="vm-grid">
          <div className="vm-card">
            <div className="vm-card-header">
              <div className="vm-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
                <Eye size={18} color="#00ccff" strokeWidth={1.5} />
              </div>
              <h4>Vision</h4>
            </div>
            <p>
              To be the global leader in IT solutions and digital product innovation, empowering
              businesses with cutting-edge technology that enhances efficiency, scalability, and
              growth. At CloudNexus, we envision a future where every business thrives by
              leveraging modern, sustainable, and future-ready solutions.
            </p>
          </div>
          <div className="vm-card">
            <div className="vm-card-header">
              <div className="vm-icon" style={{ background: 'rgba(0,204,255,0.06)' }}>
                <Target size={18} color="#00ccff" strokeWidth={1.5} />
              </div>
              <h4>Mission</h4>
            </div>
            <ul>
              <li>Developing innovative, meaningful products and solutions that enable businesses to operate efficiently, delivering real value in today's evolving digital world.</li>
              <li>Fostering continuous collaboration by building reliable, scalable systems — creating intelligent and adaptable solutions tailored to each client's needs.</li>
              <li>Driving digital innovation through AI, cloud computing, and advanced analytics, seamlessly integrating transformative technology into daily business operations.</li>
              <li>Empowering businesses of all sizes with accessibility, ease, and intelligent methodologies that foster productive and long-term success.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* NEW FOOTER */}
      <Footer />

      {/* Photo Modal */}
      {photoModal.isOpen && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal-container">
            <button 
              className="photo-modal-close" 
              onClick={closePhotoModal}
              aria-label="Close photo"
            >
              ×
            </button>
            <div className="photo-modal-content">
              <img 
                src={photoModal.photo} 
                alt={photoModal.name}
                className="photo-modal-image"
              />
              <div className="photo-modal-name">{photoModal.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamDirectory