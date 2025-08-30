// === Cart Badge: تحديث تلقائي مع أي تغيير في localStorage ===
(function setupCartBadge() {
  const CART_KEY = "cart";

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function calcTotalQty(list) {
    return list.reduce((s, i) => s + (Number(i.qty) || 0), 0);
  }

  function drawBadge() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const total = calcTotalQty(readCart());
    el.textContent = total;
    el.style.display = total > 0 ? "inline-block" : "none";
  }

  // نعرّضها لو عايز تناديها يدويًّا
  window.updateCartBadge = drawBadge;

  // أول تحميل
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", drawBadge);
  } else {
    drawBadge();
  }

  // يتحدّث لو اتغير من تاب تانية
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) drawBadge();
  });

  // نهوك أي set/remove على localStorage للكارت (حتى في نفس الصفحة)
  const _setItem = localStorage.setItem;
  localStorage.setItem = function (key, val) {
    _setItem.apply(this, arguments);
    if (key === CART_KEY) drawBadge();
  };

  const _removeItem = localStorage.removeItem;
  localStorage.removeItem = function (key) {
    _removeItem.apply(this, arguments);
    if (key === CART_KEY) drawBadge();
  };

  // احتياط: لما ترجع الفوكس أو الصفحة تبقى مرئية
  window.addEventListener("focus", drawBadge);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) drawBadge();
  });
})();
