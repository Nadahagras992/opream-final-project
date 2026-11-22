import{useNavigate}from'react-router-dom'
import "./RolePages.css"

export const ROLES={
  "college-admin":{ar:"مسؤول الكليه ",en:"college Admin"},
  "company-admin":{ar:"مسؤول الشركه",en:"company Admin"},
  mentor:{ar:"المرشد",en:"mentor"},
  student:{ar:"الطالب",en:"student"},
};

export default function RolePage({role}){
  const navigate=useNavigate(); 
  const isAr =document.documentElement.lang==="ar";
  const name=ROLES[role][isAr?"ar":"en"];

  const logout=()=>{
    try{localStorage.removeItem('role');}catch{}
    navigate('/login',{replace:true});
  };

    return(
        <div className="role-page">
        <div className="role-page-content">
        <h1 className="role-page-title">
            {isAr ?`مرحبا ${name}`: `welcome ${name}`}
        </h1>
        <p className="role-page-description">
        {isAr ?"هذه صفحه الدخول الخاصه بهذا الدور":"this is the landing page for this role"}
        </p>
        <button className="role-page-logout" onClick={logout}>
        {isAr ?"تسجيل الخروج":"logout"}
        </button>

       </div>
      </div>
    );
}