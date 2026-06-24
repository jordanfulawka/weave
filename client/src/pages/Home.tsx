export default function Home() {
  return (
    <div className='bg-background h-full flex flex-col justify-center items-center'>
      <h1 className='text-3xl uppercase tracking-widest'>Welcome to</h1>
      <h1 className='text-4xl font-serif uppercase tracking-widest text-primary underline'>
        <div className='flex cursor-pointer'>
          <div className='transition-transform ease-out duration-150 hover:-translate-y-3'>
            W
          </div>
          <div className='transition-transform ease-out duration-150 hover:-translate-y-3'>
            E
          </div>
          <div className='transition-transform ease-out duration-150 hover:-translate-y-3'>
            A
          </div>
          <div className='transition-transform ease-out duration-150 hover:-translate-y-3'>
            V
          </div>
          <div className='transition-transform ease-out duration-150 hover:-translate-y-3'>
            E
          </div>
        </div>
      </h1>
    </div>
  );
}
