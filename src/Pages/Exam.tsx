import { ArrowRight, Info, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

 

function Exam() {

  const navigate=useNavigate();
  
  return (
    <div className="h-full bg-[#f3f4f6] p-8 md:p-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-[#1f2937]">
            Exams
          </h1>

          <p className="mt-3 text-md text-gray-500">
            Search Exam what you want to Experience
          </p>
        </div>

      <button style={{borderRadius:'99999px'}}
  className="bg-blue-600 text-white px-6 py-3 w-48 h-14 text-sm font-medium border border-gray-400 rounded-lg flex items-center justify-center"
>
  Generate Exam
</button>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 h-15 rounded-[50px] border border-[#3b3b3b] bg-white px-5 py-4 shadow-sm">
        <input
          type="text"
          placeholder="Search Example : ServiceNow , AWS"
          className="w-full border-none bg-transparent text-lg text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
        />

        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full text-[#1f2937] transition hover:bg-gray-100">
          <Search size={24} className="" />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="flex h-70 w-100 flex-col justify-between rounded-[20px] bg-blue-600 p-8 text-white shadow-sm">
          <div>
            <p className="text-lg font-bold">AWS</p>
            <p style={{font:'10px'}}className="mt-10 max-w-[260px] text-2xl font-medium leading-tight">
              Cloud Practitioner Fundamentals
            </p>
          </div>

          <div className="p-6 flex flex-wrap gap-4 ml-67">
          <button style={{borderRadius:'99999px',fontSize:'13px'}}
  className="flex flex-col items-center justify-center gap-1 h-10 w-29 rounded-full bg-white text-[#202020] shadow-sm text-[8px] font-bold"
>
  <span>More Details</span>
 
</button>

            
   
 
<button onClick={() => navigate("/Instruction")}
  style={{ borderRadius: '99999px', fontSize: '14px' }}
  className="flex items-center justify-between gap-3 h-10 w-29 px-4 py-2 rounded-full bg-white text-[#202020] shadow-sm font-bold"
>
  <span>Start</span>
  <ArrowRight size={16} />
</button>
          </div>
        </div>

       <div className="flex h-70 w-100 flex-col justify-between rounded-[20px] bg-blue-600 p-8 text-white shadow-sm">
          <div>
            <p className="text-lg font-bold">ServiceNow</p>
            <p style={{font:'10px'}}className="mt-10 max-w-[260px] text-2xl font-medium leading-tight">
              Certified System Administrator 
            </p>
          </div>

          <div className="p-6 flex flex-wrap gap-4 ml-67">
             <button style={{borderRadius:'99999px',fontSize:'13px'}}
  className="flex flex-col items-center justify-center gap-1 h-10 w-29 rounded-full bg-white text-[#202020] shadow-sm text-[8px] font-bold"
>
  <span>More Details</span>
 
</button>

            <button
  style={{ borderRadius: '99999px', fontSize: '14px' }}
  className="flex items-center justify-between gap-3 h-10 w-29 px-4 py-2 rounded-full bg-white text-[#202020] shadow-sm font-bold"
>
  <span>Start</span>
  <ArrowRight size={16} />
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;