import {InfoIcon} from '@/icons';
import React, {ReactNode} from 'react';

interface StatProps {
  children?: ReactNode;
  label?: string;
  desc?: string;
  value?: string | number;
}

const StatsCard = (props: StatProps) => {
  const {label, desc, value} = props;
  return (
    <div className="w-full h-full py-4 px-5 rounded-xl flex flex-col items-start justify-start gap-y-2 border bg-opacity-20 backdrop-filter backdrop-blur-md bg-gradient-to-br from-[#1c1c1c]/40 to-[#1f1f1f]/40 shadow-lg shadow-[#141414]/60 hover:shadow-xl hover:shadow-[#141414]/60 border-teal-400 hover:border-gray-300 min-h-min relative group">
      <div className="w-full flex flex-row text-white font-primary justify-between items-center">
        <h3 className="text-lg font-medium">{label}</h3>
        <div className="w-fit h-fit">
          <div className="peer">
            <InfoIcon className="w-6 h-6 text-white" />
          </div>
          <div
            role="tooltip"
            className="w-[200px] max-w-full h-fit absolute -top-16 -right-0 z-10 px-3 py-2 text-sm font-medium text-white bg-neutral-900/90 rounded-lg shadow-sm bg-cardGray-700 hidden peer-hover:block"
          >
            {desc}
            <div className="absolute w-3 h-3 -bottom-1 right-6 bg-neutral-900/90 transform rotate-45"></div>
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl text-amber-400 font-primary font-semibold">{value}</h1>
    </div>
  );
};

export default StatsCard;
