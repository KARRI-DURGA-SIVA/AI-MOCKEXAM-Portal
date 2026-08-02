import {useNavigate} from 'react-router-dom'
function Home(){
    const navigate = useNavigate();
    return(
     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="font-poppins text-4xl font-bold text-blue-600">AI EXAM PORTAL</h1><br></br>
      <div className="flex justify-between item-center p-5 gap-4">
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 " onClick={()=>navigate("/signup")}>Signup</button><br></br>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 " onClick={()=>navigate("/login")}>Get Started</button>
      </div>
    </div>
    );
}
export default Home
