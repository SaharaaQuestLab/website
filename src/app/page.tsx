'use client'

import AppButton from "./components/appButton";
import GradinetText from "./components/gradinetText";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full h-[1040px] relative flex items-center justify-center">
        <div className="bg-[url('/bg1.svg')] bg-no-repeat bg-center bg-cover absolute top-0 h-[365px] w-full"></div>
        <div className="bg-[url('/bg.svg')] bg-no-repeat bg-center bg-cover absolute  bottom-0 h-[365px] w-full"></div>
        <div className="flex flex-col items-center z-10">
          <div className="flex flex-col relative items-center mb-[110px]">
            <GradinetText size={110} text="Your Knowledge." />
            <GradinetText size={110} text="Your AI." customeClass="absolute top-[102px]" />
          </div>
          <span className="text-lg text-[#979EA8] w-[460px] text-center mb-[40px]">
            Sahara is developing Al and blockchain-powered infrastructure that unlocks fair and universal access to knowledge capital.
          </span>
          <AppButton 
            text="Get in touch" 
            onClick={() => {}}
            // eslint-disable-next-line @next/next/no-img-element
            icon={<img src="/jump.svg" alt="jump"/>}
          /> 
        </div>
      </section>
    </main>
  );
}
