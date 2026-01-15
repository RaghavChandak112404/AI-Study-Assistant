import React, {useState} from 'react'
import UploadCard from './UploadCard'
import ChatQA from './ChatQA'
import Recommendations from './Recommendations'
export default function Dashboard({token,logout}){
  const [summary,setSummary]=useState(null)
  const [keywords,setKeywords]=useState(null)
  const [raw,setRaw]=useState('')
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Study Assistant</h1>
        <div className="flex gap-3">
          <button onClick={logout} className="btn bg-white/6">Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <UploadCard token={token} onResult={(s,k,r)=>{setSummary(s);setKeywords(k);setRaw(r)}} />
          <ChatQA token={token} context={raw} />
        </div>
        <div className="space-y-4">
          <div className="glass p-4">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </div>
          <Recommendations token={token} keywords={keywords} />
        </div>
      </div>
    </div>
  )
}
