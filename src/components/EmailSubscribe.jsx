import React, { useState, useEffect } from 'react';
import PageMeta from "@/data/footer";
import { hubSpotUrl, accessToken } from "@/utils/api.utils";

const { freeNewsletter, subscribe } = PageMeta;

export default function EmailSubscribe() {

  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleChange = (event) => {
    setSubscribeEmail(event.target.value);
  }

  const sendEmail = () => {
    if (!subscribeEmail) return;
    const requestData = {
      properties: {
        email: subscribeEmail,
      }
    };
    fetch('https://job-api.saharaa.info/contact.create', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(requestData)
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => alert(error));
  }


  return (
    <div className=" col-span-6 flex justify-end tablet:w-full">
      <div className="border border-light-100 flex px-4 py-2 bg-dark-400 rounded-xl w-full max-w-[40rem] tablet:max-w-full justify-between">
        <div className="text-light-200 flex items-center text-sm mobile:text-xs">
          <img className="w-5 h-5 mr-1.5" src='/email.svg' alt="" />
          <input className="input-bg outline-none" type="text" placeholder={freeNewsletter} value={subscribeEmail} onChange={handleChange} />
        </div>
        <div className="cursor-pointer flex text-light-100 text-sm items-center mobile:text-xs" onClick={() => sendEmail()}>
          {subscribe}
          <img className="w-5 h-5" src='/jump.svg' alt="" />
        </div>
      </div>
    </div>
  );
}
