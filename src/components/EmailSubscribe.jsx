import React, { useState } from 'react';
import PageMeta from "@/data/footer";

const { freeNewsletter } = PageMeta;

export default function EmailSubscribe() {

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const handleChange = (event) => {
    setSubscribeEmail(event.target.value);
  }

  const sendEmail = async () => {
    try {
      if (!subscribeEmail) return;
      setShowLoading(true);
      const requestData = {
        properties: {
          email: subscribeEmail,
        }
      };
      await fetch('https://job-api.saharaa.info/contact.create', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestData)
      })
    } catch (error) {
      console.log('error', error);
    } finally {
      setShowLoading(false);
    }
  }


  return (
    <div className=" col-span-6 flex justify-end tablet:w-full">
      <div className="border border-light-100 flex px-4 py-2 bg-dark-400 rounded-xl w-full max-w-[40rem] tablet:max-w-full justify-between">
        <div className="text-light-200 flex items-center text-sm mobile:text-xs">
          <img className="w-5 h-5 mr-1.5" src='/email.svg' alt="" />
          <input className="input-bg outline-none" type="text" placeholder={freeNewsletter} value={subscribeEmail} onChange={handleChange} />
        </div>
        <div className={`cursor-pointer flex text-light-100 text-sm items-center mobile:text-xs loading-button ${showLoading ? 'loading' : ''}`} onClick={() => sendEmail()}>
          {showLoading ? '' : 'Subscribe'}
          {
            !showLoading && <img className="w-5 h-5" src='/jump.svg' alt="" />
          }
        </div>
      </div>
    </div>
  );
}
