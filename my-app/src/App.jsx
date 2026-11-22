// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'




import{Navigate , Route , Routes ,useNavigate} from 'react-router-dom'
import Login from './components/Login/Login.jsx'
import RolePage from './components/RolePage/RolePage.jsx';
import Apply from './components/Apply/Apply.jsx';



const getRole = () => {
  try{return localStorage.getItem('role') || null}catch(e){return null};
};

const LANDING = {
  student: '/student/apply',
  'college-admin': '/college-admin',
  'company-admin': '/company-admin',
  mentor: '/mentor',
};

function LoginPageO(){
  const navigate=useNavigate();
  const handelesource=(user)=>{
    try{localStorage.setItem('role',user.role);}catch{}
    navigate(LANDING[user.role] || '/login',{replace:true});

};
return <Login onSource={handelesource}/>;
}

function Protected({role,children}){
  return getRole()===role?children:<Navigate to="/login" replace/>;
}

const ROLES = {
  "college-admin": "college-admin",
  "company-admin": "company-admin",
  mentor: "mentor",
  student: "student",
};

export default function App(){
  return(
    <Routes>
      <Route path="/login" element={<LoginPageO/>}/>
     
      
      <Route path="/student/apply" element={<Protected role="student"><Apply/></Protected>}/>
      {Object.keys(ROLES).map((role)=>(
        <Route
          key={role}
          path={`/${role}/*`}
          element={<Protected role={role}><RolePage role={role}/></Protected>}
        />
      ))}
      <Route path="*" element={<Navigate to="/login" replace/>}/>

    </Routes>

  );
}
