const state = {
  categories: [],
  products: []
};

function token() {
  return localStorage.getItem("token");
}

function ensureLoggedIn() {
  if (!token()) {
    window.location.href = "/index.html";
    return false;
  }
  return true;
}

function authHeaders(extra = {}) {
  const auth = token();
  return auth ? { ...extra, Authorization: "Bearer " + auth } : extra;
}

function setMessage(id, message, type = "") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = "message" + (type ? ` ${type}` : "");
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers || {})
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
    throw new Error("Unauthorized");
  }

  return response;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

function resetForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.reset();
}

function fillCategorySelect(selectId, includeDefault = true) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = includeDefault ? '<option value="">Select category</option>' : '';

  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function fillProductSelect(selectId, includeDefault = true) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = includeDefault ? '<option value="">Select product</option>' : '';

  state.products.forEach((product) => {
    const option = document.createElement("option");
    option.value = String(product.id);
    option.textContent = `${product.name} (ID: ${product.id})`;
    select.appendChild(option);
  });
}

function renderSummary() {
  const totalCategories = state.categories.length;
  const totalProducts = state.products.length;
  const availableProducts = state.products.filter((p) => p.available).length;
  const categoriesWithProducts = state.categories.filter((c) => {
    const ids = new Set((state.products || []).filter((p) => p.category && p.category.id === c.id).map((p) => p.id));
    return ids.size > 0;
  }).length;

  document.getElementById("totalCategories").textContent = totalCategories;
  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("availableProducts").textContent = availableProducts;
  document.getElementById("categoriesWithProducts").textContent = categoriesWithProducts;
}

function renderCategories() {
  const container = document.getElementById("categoriesList");
  if (!container) return;

  container.innerHTML = "";

  if (!state.categories.length) {
    container.innerHTML = '<div class="empty">No categories found.</div>';
    return;
  }

  state.categories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const productsInCategory = state.products.filter((product) => product.category && product.category.id === category.id);

    card.innerHTML = `
      ${category.imageURL ? `<img src="${category.imageURL}" alt="${category.name}" />` : ""}
      <h4>${category.name}</h4>
      <p>${category.description || "No description"}</p>
      <p>ID: ${category.id}</p>
      <div class="meta">
        <button class="secondary" type="button" onclick="showCategoryProducts(${category.id})">View</button>
        <button class="danger" type="button" onclick="deleteCategory(${category.id})">Delete</button>
      </div>
      <div id="category-products-${category.id}" class="sublist"></div>
    `;

    container.appendChild(card);

    if (productsInCategory.length) {
      showCategoryProducts(category.id);
    }
  });
}

