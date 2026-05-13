// ================= INVENTORY DATA =================
const data = [
  {name:"Amoxicillin 500mg",cat:"Antibiotics",stock:250,unit:"Box",exp:"2025-10-01",sup:"PharmaCore",status:"In"},
  {name:"Dollo 650mg",cat:"Cold & Flu",stock:200,unit:"Strip",exp:"2025-09-10",sup:"MedSupply",status:"In"},
  {name:"Cough Syrup (Adult)",cat:"Cold & Flu",stock:120,unit:"Bottle",exp:"2025-01-30",sup:"PharmaCore",status:"In"},
  {name:"Insulin Glargine",cat:"Diabetic Care",stock:15,unit:"Vial",exp:"2024-06-25",sup:"BioLife",status:"Low"},
  {name:"Omeprazole 20mg",cat:"Antacids",stock:180,unit:"Strip",exp:"2026-03-20",sup:"Global Health",status:"In"},
  {name:"Paracetamol 650mg",cat:"Pain Relief",stock:50,unit:"Strip",exp:"2024-07-15",sup:"MedSupply",status:"Low"},
  {name:"Vitamin D3 1000IU",cat:"Supplements",stock:30,unit:"Bottle",exp:"2024-05-10",sup:"NutriWell",status:"Low"},
];

const tbody = document.getElementById("tbody");
const info  = document.getElementById("info");

let editingIndex = null;
let isAddingNew = false;

// ================= RENDER =================
function renderInventory(list = data){

  tbody.innerHTML = "";

  list.forEach((d, index)=>{

    const row = document.createElement("tr");

    const isEditing = editingIndex === index;

    row.innerHTML = `
      <td>
        ${isEditing ? `<input class="edit-input" id="name-${index}" value="${d.name}">` : d.name}
      </td>

      <td>
        ${isEditing ? `<input class="edit-input" id="cat-${index}" value="${d.cat}">` : d.cat}
      </td>

      <td>
        ${isEditing ? `<input class="edit-input" type="number" id="stock-${index}" value="${d.stock}">` : d.stock}
      </td>

      <td>
        ${isEditing ? `<input class="edit-input" id="unit-${index}" value="${d.unit}">` : d.unit}
      </td>

      <td>
        ${isEditing ? `<input class="edit-input" type="date" id="exp-${index}" value="${d.exp}">` : d.exp}
      </td>

      <td>
        ${isEditing ? `<input class="edit-input" id="sup-${index}" value="${d.sup}">` : d.sup}
      </td>

      <td>
        ${isEditing 
          ? ""
          : `<span class="status ${d.status==='Low'?'low':'in'}">
               ${d.status==='Low'?'Low Stock':'In Stock'}
             </span>`
        }
      </td>

      <td>
        ${isEditing
          ? `
            <button class="save-btn" onclick="saveEdit(${index})">Save</button>
            <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
          `
          : `
            <button class="add-btn" onclick="addInventoryToBill('${d.name}')">Add</button>
            <button class="manage-btn" onclick="startEdit(${index})">Manage</button>
            <i class='bx bx-trash delete-icon' onclick="deleteProduct(${index})"></i>
          `
        }
      </td>
    `;

    tbody.appendChild(row);
  });

  info.innerText = `Showing ${list.length} items`;
}
// ================= START EDIT =================
function startEdit(index){
  if(editingIndex !== null) return;
  editingIndex = index;
  isAddingNew = false;
  renderInventory();
}

// ================= SAVE EDIT =================
function saveEdit(index){

  const product = data[index];

  product.name  = document.getElementById(`name-${index}`).value;
  product.cat   = document.getElementById(`cat-${index}`).value;
  product.stock = Number(document.getElementById(`stock-${index}`).value);
  product.unit  = document.getElementById(`unit-${index}`).value;
  product.exp   = document.getElementById(`exp-${index}`).value;
  product.sup   = document.getElementById(`sup-${index}`).value;

  product.status = product.stock < 20 ? "Low" : "In";

  editingIndex = null;
  isAddingNew = false;

  renderInventory();
}

// ================= CANCEL =================
function cancelEdit(){

  if(isAddingNew){
    data.splice(editingIndex, 1);
  }

  editingIndex = null;
  isAddingNew = false;

  renderInventory();
}

// ================= ADD PRODUCT INLINE =================
const modal = document.getElementById("productModal");

document.getElementById("addProductBtn").addEventListener("click", () => {
  modal.style.display = "flex";
});

function closeModal(){
  modal.style.display = "none";
}
// ================= DELETE =================
window.deleteProduct = function(index){

  const confirmDelete = confirm("Are you sure?");

  if(!confirmDelete) return;

  data.splice(index, 1);
  renderInventory();
};

// ================= BILL =================
function addInventoryToBill(name){
  let billItems = JSON.parse(localStorage.getItem("billItems")) || [];

  const found = billItems.find(item => item.name === name);

  if(found){
    found.qty += 1;
  } else {
    billItems.push({ name, qty: 1 });
  }

  localStorage.setItem("billItems", JSON.stringify(billItems));
  alert(name + " added to bill ✅");
}


window.startEdit = function(index){
  if(editingIndex !== null) return;
  editingIndex = index;
  renderInventory();
}

window.cancelEdit = function(){
  if(isAddingNew){
    data.splice(editingIndex, 1);
  }
  editingIndex = null;
  isAddingNew = false;
  renderInventory();
}

window.saveEdit = function(index){

  const product = data[index];

  product.name  = document.getElementById(`name-${index}`).value;
  product.cat   = document.getElementById(`cat-${index}`).value;
  product.stock = Number(document.getElementById(`stock-${index}`).value);
  product.unit  = document.getElementById(`unit-${index}`).value;
  product.exp   = document.getElementById(`exp-${index}`).value;
  product.sup   = document.getElementById(`sup-${index}`).value;

  product.status = product.stock < 20 ? "Low" : "In";

  editingIndex = null;
  isAddingNew = false;

  renderInventory();
}

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

function applyFilters(){

  let filtered = [...data];

  // 🔎 SEARCH
  const searchValue = searchInput.value.toLowerCase();
  if(searchValue){
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchValue)
    );
  }

  // 📂 CATEGORY
  const selectedCategory = categoryFilter.value;
  if(selectedCategory !== "All"){
    filtered = filtered.filter(item =>
      item.cat === selectedCategory
    );
  }

  // 🔀 SORT
  const sortValue = sortSelect.value;

  if(sortValue === "az"){
    filtered.sort((a,b)=> a.name.localeCompare(b.name));
  }

  if(sortValue === "za"){
    filtered.sort((a,b)=> b.name.localeCompare(a.name));
  }

  renderInventory(filtered);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);


//================== save input data to local storage =================
function saveProduct(){

  const newProduct = {
    name: document.getElementById("p_name").value,
    cat: document.getElementById("p_category").value,
    stock: Number(document.getElementById("p_stock").value),
    unit: document.getElementById("p_unit").value,
    exp: document.getElementById("p_exp").value,
    sup: document.getElementById("p_supplier").value,
    status: "In"
  };

  if(newProduct.stock < 20){
    newProduct.status = "Low";
  }

  data.push(newProduct);

  closeModal();
  renderInventory();
}

renderInventory();