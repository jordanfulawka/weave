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
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-6 px-5 mt-10'>
        <div className='bg-surface-container-lowest border border-outline-variant min-w-50 overflow-hidden flex flex-col p-6 rounded-lg transition-transform hover:-translate-y-1'>
          <h3 className='text-xl text-on-surface'>
            <span className='text-primary'>•</span> Wiki Linking
          </h3>
          <p className='text-on-surface-variant'>
            Type [[ and select from the dropdown to instantly link any note to
            another. Your ideas stay connected, not siloed.
          </p>
        </div>
        <div className='bg-surface-container-lowest border border-outline-variant min-w-50 overflow-hidden flex flex-col p-6 rounded-lg transition-transform hover:-translate-y-1'>
          <h3 className='text-xl text-on-surface'>
            <span className='text-tertiary'>•</span> Graph View
          </h3>
          <p className='text-on-surface-variant'>
            See every note and its connections visualized as an interactive
            graph. Watch your ideas grow and spot patterns and relationships
            across your entire workspace.
          </p>
        </div>
        <div className='bg-surface-container-lowest border border-outline-variant min-w-50 overflow-hidden flex flex-col p-6 rounded-lg transition-transform hover:-translate-y-1'>
          <h3 className='text-xl text-on-surface'>
            <span className='text-[#8a6914]'>•</span> Sharing
          </h3>
          <p className='text-on-surface-variant'>
            Share any note with the click of a button. Collaborators can jump
            straight into the document without any setup.
          </p>
        </div>
        <div className='bg-surface-container-lowest border border-outline-variant min-w-50 overflow-hidden flex flex-col p-6 rounded-lg transition-transform hover:-translate-y-1'>
          <h3 className='text-xl text-on-surface'>
            <span className='text-[#436b50]'>•</span> Collaboration
          </h3>
          <p className='text-on-surface-variant'>
            Write together with others in the same note, live. Changes appear
            instantly - no refreshing, no conflicts.
          </p>
        </div>
      </div>
    </div>
  );
}
