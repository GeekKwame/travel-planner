import React from 'react'

interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[30px] font-bold leading-[44px] text-grey-900">{title}</h1>
      <p className="text-base font-normal leading-[24px] text-grey-500">{description}</p>
    </div>
  )
}

export default Header
