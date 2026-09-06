document.addEventListener("DOMContentLoaded",loadDashboard);
async function loadDashboard(){
 if(!requireAuth())return;
 try{
  const [pr,cr]=await Promise.all([authFetch("/admin/produkts"),authFetch("/categories")]);
  if(!pr||!cr)return;if(!pr.ok||!cr.ok)throw new Error("Could not load dashboard.");
  const products=await pr.json(),categories=await cr.json();
  document.getElementById("productCount").textContent=products.length;
  document.getElementById("categoryCount").textContent=categories.length;
  const box=document.getElementById("recentProducts");box.innerHTML="";
  products.slice(0,6).forEach(p=>{const c=document.createElement("div");c.className="product-card";c.innerHTML=`
  <div class="product-image">${p.imageURL?`<img src="${esc(p.imageURL)}" alt="${esc(p.name)}">`:"<span>No image</span>"}</div>
  <div class="product-info"><h3>${esc(p.name)}</h3><p class="product-price">${price(p.price)}</p><p class="product-category">${esc(p.category?.name||"No category")}</p></div>`;box.appendChild(c);});
 }catch(e){console.error(e);}
}
function price(v){return `${Number(v||0).toFixed(2)} €`;}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}