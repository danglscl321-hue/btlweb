(function () {
  const CART_KEY = "btl_cart_v1";
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function formatPrice(p) {
    return "$" + Number(p).toLocaleString();
  }

  function renderCart() {
    const container = document.getElementById("cart-container");
    if (!container) return;
    const itemsEl = container.querySelector("#cart-items");
    itemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((it, idx) => {
      total += it.price * it.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
                <label class="cart-select" style="display:flex; align-items:center; gap:0.6rem;">
                  <input type="checkbox" class="cart-item-select" data-idx="${idx}">
                  <img src="${it.image}" alt="${it.name}">
                </label>
                <div class="info">
                    <h4>${it.name}</h4>
                    <p>
                      ${formatPrice(it.price)} &times; 
                      <span class="qty-display" data-idx="${idx}">${it.qty}</span>
                      = <strong class="line-subtotal">${formatPrice(it.price * it.qty)}</strong>
                    </p>
                    <div class="qty-controls">
                      <button class="qty-decrease" data-idx="${idx}">-</button>
                      <button class="qty-increase" data-idx="${idx}">+</button>
                    </div>
                </div>
                <div class="remove" data-idx="${idx}">&times;</div>
            `;
      itemsEl.appendChild(div);
    });
    const totalEl = container.querySelector("#cart-total-amount");
    if (totalEl)
      totalEl.textContent = (Math.round(total * 100) / 100).toFixed(2);

    container.querySelectorAll(".remove").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const idx = Number(e.target.dataset.idx);
        if (!isNaN(idx)) {
          cart.splice(idx, 1);
          save();
          renderCart();
          updateCartCount();
        }
      })
    );

    // qty controls
    container.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.target.dataset.idx);
        if (!isNaN(idx) && cart[idx]) {
          cart[idx].qty += 1;
          save();
          renderCart();
          updateCartCount();
        }
      });
    });
    container.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.target.dataset.idx);
        if (!isNaN(idx) && cart[idx]) {
          cart[idx].qty = Math.max(1, cart[idx].qty - 1);
          save();
          renderCart();
          updateCartCount();
        }
      });
    });
    // selection handlers (ensure checkbox state persisted visually)
    container.querySelectorAll('.cart-item-select').forEach(cb => {
      cb.addEventListener('change', () => {
        // nothing else needed, we'll read checked boxes when actions pressed
      });
    });
  }

  function updateCartCount() {
    const btn = document.getElementById("cart-count");
    if (!btn) return;
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    btn.textContent = totalQty;
  }

  function addToCart(item) {
    const existing = cart.find((i) => i.name === item.name);
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    save();
    renderCart();
    updateCartCount();
  }

  function clearCart() {
    cart = [];
    save();
    renderCart();
    updateCartCount();
  }

  // expose addToCart globally
  window.__BTL_ADD_TO_CART = addToCart;

  document.addEventListener("DOMContentLoaded", () => {
    // toggle
    const toggle = document.getElementById("cart-btn");
    const container = document.getElementById("cart-container");
    if (toggle && container) {
      toggle.addEventListener("click", () =>
        container.classList.toggle("active")
      );
    }
    // close
    const close = container ? container.querySelector("#close-cart") : null;
    if (close)
      close.addEventListener("click", () =>
        container.classList.remove("active")
      );
    // clear all
    const clearBtn = container ? container.querySelector('#clear-cart-btn') : null;
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (cart.length === 0) { alert('Giỏ hàng trống'); return; }
      if (confirm('Xác nhận xóa toàn bộ giỏ hàng?')) {
        clearCart();
      }
    });
    // remove selected
    const removeSelected = container ? container.querySelector('#remove-selected-btn') : null;
    if (removeSelected) removeSelected.addEventListener('click', () => {
      const checked = Array.from(container.querySelectorAll('.cart-item-select:checked')).map(n => Number(n.dataset.idx)).sort((a,b)=>b-a);
      if (checked.length === 0) { alert('Chưa chọn mục nào'); return; }
      if (!confirm('Xác nhận xóa các mục được chọn?')) return;
      checked.forEach(i => { if (!isNaN(i)) cart.splice(i,1); });
      save(); renderCart(); updateCartCount();
    });
    // checkout selected
    const checkoutSelected = container ? container.querySelector('#checkout-selected-btn') : null;
    if (checkoutSelected) checkoutSelected.addEventListener('click', () => {
      const checked = Array.from(container.querySelectorAll('.cart-item-select:checked')).map(n => Number(n.dataset.idx)).sort((a,b)=>b-a);
      if (checked.length === 0) { alert('Chưa chọn mục nào'); return; }
      const items = checked.map(i => cart[i]);
      const amount = items.reduce((s,it)=>s+it.price*it.qty,0).toFixed(2);
      if (confirm(`Xác nhận thanh toán các mục chọn: $${amount}?`)) {
        // remove purchased items
        checked.forEach(i => { if (!isNaN(i)) cart.splice(i,1); });
        save(); renderCart(); updateCartCount();
        alert('Thanh toán mục chọn thành công. Cảm ơn bạn!');
      }
    });
    // checkout
    const checkout = container
      ? container.querySelector("#checkout-btn")
      : null;
    if (checkout)
      checkout.addEventListener("click", () => {
        if (cart.length === 0) {
          alert("Giỏ hàng trống");
          return;
        }
        const amount = container.querySelector("#cart-total-amount").textContent;
        if (confirm(`Xác nhận thanh toán: $${amount}?`)) {
          alert('Thanh toán thành công. Cảm ơn bạn!');
          clearCart();
          container.classList.remove('active');
        }
      });

    renderCart();
    updateCartCount();

    // attach add-to-cart buttons if present
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name =
          btn.dataset.name ||
          btn.closest(".box")?.querySelector("h3")?.textContent?.trim() ||
          "Item";
        const price = Number(btn.dataset.price || 0);
        const image =
          btn.dataset.image ||
          btn.closest(".box")?.querySelector("img")?.getAttribute("src") ||
          "";
        addToCart({ name, price, image, qty: 1 });
        alert(`Đã thêm ${name} vào giỏ hàng`);
      });
    });
  });
  // expose clear function
  window.__BTL_CLEAR_CART = clearCart;

})();
