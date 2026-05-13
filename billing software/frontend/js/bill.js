// ================= INVENTORY PRICES =================
const inventoryPrices = {
  "Amoxicillin 500mg": 50,
  "Cough Syrup (Adult)": 90,
  "Insulin Glargine": 450,
  "Omeprazole 20mg": 35,
  "Paracetamol 650mg": 25,
  "Vitamin D3 1000IU": 60,
  "Paracetamol 500mg": 20,
  "Ibuprofen 200mg": 30,
  "Azithromycin 250mg": 80,
  // "Dollo 650mg": 20
};

// ================= BILLING PRODUCTS (SEARCH) =================
const products = [
  { name:'Paracetamol 500mg', price:20 },
  { name:'Paracetamol 650mg', price:25 },
  { name:'Ibuprofen 200mg', price:30 },
  { name:'Azithromycin 250mg', price:80 }
];

const searchInput   = document.getElementById('productSearch');
const suggestionBox = document.getElementById('suggestions');
const qtyInput      = document.getElementById('qtyInput');
const billBody      = document.querySelector('#billTable tbody');

let selectedProduct = null;

// ================= SEARCH =================
searchInput.addEventListener('input',()=>{
  const val = searchInput.value.toLowerCase();
  suggestionBox.innerHTML = '';
  if(!val){ suggestionBox.style.display='none'; return }

  products.filter(p=>p.name.toLowerCase().includes(val))
  .forEach(p=>{
    const d = document.createElement('div');
    d.textContent = `${p.name} - ₹${p.price}`;
    d.onclick = ()=>{
      selectedProduct = p;
      searchInput.value = p.name;
      suggestionBox.style.display='none';
    }
    suggestionBox.appendChild(d);
  });

  suggestionBox.style.display='block';
});

// ================= ADD ITEM FROM BILL PAGE =================
function addItem(){
  if(!selectedProduct) return alert("Select product");

  const qty = +qtyInput.value || 1;

  let billItems = JSON.parse(localStorage.getItem("billItems")) || [];
  const found = billItems.find(i => i.name === selectedProduct.name);

  if(found){
    found.qty += qty;
  } else {
    billItems.push({ name: selectedProduct.name, qty });
  }

  localStorage.setItem("billItems", JSON.stringify(billItems));
  renderBill();

  selectedProduct = null;
  searchInput.value = '';
  qtyInput.value = 1;
}

// ================= RENDER BILL =================
function renderBill(){
  billBody.innerHTML = '';

  const billItems = JSON.parse(localStorage.getItem("billItems")) || [];

  billItems.forEach(item=>{
    const price = inventoryPrices[item.name] || 0;
    const total = item.qty * price;

    const tr = document.createElement('tr');
    tr.dataset.name = item.name;
    tr.dataset.price = price;

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.name}',-1)">−</button>
          <span class="qty-number">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}',1)">+</button>
        </div>
      </td>
      <td>₹${price}</td>
      <td class="rowTotal">₹${total}</td>
      <td>
        <button class="delete-btn" onclick="removeItem('${item.name}')">🗑</button>
      </td>
    `;

    billBody.appendChild(tr);
  });

  updateSummary();
}

// ================= QTY CHANGE =================
function changeQty(name, delta){
  let billItems = JSON.parse(localStorage.getItem("billItems")) || [];
  const item = billItems.find(i => i.name === name);
  if(!item) return;

  item.qty += delta;
  if(item.qty <= 0){
    billItems = billItems.filter(i => i.name !== name);
  }

  localStorage.setItem("billItems", JSON.stringify(billItems));
  renderBill();
}

// ================= REMOVE ITEM =================
function removeItem(name){
  let billItems = JSON.parse(localStorage.getItem("billItems")) || [];
  billItems = billItems.filter(i => i.name !== name);
  localStorage.setItem("billItems", JSON.stringify(billItems));
  renderBill();
}

// ================= SUMMARY =================
function updateSummary(){
  let subtotal = 0;
  document.querySelectorAll('.rowTotal').forEach(td=>{
    subtotal += +td.innerText.replace('₹','');
  });

  const gst = subtotal * 0.05;
  document.getElementById('subTotal').innerText = `₹${subtotal}`;
  document.getElementById('gst').innerText = `₹${gst.toFixed(2)}`;
  document.getElementById('grandTotal').innerText = `₹${(subtotal+gst).toFixed(2)}`;
}

// ================= INIT =================
renderBill();
