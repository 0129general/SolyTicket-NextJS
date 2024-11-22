import React from 'react'

interface EventCardProps {
  title: string;

}


const PageTitle: React.FC<EventCardProps> = ({
  title,
  
}) => {
  return (
    <div className="container-fluid mx-auto bg-[#4E43F10D] ">
      <div className="py-8 title m-auto text-center">
      <h3 className='text-[#4E43F1]'>{title}</h3>
      </div>
    </div>
  )
}

export default PageTitle