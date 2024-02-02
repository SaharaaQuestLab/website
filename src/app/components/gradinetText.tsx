
const GradinetText = ({ size, text, customeClass } : { size: number, text: string, customeClass?: string }) => {

    return (
        <span className={`bg-gradient bg-clip-text text-transparent text-[${size}px] ${customeClass}`}>{text}</span>
    )
}

export default GradinetText