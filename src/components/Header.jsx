import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ExternalLink } from 'lucide-react'
import { employees } from '../data/employees'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()
  const searchContainerRef = useRef(null)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
        emp.department.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 6)) // Limit to 6 results
    } else {
      setSearchResults([])
    }
  }

  // Helper functions (same as TeamDirectory)
  const sdeIds = ['sahil-gupta', 'naresh-kose', 'harshit-mishra', 'talib']
  const internIds = [
    'ayush-paradkara', 'bhumi-singh', 'ashutosh-dwivedi',
    'siddharth-lodhi', 'ankit-kuswaha', 'pravesh-tripati',
    'vasu-sethiya', 'prince-sulekhiya', 'suhani-deshmukh',
    'utkarsh-sharma', 'ashish-kumar', 'affan-ahmad',
    'bharti-sahu', 'shivam-suryawanshi'
  ]
  const traineeIds = [
    'pushpraj-patel', 'kunal-sutrakar',
    'mayank-sahu', 'aaditya-raj',
    'anshika-sarathe', 'raunak-dhanotiya'
  ]

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

  const getMemberUrlName = (memberId) => {
    const member = employees.find(e => e.id === memberId)
    if (member) {
      return member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
    return memberId
  }

  const handleEmployeeSelect = (employeeId) => {
    console.log('Navigating to employee:', employeeId)
    
    // Update URL
    const section = getMemberSection(employeeId)
    const memberName = getMemberUrlName(employeeId)
    navigate(`/${section}/${memberName}`)
    
    // Scroll to card after a short delay to ensure navigation completes
    setTimeout(() => {
      const memberCard = document.getElementById(`member-card-${employeeId}`)
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
    }, 100)
    
    setSearchQuery('')
    setSearchResults([])
    setIsSearchFocused(false)
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }


  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchFocused(false)
  }

  // Handle clicks outside search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false)
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <main className="w-full py-2" style={{ overflow: 'visible' }}>
      <div className="header-content-new">
        {/* Left side - Logo and Title */}
        <div className="header-left-new">
          <div className="header-logo-new">
            <div className="logo-container-new">
              <img src="/asset/cloudnexus-logo.png" alt="CloudNexus" className="logo-image-new" />
            </div>
            <div className="header-text-new">
              <div className="header-brand-new">CLOUDNEXUS</div>
              <div className="header-title-new">Know Your Team – CN Beyonders</div>
              <div className="header-subtitle-new">People, roles, and how to connect</div>
            </div>
          </div>
        </div>

        {/* Right side - Search and Link */}
        <div className="header-right-new">
          <div className="search-container-new" ref={searchContainerRef}>
            <div className="search-input-wrapper-new">
              <Search className="search-icon-new" size={16} />
              <input
                type="text"
                placeholder="Search by name, role, department, or skills..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    clearSearch()
                  } else if (e.key === 'Enter' && searchResults.length > 0) {
                    handleEmployeeSelect(searchResults[0].id)
                  }
                }}
                className="search-input-new"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="search-results-new">
                {searchResults.map((employee) => (
                  <div
                    key={employee.id}
                    className="search-result-item-new"
                    onClick={() => handleEmployeeSelect(employee.id)}
                  >
                    <div className="search-result-avatar-new">
                      <img 
                        src={employee.photo && !employee.photo.startsWith('http') ? employee.photo : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=15151f&color=0cf&size=32&font-size=0.4&bold=true`} 
                        alt={employee.name} 
                      />
                    </div>
                    <div className="search-result-info-new">
                      <div className="search-result-name-new">{employee.name}</div>
                      <div className="search-result-title-new">{employee.jobTitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a 
            href="https://www.cloudnexus.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-link-new"
          >
            Visit cloudnexus.in
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </main>
  )
}

export default Header