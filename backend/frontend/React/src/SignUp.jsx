import React, {useState} from 'react'
import axios from 'axios'
export default function SignUp({gotoSignIn}){
  const [email,setEmail]=useState('');const [password,setPassword]=useState('')
  const submit=async(e)=>{e.preventDefault();try{await axios.post('http://localhost:5000/signup',{email,password});alert('created');gotoSignIn()}catch(err){alert('error')} }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-md bg-transparent border border-white/10" />
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded-md bg-transparent border border-white/10" />
        <div className="flex gap-3">
          <button className="btn bg-white/6">Sign up</button>
          <button type="button" onClick={gotoSignIn} className="btn bg-white/3">Back to sign in</button>
        </div>
      </form>
    </div>
  )
}
