import React, {useState} from 'react'
import axios from 'axios'
export default function ChatQA({token,context}){
  const [q,setQ]=useState('');const [ans,setAns]=useState('')
  const ask=async(e)=>{e.preventDefault();try{const r=await axios.post('http://localhost:5000/ask',{question:q,context},{headers:{Authorization:`Bearer ${token}`}});setAns(r.data.answer)}catch(err){alert('error')}}
  return (
    <div className="glass p-4">
      <h3 className="text-lg font-semibold mb-2">Ask about document</h3>
      <form onSubmit={ask} className="space-y-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question..." className="w-full p-2 rounded-md bg-transparent border border-white/10" />
        <button className="btn bg-white/6">Ask</button>
      </form>
      <div className="mt-3">
        <h4 className="font-medium">Answer</h4>
        <div className="mt-2 whitespace-pre-wrap">{ans}</div>
      </div>
    </div>
  )
}
