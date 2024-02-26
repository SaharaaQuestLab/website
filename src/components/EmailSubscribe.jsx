import React, { useState } from 'react';
import PageMeta from "@/data/footer";
import ImgEmail from "@/assets/images/email.svg";
import ImgJump from "@/assets/images/jump.svg";

const { freeNewsletter } = PageMeta;

export default function EmailSubscribe() {

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = (event) => {
    setSubscribeEmail(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      sendEmail();
    }
  }

  const sendEmail = async () => {
    if (!subscribeEmail || isSubscribed) return;
    setShowLoading(true);
    const requestData = {
      properties: {
        email: subscribeEmail,
      }
    };
    const apiResult = await fetch('https://job-api.saharaa.info/contact.create', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(requestData)
    })
    setShowLoading(false);
    if (apiResult.status == 200 || apiResult.status == 201) {
      setIsSubscribed(true);
    }
  }


  return (
    <div className=" col-span-6 flex justify-end tablet:w-full">
      <div className="border border-light-100 flex px-4 py-2 bg-dark-400 rounded-xl w-full max-w-[40rem] tablet:max-w-full justify-between">
        <div className="text-light-200 flex items-center text-sm mobile:text-xs">
          <img className="w-5 h-5 mr-1.5" src={ImgEmail.src} alt="" />
          <input className="input-bg outline-none" type="text" placeholder={freeNewsletter} value={subscribeEmail} onChange={handleChange} onKeyDown={handleKeyDown} />
        </div>
        <div className={`flex text-sm items-center mobile:text-xs loading-button ${showLoading ? 'loading pr-10' : ''} ${isSubscribed ? 'text-light-300 cursor-not-allowed' : 'text-light-100 cursor-pointer'}`} onClick={() => sendEmail()}>
          {showLoading ? '' : isSubscribed ? 'Subscribed' : 'Subscribe'}
          {
            (!showLoading && !isSubscribed) && <img className="w-5 h-5" src={ImgJump.src} alt="" />
          }
        </div>
      </div>
    </div>
  );
}
