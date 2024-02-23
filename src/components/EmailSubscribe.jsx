import React, { useState } from 'react';
import PageMeta from "@/data/footer";
import { Icon } from "astro-icon/components";

const {freeNewsletter, subscribe } = PageMeta;

export default function EmailSubscribe() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    console.log(1)
    alert(1);
    setValue(event.target.value);
  }

  return (
    <div className=" col-span-6 flex justify-end tablet:w-full">
    <div className="border border-light-100 flex px-4 py-2 bg-dark-400 rounded-xl w-full max-w-[40rem] tablet:max-w-full justify-between">
      <div className="text-light-200 flex items-center text-sm mobile:text-xs">
        {/* <Icon class="w-5 h-5 mr-1.5" name="email"/> */}
        <input type="text" placeholder={freeNewsletter} value={value} onChange={handleChange} />
      </div>
      <div className="cursor-pointer flex text-light-100 text-sm items-center mobile:text-xs">
        {subscribe}
        {/* <Icon class="w-5 h-5" name="arrowRightUp"/> */}
      </div>
    </div>
  </div>
  );
}
