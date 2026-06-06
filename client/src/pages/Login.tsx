import { useState } from 'react';
import { Mail, Lock, CircleUser } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className='bg-background h-screen flex flex-col items-center'>
      <div className='flex flex-col items-center pt-5 pb-10'>
        <h1 className='text-on-background text-3xl'>Weave</h1>
        <p className='italic font-serif'>Your thoughts, connected</p>
      </div>
      <div className='w-96 bg-surface-container-lowest shadow-xl rounded-md'>
        <div className='p-8'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div className='flex flex-col'>
              <label className='font-serif'>Email</label>
              <div className='relative'>
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'
                />
                <input
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border border-outline-variant rounded-md w-full pl-9 pr-4 py-3'
                />
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex justify-between'>
                <label className='font-serif'>Password</label>
                <span className='font-serif text-[#D07B50]'>
                  Forgot password?
                </span>
              </div>
              <div className='relative'>
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'
                />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border border-outline-variant rounded-md w-full pl-9 pr-4 py-3'
                />
              </div>
            </div>
            <button
              type='submit'
              className='bg-[#D07B50] font-serif p-3 rounded-md text-surface-container'
            >
              Sign in
            </button>
          </form>
          <div className='flex items-center gap-3 py-5'>
            <div className='flex-1 h-px bg-outline-variant' />
            <span className='text-on-surface-variant text-sm font-serif'>
              or continue with
            </span>
            <div className='flex-1 h-px bg-outline-variant' />
          </div>
          <div className='font-serif flex justify-around'>
            <button
              type='button'
              className='border border-outline-variant w-36 p-3 rounded-md'
            >
              Google
            </button>
            <button
              type='button'
              className='border border-outline-variant w-36 p-3 rounded-md'
            >
              Apple
            </button>
          </div>
        </div>
      </div>
      <p className='font-serif pt-8'>
        Don't have an account? <span className='text-[#D07B50]'>Register</span>
      </p>
    </div>
  );
}
