let categories=[];
document.addEventListener("DOMContentLoaded",async()=>{
 if(!requireAuth())return;await loadCategories();document.getElementById("categoryForm").addEventListener("submit",createCategory);
});
async function loadCategories(){
 try{const r=await authFetch("/categories");if(!r)return;if(!r.ok)throw new Error("Failed to load categories.");categories=await r.json();renderCategories();}
 catch(e){console.error(e);}
}
function renderCategories(){
 const box=document.getElementById("categoriesContainer");box.innerHTML="";
 if(!categories.length){box.innerHTML='<div class="empty-state"><h3>No categories found</h3><p>Add your first category.</p></div>';return;}
 categories.forEach(c=>{const x=document.createElement("div");x.className="category-card";x.innerHTML=`
 <div class="category-image">${c.imageURL?`<img src="${esc(c.imageURL)}" alt="${esc(c.name)}">`:"<span>No image</span>"}</div>
 <div class="category-info"><h3>${esc(c.name)}</h3><p>${esc(c.description||"")}</p>
 <div class="category-actions"><button onclick="viewCategoryProducts(${c.id})">View Products</button><button onclick="deleteCategory(${c.id})">Delete</button></div></div>`;box.appendChild(x);});
}
function openCategoryModal(){document.getElementById("categoryForm").reset();document.getElementById("categoryModal").classList.remove("hidden");}
function closeCategoryModal(){document.getElementById("categoryModal").classList.add("hidden");}
async function createCategory(e){
 e.preventDefault();const name=document.getElementById("categoryName").value.trim(),description=document.getElementById("categoryDescription").value.trim(),image=document.getElementById("categoryImage").files[0];
 if(!name||!image){return;}
 const fd=new FormData();fd.append("category",new Blob([JSON.stringify({name,description})],{type:"application/json"}));fd.append("image",image);
 try{const r=await authFetch("/categories",{method:"POST",body:fd});if(!r)return;if(!r.ok)throw new Error(await r.text()||"Failed to create category.");closeCategoryModal();await loadCategories();}
 catch(x){console.error(x);}
}
async function deleteCategory(id){
 const c=categories.find(x=>x.id===id);if(!confirm(`Delete "${c?.name||"this category"}"?`))return;
 const r=await authFetch(`/categories/${id}`,{method:"DELETE"});if(!r)return;if(!r.ok){return;}await loadCategories();
}
async function viewCategoryProducts(id){
 try{const r=await authFetch(`/categories/${id}`);if(!r)return;if(!r.ok)throw new Error(await r.text()||"Failed to load products.");
 const products=await r.json(),c=categories.find(x=>x.id===id);document.getElementById("categoryProductsTitle").textContent=`${c?.name||"Category"} Products`;
 const box=document.getElementById("categoryProductsContainer");box.innerHTML="";
 if(!products.length)box.innerHTML="<p>No products in this category.</p>";
 products.forEach(p=>{const x=document.createElement("div");x.className="category-product-item";x.innerHTML=`<strong>${esc(p.name)}</strong><span>${price(p.price)}</span>`;box.appendChild(x);});
 document.getElementById("categoryProductsModal").classList.remove("hidden");
 }catch(e){console.error(e);}
}
function closeCategoryProducts(){document.getElementById("categoryProductsModal").classList.add("hidden");}
function price(v){return `${Number(v||0).toFixed(2)} €`;}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}