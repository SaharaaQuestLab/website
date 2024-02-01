
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full min-h-screen relative flex items-center justify-center">
        <div className="bg-[url('/bg1.svg')] bg-no-repeat bg-center bg-cover absolute top-0 h-[365px] w-full"></div>
        <div className="bg-[url('/bg.svg')] bg-no-repeat bg-center bg-cover absolute  bottom-0 h-[365px] w-full"></div>
        <div className="flex flex-col items-center z-10">
          <span className="bg-gradient bg-clip-text text-transparent text-[110px]">Your Knowledge.</span>
          <span className="bg-gradient bg-clip-text text-transparent text-[110px]">Your AI.</span>
        </div>
      </section>
    </main>
  );
}
