import React, {useState} from 'react'
import axios from 'axios'
export default function Recommendations({token,keywords}){
  const [results,setResults]=useState([])
  const getRecs=async()=>{try{const r=await axios.post('http://localhost:5000/recommend',{keywords},{headers:{Authorization:`Bearer ${token}`}});setResults(r.data.results)}catch(err){alert('error')}}
  return (
    <div className="glass p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recommendations</h3>
        <button onClick={getRecs} className="btn bg-white/6">Get</button>
      </div>
      <div className="space-y-3">
        {results.map((r,i)=>(<div key={i} className="p-2 border rounded-md bg-white/3">
          <a href={r.url} target="_blank" rel="noreferrer" className="font-medium">{r.title || r.name || r.snippet}</a>
          <div className="text-sm">{r.description || r.snippet}</div>
        </div>))}
      </div>
    </div>
  )
}
