import React, { useState } from 'react'

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 
          rounded shadow-lg whitespace-nowrap
          ${positions[position]}
          before:content-[''] before:absolute
          ${position === 'top' && 'before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800'}
          ${position === 'bottom' && 'before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-800'}
          ${position === 'left' && 'before:left-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-gray-800'}
          ${position === 'right' && 'before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-800'}
        `}>
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
