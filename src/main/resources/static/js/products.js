let products=[],categories=[],editingProductId=null;
document.addEventListener("DOMContentLoaded",async()=>{
 if(!requireAuth())return;await loadCategories();await loadProducts();
 document.getElementById("searchInput").addEventListener("input",renderProducts);
 document.getElementById("productForm").addEventListener("submit",saveProduct);
});
async function loadCategories(){
 const r=await authFetch("/categories");if(!r)return;if(!r.ok)throw new Error("Failed to load categories.");
 categories=await r.json();renderCategoryOptions();
}
function renderCategoryOptions(selected=null){
 const s=document.getElementById("productCategory");s.innerHTML='<option value="">No category</option>';
 categories.forEach(c=>{const o=document.createElement("option");o.value=c.id;o.textContent=c.name;if(selected!==null&&c.id===selected)o.selected=true;s.appendChild(o);});
}
async function loadProducts(){
 try{const r=await authFetch("/admin/produkts");if(!r)return;if(!r.ok)throw new Error("Failed to load products.");products=await r.json();renderProducts();}
 catch(e){console.error(e);}
}
function renderProducts(){
 const box=document.getElementById("productsContainer"),q=document.getElementById("searchInput").value.toLowerCase();box.innerHTML="";
 const list=products.filter(p=>[p.name,p.description,p.category?.name].filter(Boolean).join(" ").toLowerCase().includes(q));
 if(!list.length){box.innerHTML='<div class="empty-state"><h3>No products found</h3><p>Add your first product.</p></div>';return;}
 list.forEach(p=>{const c=document.createElement("div");c.className="product-card";c.innerHTML=`
 <div class="product-image">${p.imageURL?`<img src="${esc(p.imageURL)}" alt="${esc(p.name)}">`:"<span>No image</span>"}</div>
 <div class="product-info"><h3>${esc(p.name)}</h3><p class="product-description">${esc(p.description||"")}</p><p class="product-price">${price(p.price)}</p>
 <p class="product-category">${esc(p.category?.name||"No category")}</p><div class="product-status"><span class="status ${p.available?"available":"unavailable"}">${p.available?"Available":"Unavailable"}</span>${p.preorderAvailable?'<span class="status preorder">Preorder</span>':""}</div>
 <div class="product-actions"><button onclick="editProduct(${p.id})">Edit</button><button onclick="deleteProduct(${p.id})">Delete</button></div></div>`;box.appendChild(c);});
}
function openCreateModal(){
 editingProductId=null;document.getElementById("productForm").reset();document.getElementById("modalTitle").textContent="Add Product";
 document.getElementById("productAvailable").checked=true;document.getElementById("productImage").required=true;
 document.getElementById("imageHint").textContent="Required when creating a product.";renderCategoryOptions();
 document.getElementById("productModal").classList.remove("hidden");
}
function closeModal(){document.getElementById("productModal").classList.add("hidden");}
function editProduct(id){
 const p=products.find(x=>x.id===id);if(!p)return;editingProductId=id;
 document.getElementById("modalTitle").textContent="Edit Product";document.getElementById("productName").value=p.name||"";
 document.getElementById("productDescription").value=p.description||"";document.getElementById("productCostPrice").value=p.costPrice??"";
 document.getElementById("productPrice").value=p.price??"";document.getElementById("productAvailable").checked=!!p.available;
 document.getElementById("productPreorderAvailable").checked=!!p.preorderAvailable;renderCategoryOptions(p.category?.id??null);
 document.getElementById("productImage").value="";document.getElementById("productImage").required=false;
 document.getElementById("imageHint").textContent="Current PUT endpoint does not update images.";
 document.getElementById("productModal").classList.remove("hidden");
}
async function saveProduct(e){
 e.preventDefault();
 const data={name:document.getElementById("productName").value.trim(),description:document.getElementById("productDescription").value.trim(),
 costPrice:Number(document.getElementById("productCostPrice").value),price:Number(document.getElementById("productPrice").value),
 available:document.getElementById("productAvailable").checked,preorderAvailable:document.getElementById("productPreorderAvailable").checked,
 categoryId:document.getElementById("productCategory").value===""?null:Number(document.getElementById("productCategory").value)};
 const image=document.getElementById("productImage").files[0];
 try{
  let r;
  if(editingProductId!==null)r=await authFetch(`/admin/produkts/${editingProductId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  else{
   if(!image){return;}
   const fd=new FormData();fd.append("product",new Blob([JSON.stringify(data)],{type:"application/json"}));fd.append("image",image);
   r=await authFetch("/admin/produkts",{method:"POST",body:fd});
  }
  if(!r)return;if(!r.ok)throw new Error(await r.text()||"Failed to save product.");
  closeModal();await loadProducts();;
 }catch(x){console.error(x);}
}
async function deleteProduct(id){
 const p=products.find(x=>x.id===id);if(!confirm(`Delete "${p?.name||"this product"}"?`))return;
 const r=await authFetch(`/admin/produkts/${id}`,{method:"DELETE"});if(!r)return;
 if(!r.ok){return;}await loadProducts();
}
function price(v){return `${Number(v||0).toFixed(2)} €`;}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}