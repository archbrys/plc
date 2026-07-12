import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { TypingAnimation } from '../../../components/common/TypingAnimation'
import './Chapter1Section2Page.css'

export function Chapter1Section2Page() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showNextButton, setShowNextButton] = useState(false)

  const timelineContents = [
    `The Pre-PLC Era: The Age of "Relay Hell" (Before 1968)

• Before PLCs, industrial automation relied entirely on hardwired electromagnetic relays, timers, and counters.

• The Problem: If a factory wanted to change its production line process, electricians had to physically re-wire thousands of relays. A single modification could take days or weeks.

• The Footprint: Relay control rooms were massive, generated intense heat, and troubleshooting a single failed mechanical contact among miles of wire was an absolute nightmare.`,
    
    `1968: The Spark of an Idea

The automotive industry, spearheaded by General Motors (GM), was hit hardest by the limitations of relay panels because they completely retooled their assembly lines every year for new car models.

• The Challenge: Bill Stone, an engineer at GM's Hydramatic division, issued a design specification request for a "Standard Machine Controller."

• The Criteria: It needed to be solid-state (no moving parts), easily programmable, survivable in harsh factory environments, and smaller than a massive relay panel.`,
    
    `1969: The Birth of the First PLC (The Modicon 084)

A team of brilliant engineers at Bedford Associates, led by Dick Morley (widely considered the "Father of the PLC"), took on GM's challenge.

• The Solution: They built a digital computer designed specifically for industrial environments. They called it the MODICON 084 (MOdular DIgital CONtroller, project #84).

• The Innovation: Morley and his team intentionally avoided using standard computer programming languages of the era. Instead, they designed it to look like Ladder Logic, mimicking the schematic diagrams electricians and maintenance technicians already understood.`,
    
    `The 1970s: Microprocessors and Identity

The 1970s transformed the PLC from an experimental tool into an industry standard.

• 1973: Modicon introduces the Modicon 184, which becomes the first massive commercial success in the PLC market.

• The Mid-1970s: The introduction of the microprocessor (like the Intel 8008) allows PLCs to perform complex arithmetic, arithmetic functions, and handle analog signals, moving far beyond simple ON/OFF control.

• 1978: Allen-Bradley (now Rockwell Automation) introduces the PLC-2 and coins the acronym "PLC" (Programmable Logic Controller), which officially replaces the term "Programmable Controller."`,
    
    `The 1980s: Communication and the PC Revolution

PLCs stopped operating as isolated digital islands and started talking to each other.

• 1979/1980: Modicon introduces Modbus, an industrial communication protocol that allows PLCs to exchange data with other devices and computers. It quickly becomes an open industry standard.

• The PC Boom: Instead of using bulky, expensive, proprietary handheld programming terminals, engineers begin using personal computers (PCs) running early software to program PLCs.`,
    
    `The 1990s: Standardization (IEC 61131-3)

As the market grew, every PLC manufacturer developed their own proprietary software and programming methods. This made cross-platform engineering incredibly difficult.

• 1993: The International Electrotechnical Commission releases IEC 61131-3, the global standard for PLC programming languages. It standardized five distinct languages:

  - Ladder Diagram (LD)
  - Function Block Diagram (FBD)
  - Structured Text (ST)
  - Instruction List (IL)
  - Sequential Function Chart (SFC)`,
    
    `The 2000s to Present: PACs, Edge Computing, and Industry 4.0

• The Rise of PACs: The line between PCs and PLCs blurred with the introduction of Programmable Automation Controllers (PACs), which offer the rugged reliability of a PLC but handle massive data processing, motion control, and IT networking.

• Industrial Ethernet: High-speed Ethernet networks like EtherNet/IP, PROFINET, and EtherCAT replace old serial connections, allowing PLCs to seamlessly feed real-time data to SCADA, ERP systems, and cloud storage.

• Today (Industry 4.0): Today's PLCs handle Edge Computing, feature advanced cybersecurity protocols, integrate directly with Artificial Intelligence for predictive maintenance, and can even be programmed using modern IT languages like Python or C++.`
  ]

  const handleNext = () => {
    navigate('/student/chapter1-section3')
  }

  const handleBack = () => {
    navigate('/student/chapter1-introduction')
  }

  return (
    <div className="chapter-section2-page">
      <header className="chapter-section2-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chapter-section2-main">
        <div className="chapter-section2-content">
          <div className="chapter-section2-card">
            <div className="chapter-section2-header-text">
              <h1 className="chapter-section2-title">Chapter 1: Introduction to PLC and its History</h1>
              <p className="chapter-section2-subtitle">Section 2 of 3: The Timeline</p>
            </div>

            <div className="chapter-section2-body-wrapper">
              <div className="chapter-section2-text-column">
                <TypingAnimation 
                  contents={timelineContents}
                  typingSpeed={30}
                  displayDuration={5000}
                  clearSpeed={10}
                  loop={false}
                  onComplete={() => setShowNextButton(true)}
                />
              </div>

              <div className="chapter-section2-image-column">
                <img 
                  src="/assets/logo-plc.png" 
                  alt="PLC Timeline Illustration" 
                  className="chapter-section2-image"
                />
              </div>
            </div>
          </div>

          {showNextButton && (
            <div className="chapter-section2-actions">
              <button 
                className="btn large ready-btn" 
                type="button" 
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
