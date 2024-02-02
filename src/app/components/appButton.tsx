'use client'
import { ReactNode } from 'react';

const AppButton = ({ text, onClick, icon, customeClass }: { text: string, onClick: () => void, icon?:ReactNode, customeClass?: string }) => {

    return (
        <button 
            className={`flex items-center justify-center h-[44px] py-2 px-4 
            text-white text-base rounded-xl border border-[#474040] border-solid ${customeClass}`} 
            onClick={() => onClick()}
        >
            {text}
            {icon}
        </button>
    );
}

export default AppButton;