import React from 'react'

const HeroBtn = ({ title, underline }) => {
  return (
    <div className=" relative group">
      <div className=" text-white font-semibold px-1.5 text-[14px]">
        <button>{title}</button>
        </div>
        <div className= {`absolute h-[2.5px] group-hover:bg-[#dc4a11] ${underline}
         w-full duration-200 ease-out`}
         ></div>
    </div>

  );
};

      export default HeroBtn;