function renderProducts() {
  const container = document.getElementById("productsList");
  if (!container) return;

  container.innerHTML = "";

  if (!state.products.length) {
    container.innerHTML = '<div class="empty">No products found.</div>';
    return;
  }

  state.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      ${product.imageURL ? `<img src="${product.imageURL}" alt="${product.name}" />` : ""}
      <h4>${product.name}</h4>
      <p>${product.description || "No description"}</p>
      <p>Cost: ${product.costPrice}</p>
      <p>Price: ${product.price}</p>
      <p>Available: ${product.available ? "true" : "false"}</p>
      <p>Preorder: ${product.preorderAvailable ? "true" : "false"}</p>
      <p>Category: ${product.category ? product.category.name : "None"}</p>
      <div class="meta">
        <button class="secondary" type="button" onclick="loadProductForEdit(${product.id})">Edit</button>
        <button class="danger" type="button" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function loadData() {
  if (!ensureLoggedIn()) return;

  try {
    const categoriesResponse = await apiFetch("/categories");
    if (categoriesResponse.ok) {
      state.categories = await categoriesResponse.json();
    }

    const productsResponse = await apiFetch("/admin/produkts");
    if (productsResponse.ok) {
      state.products = await productsResponse.json();
    }

    renderSummary();
    renderCategories();
    renderProducts();
    fillCategorySelect("categoryId");
    fillCategorySelect("addCategoryId");
    fillProductSelect("addProductId");
    fillProductSelect("editProductSelect");
  } catch (error) {
    console.error(error);
  }
}

async function createCategory() {
  if (!ensureLoggedIn()) return;

  const name = document.getElementById("categoryName").value.trim();
  const description = document.getElementById("categoryDescription").value.trim();
  const image = document.getElementById("categoryImage").files[0];

  if (!name || !image) {
    setMessage("categoryMessage", "Name and image are required.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("category", new Blob([JSON.stringify({ name, description })], { type: "application/json" }));
  formData.append("image", image);

  try {
    const response = await apiFetch("/categories", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      setMessage("categoryMessage", text || "Category creation failed.", "error");
      return;
    }

    setMessage("categoryMessage", "Category created successfully.", "success");
    resetForm("categoryForm");
    await loadData();
  } catch (error) {
    setMessage("categoryMessage", "Request failed.", "error");
  }
}

async function deleteCategory(id) {
  if (!ensureLoggedIn()) return;

  const confirmed = window.confirm("Delete this category?");
  if (!confirmed) return;

  const response = await apiFetch(`/categories/${id}`, { method: "DELETE" });
  if (response.ok) {
    setMessage("categoryMessage", "Category deleted.", "success");
    await loadData();
  } else {
    setMessage("categoryMessage", "Could not delete category.", "error");
  }
}

async function showCategoryProducts(id) {
  const response = await apiFetch(`/categories/${id}`);
  const target = document.getElementById(`category-products-${id}`);
  if (!target) return;

  if (!response.ok) {
    target.innerHTML = "<div class='empty'>Unable to load products.</div>";
    return;
  }

  const products = await response.json();
  if (!products.length) {
    target.innerHTML = "<div class='empty'>No products in this category.</div>";
    return;
  }

  const list = document.createElement("ul");
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} • ${product.price}`;
    list.appendChild(li);
  });
  target.innerHTML = "";
  target.appendChild(list);
}

async function createProduct() {
  if (!ensureLoggedIn()) return;

  const name = document.getElementById("productName").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const costPrice = Number(document.getElementById("costPrice").value);
  const price = Number(document.getElementById("price").value);
  const available = document.getElementById("available").value === "true";
  const preorderAvailable = document.getElementById("preorderAvailable").value === "true";
  const categoryId = document.getElementById("categoryId").value;
  const image = document.getElementById("productImage").files[0];

  if (!name || !price || !costPrice || !image) {
    setMessage("productMessage", "Name, price, cost price, and image are required.", "error");
    return;
  }

  const productData = {
    name,
    description,
    costPrice,
    price,
    available,
    preorderAvailable,
    categoryId: categoryId ? Number(categoryId) : null
  };

  const formData = new FormData();
  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  formData.append("image", image);

  try {
    const response = await apiFetch("/admin/produkts", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      setMessage("productMessage", text || "Product creation failed.", "error");
      return;
    }

    setMessage("productMessage", "Product created successfully.", "success");
    resetForm("productForm");
    await loadData();
  } catch (error) {
    setMessage("productMessage", "Request failed.", "error");
  }
}

async function deleteProduct(id) {
  if (!ensureLoggedIn()) return;

  const confirmed = window.confirm("Delete this product?");
  if (!confirmed) return;

  const response = await apiFetch(`/admin/produkts/${id}`, { method: "DELETE" });
  if (response.ok) {
    setMessage("productMessage", "Product deleted.", "success");
    await loadData();
  } else {
    setMessage("productMessage", "Could not delete product.", "error");
  }
}

async function loadProductForEdit(id) {
  const response = await apiFetch(`/admin/produkts/${id}`);
  if (!response.ok) {
    setMessage("editProductMessage", "Failed to load product.", "error");
    return;
  }

  const product = await response.json();
  document.getElementById("editProductName").value = product.name || "";
  document.getElementById("editProductDescription").value = product.description || "";
  document.getElementById("editCostPrice").value = product.costPrice ?? "";
  document.getElementById("editPrice").value = product.price ?? "";
  document.getElementById("editAvailable").value = String(product.available);
  document.getElementById("editPreorderAvailable").value = String(product.preorderAvailable);
  document.getElementById("editCategoryId").value = product.category ? String(product.category.id) : "";
  document.getElementById("editProductId").value = String(product.id);
  document.getElementById("editProductSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function updateProduct() {
  if (!ensureLoggedIn()) return;

  const id = Number(document.getElementById("editProductId").value);
  const name = document.getElementById("editProductName").value.trim();
  const description = document.getElementById("editProductDescription").value.trim();
  const costPrice = Number(document.getElementById("editCostPrice").value);
  const price = Number(document.getElementById("editPrice").value);
  const available = document.getElementById("editAvailable").value === "true";
  const preorderAvailable = document.getElementById("editPreorderAvailable").value === "true";
  const categoryId = document.getElementById("editCategoryId").value;

  if (!id || !name || !price || !costPrice) {
    setMessage("editProductMessage", "Name, price, and cost price are required.", "error");
    return;
  }

  const payload = {
    name,
    description,
    costPrice,
    price,
    available,
    preorderAvailable,
    categoryId: categoryId ? Number(categoryId) : null
  };

  const response = await apiFetch(`/admin/produkts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    setMessage("editProductMessage", "Product updated successfully.", "success");
    await loadData();
  } else {
    const text = await response.text();
    setMessage("editProductMessage", text || "Product update failed.", "error");
  }
}

async function addProductToCategory() {
  if (!ensureLoggedIn()) return;

  const categoryId = document.getElementById("addCategoryId").value;
  const productId = document.getElementById("addProductId").value;

  if (!categoryId || !productId) {
    setMessage("addMessage", "Select both a category and a product.", "error");
    return;
  }

  const response = await apiFetch(`/categories/${categoryId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Number(productId))
  });

  if (response.ok) {
    setMessage("addMessage", "Product added to category.", "success");
    await loadData();
  } else {
    const text = await response.text();
    setMessage("addMessage", text || "Could not add product to category.", "error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (!token()) {
    window.location.href = "/index.html";
    return;
  }

  document.getElementById("logoutButton")?.addEventListener("click", logout);
  document.getElementById("categoryForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    createCategory();
  });
  document.getElementById("productForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    createProduct();
  });
  document.getElementById("productToCategoryForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    addProductToCategory();
  });
  document.getElementById("editProductForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateProduct();
  });
  document.getElementById("editProductSelect")?.addEventListener("change", (event) => {
    const id = event.target.value;
    if (id) {
      loadProductForEdit(Number(id));
    }
  });

  loadData();
});
