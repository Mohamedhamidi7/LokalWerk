function getToken(){return localStorage.getItem("token");}
function saveToken(token){localStorage.setItem("token",token);}
function logout(){localStorage.removeItem("token");window.location.replace("/login.html");}
function requireAuth(){if(!getToken()){window.location.replace("/login.html");return false;}return true;}
async function authFetch(url,options={}){
 const token=getToken(); if(!token){logout();return null;}
 options.headers={...(options.headers||{}),Authorization:`Bearer ${token}`};
 const response=await fetch(url,options);
 if(response.status===401||response.status===403){logout();return null;}
 return response;
}
async function login(username,password){
 const response=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
 if(!response.ok)throw new Error(response.status===400?"Invalid username or password.":"Login failed.");
 const data=await response.json();
 if(!data.token)throw new Error("JWT token was not returned by the server.");
 saveToken(data.token);window.location.replace("/dashboard.html");
}
const loginForm=document.getElementById("loginForm");
if(loginForm)loginForm.addEventListener("submit",async e=>{
 e.preventDefault();const b=document.getElementById("loginButton"),err=document.getElementById("loginError");
 b.disabled=true;b.textContent="Signing in...";err.textContent="";
 try{await login(document.getElementById("username").value.trim(),document.getElementById("password").value);}
 catch(x){err.textContent=x.message;b.disabled=false;b.textContent="Sign in";}
});