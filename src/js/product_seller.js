// Render navbar when page loads
document.addEventListener('DOMContentLoaded', function () {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }

  // Check if user is logged in and has seller role
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No user logged in");
    return;
  }

  if (currentUser.role !== "seller" && currentUser.role !== "admin") {
    console.warn("User does not have seller or admin role");
    return;
  }

  // Initialize the dashboard
  initializeDashboard(currentUser);
});

// Initialize dashboard functionality
function initializeDashboard(currentUser) {
  // update User in Nav Bar
  function updateUserInNav() {
    const navUser = document.getElementById("navUser");
    if (navUser && currentUser.firstName) {
      navUser.innerHTML = currentUser.firstName;
    }
  }

  updateUserInNav();


  (function () {

    // ---------- Storage keys & constants ----------
    const STORAGE_KEY = "products";
    const PENDING_KEY = "pendingEdits";
    const PLACEHOLDER = "";
    const DEFAULT_PRODUCTS = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // ---------- DOM references (Add modal) ----------
    const addProductForm = document.getElementById("addProductForm");
    const addName = document.getElementById("addName");
    const addPrice = document.getElementById("addPrice");
    const addOriginalPrice = document.getElementById("addOriginalPrice");
    const addSalePercentage = document.getElementById("addSalePercentage");
    const addCategory = document.getElementById("addCategory");
    const addStock = document.getElementById("addStock");
    const addSellerId = document.getElementById("addSellerId");
    const addRating = document.getElementById("addRating");
    const addColor = document.getElementById("addColor");
    const addOs = document.getElementById("addOs");
    const addBrand = document.getElementById("addBrand");
    const addOldPrice = document.getElementById("addOldPrice");
    const addSlug = document.getElementById("addSlug");
    const addNotes = document.getElementById("addNotes");
    const addImageUrls = document.getElementById("addImageUrls"); // optional fallback
    const addImageFiles = document.getElementById("addImageFiles"); // new file input
    const addDescription = document.getElementById("addDescription");
    const addSpecsContainer = document.getElementById("addSpecsContainer");
    const addSpecBtn = document.getElementById("addSpecBtn");
    const addCreateAndCloseBtn = document.getElementById("addCreateAndCloseBtn");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const addImg = document.getElementById("addImg");

    // ---------- DOM references (Product modal / edit) ----------
    const productsTbody = document.getElementById("productsTbody");
    const adminPendingContainer = document.getElementById(
      "adminPendingContainer"
    );
    const productModalEl = document.getElementById("productModal");
    const productModal = productModalEl
      ? new bootstrap.Modal(productModalEl)
      : null;
    const modalProductId = document.getElementById("modalProductId");
    const modalImg = document.getElementById("modalImg");
    const modalName = document.getElementById("modalName");
    const modalCategory = document.getElementById("modalCategory");
    const modalPrice = document.getElementById("modalPrice");
    const modalOriginalPrice = document.getElementById("modalOriginalPrice");
    const modalSalePercentage = document.getElementById("modalSalePercentage");
    const modalStock = document.getElementById("modalStock");
    const modalDescription = document.getElementById("modalDescription");
    const modalSpecs = document.getElementById("modalSpecs");
    const modalAddSpecBtn = document.getElementById("modalAddSpecBtn");
    const modalDeleteBtn = document.getElementById("modalDeleteBtn");
    const productFormModal = document.getElementById("productFormModal");
    const modalImageUrls = document.getElementById("modalImageUrls"); // optional fallback
    const modalImageFiles = document.getElementById("modalImageFiles"); // new file input in modal
    const modalSellerId = document.getElementById("modalSellerId");
    const modalRating = document.getElementById("modalRating");
    const modalAdminReview = document.getElementById("modalAdminReview");
    const modalCreatedAt = document.getElementById("modalCreatedAt");
    const modalUpdatedAt = document.getElementById("modalUpdatedAt");
    const modalColor = document.getElementById("modalColor");
    const modalOs = document.getElementById("modalOs");
    const modalBrand = document.getElementById("modalBrand");
    const modalOldPrice = document.getElementById("modalOldPrice");
    const modalSlug = document.getElementById("modalSlug");
    const modalUserComments = document.getElementById("modalUserComments");
    const modalNotes = document.getElementById("modalNotes");

    // ---------- Runtime state ----------
    let PRODUCTS_ARRAY = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentProductId = null;
    let addImageDataUrls = []; // array of data-URLs selected in Add modal
    let modalImageDataUrls = []; // array of data-URLs selected in Edit modal

    // ---------- Helpers ----------
    function escapeHtml(s) {
      if (typeof s !== "string") return s;
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function loadProducts() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          PRODUCTS_ARRAY = DEFAULT_PRODUCTS.slice();
          saveProducts();
        } else {
          PRODUCTS_ARRAY = JSON.parse(raw);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        PRODUCTS_ARRAY = DEFAULT_PRODUCTS.slice();
      }
    }

    function saveProducts() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS_ARRAY));
    }

    function getPendingEdits() {
      try {
        return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
      } catch (e) {
        return [];
      }
    }

    function savePendingEdits(arr) {
      localStorage.setItem(PENDING_KEY, JSON.stringify(arr || []));
    }

    function generateId() {
      return Date.now() + Math.floor(Math.random() * 1000);
    }

    function parseSpecsFromRows(container) {
      const obj = {};
      if (!container) return obj;
      const rows = container.querySelectorAll(".spec-row");
      rows.forEach((r) => {
        const keyInput = r.querySelector(".spec-key-input");
        const valInput = r.querySelector(".spec-val-input");
        if (!keyInput || !valInput) return;
        const k = (keyInput.value || "").trim();
        const v = (valInput.value || "").trim();
        if (k) obj[k] = v;
      });
      return obj;
    }

    function createSpecRow(container, key = "", value = "") {
      if (!container) return null;
      const row = document.createElement("div");
      row.className = "spec-row";
      row.innerHTML = `
      <input class="form-control form-control-sm spec-key-input" placeholder="Key" value="${escapeHtml(
        key
      )}">
      <input class="form-control form-control-sm spec-val-input" placeholder="Value" value="${escapeHtml(
        value
      )}">
      <button type="button" class="btn btn-sm btn-outline-danger spec-remove-btn spec-actions" title="Remove">&times;</button>
    `;
      const btn = row.querySelector(".spec-remove-btn");
      btn.addEventListener("click", () => row.remove());
      container.appendChild(row);
      return row;
    }

    function productHasPending(productId) {
      const pend = getPendingEdits();
      return pend.some((p) => String(p.productId) === String(productId));
    }

    // ---------- Render products table ----------
    function renderProductsTable(items = PRODUCTS_ARRAY) {
      if (!productsTbody) return;
      productsTbody.innerHTML = "";
      if (!Array.isArray(items) || items.length === 0) {
        productsTbody.innerHTML =
          '<tr><td colspan="7" class="text-center py-4">No products found</td></tr>';
        if (adminPendingContainer) adminPendingContainer.innerHTML = "";
        return;
      }

      if (currentUser.role !== "admin") {
        items = items.filter(p => p.sellerId == currentUser.id);
      }
      items.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-product-id", p.id);
        const imgSrc = p.images && p.images[0] ? p.images[0] : PLACEHOLDER;
        const approvalStatus = p.adminReview ? p.adminReview.status : "unknown";
        const isPendingEdit = productHasPending(p.id);
        let badgeClass, badgeText;
        if (isPendingEdit || approvalStatus === "pending") {
          badgeClass = "bg-warning text-dark";
          badgeText = "Pending Review";
        } else if (approvalStatus === "approved") {
          badgeClass = "bg-success";
          badgeText = "Approved";
        } else {
          badgeClass = "bg-secondary";
          badgeText = approvalStatus;
        }
        const statusContent = `<span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>`;

        tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${escapeHtml(
          imgSrc
        )}" class="rounded me-2 prod-img" alt="Product">
            <span>${escapeHtml(p.name)}</span>
          </div>
        </td>
        <td>${escapeHtml(p.category || "")}</td>
        <td>${Number(p.stock || 0)}</td>
        <td>
          $${Number(p.price || 0).toFixed(2)}
          ${p.originalPrice && Number(p.originalPrice) > Number(p.price)
            ? `<small class="text-muted d-block"><s>$${Number(
              p.originalPrice
            ).toFixed(2)}</s> -${Number(p.salePercentage)}%</small>`
            : ""
          }
        </td>
        <td>${statusContent}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary btn-edit" data-id="${p.id
          }" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p.id
          }" title="Delete"><i class="bi bi-trash"></i></button>
        </td>
      `;
        productsTbody.appendChild(tr);
      });

      if (adminPendingContainer) {
        adminPendingContainer.innerHTML = `<button class="btn btn-sm btn-danger" id="btnDeleteAll">Delete All ( ${PRODUCTS_ARRAY.length} )</button>`;
        const btnDeleteAll = document.getElementById("btnDeleteAll");
        if (btnDeleteAll)
          btnDeleteAll.addEventListener("click", () => {
            if (!confirm("Delete all products?")) return;
            PRODUCTS_ARRAY = [];
            saveProducts();
            renderProductsTable();
          });
      }

      productsTbody
        .querySelectorAll(".btn-delete")
        .forEach((b) => b.addEventListener("click", onDeleteClick));
      productsTbody
        .querySelectorAll(".btn-edit")
        .forEach((b) => b.addEventListener("click", onEditClick));
    }

    function onDeleteClick(e) {
      const id = Number(e.currentTarget.dataset.id);
      if (!confirm("Delete product #" + id + "?")) return;
      PRODUCTS_ARRAY = PRODUCTS_ARRAY.filter((p) => Number(p.id) !== id);
      saveProducts();
      renderProductsTable();
    }

    function onEditClick(e) {
      const id = Number(e.currentTarget.dataset.id);
      openProductModal(id);
    }

    // ---------- Open modal for editing ----------
    function openProductModal(id) {
      const product = PRODUCTS_ARRAY.find((p) => Number(p.id) === Number(id));
      if (!product) {
        alert("Product not found");
        return;
      }
      currentProductId = Number(id);
      if (modalProductId) modalProductId.textContent = product.id;
      if (modalImg)
        modalImg.src =
          product.images && product.images[0] ? product.images[0] : PLACEHOLDER;
      if (modalName) modalName.value = product.name || "";
      if (modalCategory) modalCategory.value = product.category || "";
      if (modalPrice) modalPrice.value = product.price || 0;
      if (modalOriginalPrice)
        modalOriginalPrice.value = product.originalPrice || 0;
      if (modalSalePercentage)
        modalSalePercentage.value = product.salePercentage || 0;
      if (modalStock) modalStock.value = product.stock || 0;
      if (modalDescription) modalDescription.value = product.description || "";
      if (modalImageUrls)
        modalImageUrls.value = (product.images || []).join(", ");
      modalImageDataUrls = (product.images || []).slice(); // default to existing images (data-URLs or URLs)
      if (modalSellerId) modalSellerId.value = product.sellerId || "";
      if (modalRating) modalRating.value = product.rating || "";
      if (modalColor) modalColor.value = product.color || "";
      if (modalOs) modalOs.value = product.os || "";
      if (modalBrand) modalBrand.value = product.brand || "";
      if (modalOldPrice) modalOldPrice.value = product.old_price || 0;
      if (modalSlug) modalSlug.value = product.slug || "";
      if (modalNotes) modalNotes.value = product.adminReview ? product.adminReview.notes || "" : "";
      if (modalAdminReview) {
        if (product.adminReview) {
          modalAdminReview.innerHTML = `
          Status: ${escapeHtml(product.adminReview.status || "-")} <br>
          Reviewed By: ${escapeHtml(product.adminReview.reviewedBy || "-")} <br>
          Reviewed At: ${product.adminReview.reviewedAt || "-"} <br>
          Notes: ${escapeHtml(product.adminReview.notes || "-")} <br>
          Approval Date: ${product.adminReview.approvalDate || "-"}
        `;
        } else {
          modalAdminReview.innerHTML = "-";
        }
      }
      if (modalCreatedAt) modalCreatedAt.textContent = product.createdAt || "-";
      if (modalUpdatedAt) modalUpdatedAt.textContent = product.updatedAt || "-";
      if (modalUserComments) {
        modalUserComments.innerHTML = "";
        if (product.userComments && product.userComments.length > 0) {
          product.userComments.forEach((c) => {
            const div = document.createElement("div");
            div.className = "comment-item mb-2 border-bottom pb-2";
            div.innerHTML = `
            <strong>${escapeHtml(c.username || "")}</strong> - Rating: ${c.rating || 0}/5 <br>
            ${escapeHtml(c.comment || "")} <br>
            <small>Created: ${c.createdAt || "-"} | Helpful: ${c.helpful || 0} | Verified: ${c.verified ? "Yes" : "No"}</small>
          `;
            modalUserComments.appendChild(div);
          });
        } else {
          modalUserComments.innerHTML = "<p class='text-muted'>No comments yet.</p>";
        }
      }

      if (modalSpecs) {
        modalSpecs.innerHTML = "";
        const specs = product.specifications || {};
        for (const key in specs) createSpecRow(modalSpecs, key, specs[key]);
      }

      if (productModal) productModal.show();
    }

    // modal spec add
    if (modalAddSpecBtn && modalSpecs)
      modalAddSpecBtn.addEventListener("click", () =>
        createSpecRow(modalSpecs, "", "")
      );

    // modal delete
    if (modalDeleteBtn)
      modalDeleteBtn.addEventListener("click", () => {
        if (currentProductId === null) return;
        if (!confirm("Delete product #" + currentProductId + "?")) return;
        PRODUCTS_ARRAY = PRODUCTS_ARRAY.filter(
          (p) => Number(p.id) !== Number(currentProductId)
        );
        saveProducts();
        if (productModal) productModal.hide();
        renderProductsTable();
      });

    // ---------- FILE UPLOAD UTIL ----------
    function readFilesAsDataURLs(fileList) {
      const files = Array.from(fileList || []);
      const readers = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          })
      );
      return Promise.all(readers);
    }

    // Add modal file input change -> update preview and store data-URLs
    if (addImageFiles) {
      addImageFiles.addEventListener("change", async (e) => {
        try {
          if (!e.target.files || e.target.files.length === 0) {
            addImageDataUrls = [];
            if (addImg) addImg.src = PLACEHOLDER;
            return;
          }
          addImageDataUrls = await readFilesAsDataURLs(e.target.files);
          if (addImg && addImageDataUrls.length > 0)
            addImg.src = addImageDataUrls[0];
        } catch (err) {
          console.error("Failed to read add images", err);
        }
      });
    }

    // Modal (edit) file input change -> update preview and store data-URLs
    if (modalImageFiles) {
      modalImageFiles.addEventListener("change", async (e) => {
        try {
          if (!e.target.files || e.target.files.length === 0) {
            modalImageDataUrls = [];
            if (modalImg) modalImg.src = PLACEHOLDER;
            return;
          }
          modalImageDataUrls = await readFilesAsDataURLs(e.target.files);
          if (modalImg && modalImageDataUrls.length > 0)
            modalImg.src = modalImageDataUrls[0];
        } catch (err) {
          console.error("Failed to read modal images", err);
        }
      });
    }

    // ---------- Product edit submit (creates pending if user is seller) ----------
    if (productFormModal) {
      productFormModal.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentProductId === null) return;
        const idx = PRODUCTS_ARRAY.findIndex(
          (p) => Number(p.id) === Number(currentProductId)
        );
        if (idx === -1) {
          alert("Product not found");
          return;
        }

        // choose images priority: modalImageDataUrls (files) -> modalImageUrls (text) -> placeholder
        let imagesToUse = [];
        if (Array.isArray(modalImageDataUrls) && modalImageDataUrls.length > 0) {
          imagesToUse = modalImageDataUrls.slice();
        } else if (modalImageUrls && modalImageUrls.value) {
          imagesToUse = modalImageUrls.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          imagesToUse = [PLACEHOLDER];
        }

        const proposed = {};
        proposed.color = modalColor ? modalColor.value.trim() : PRODUCTS_ARRAY[idx].color;
        proposed.os = modalOs ? modalOs.value.trim() : PRODUCTS_ARRAY[idx].os;
        proposed.brand = modalBrand ? modalBrand.value.trim() : PRODUCTS_ARRAY[idx].brand;
        proposed.old_price = modalOldPrice ? Number(modalOldPrice.value) || 0 : PRODUCTS_ARRAY[idx].old_price;
        proposed.price = modalPrice ? Number(modalPrice.value) || 0 : PRODUCTS_ARRAY[idx].price;
        proposed.id = PRODUCTS_ARRAY[idx].id;
        proposed.slug = modalSlug ? modalSlug.value.trim() : PRODUCTS_ARRAY[idx].slug;
        proposed.name = modalName ? modalName.value.trim() : PRODUCTS_ARRAY[idx].name;
        proposed.description = modalDescription ? modalDescription.value.trim() : PRODUCTS_ARRAY[idx].description;
        proposed.originalPrice = modalOriginalPrice ? Number(modalOriginalPrice.value) || 0 : PRODUCTS_ARRAY[idx].originalPrice;
        proposed.salePercentage = 0;
        proposed.category = modalCategory ? modalCategory.value.trim() : PRODUCTS_ARRAY[idx].category;
        proposed.stock = modalStock ? Number(modalStock.value) || 0 : PRODUCTS_ARRAY[idx].stock;
        proposed.images = imagesToUse;
        proposed.sellerId = modalSellerId ? Number(modalSellerId.value) || null : PRODUCTS_ARRAY[idx].sellerId;
        proposed.rating = modalRating ? Number(modalRating.value) || null : PRODUCTS_ARRAY[idx].rating;
        proposed.userComments = PRODUCTS_ARRAY[idx].userComments || [];
        proposed.specifications = modalSpecs ? parseSpecsFromRows(modalSpecs) : PRODUCTS_ARRAY[idx].specifications;
        proposed.createdAt = PRODUCTS_ARRAY[idx].createdAt;
        proposed.updatedAt = PRODUCTS_ARRAY[idx].updatedAt;
        proposed.adminReview = PRODUCTS_ARRAY[idx].adminReview || null;

        if (
          proposed.originalPrice > 0 &&
          proposed.originalPrice >= proposed.price
        ) {
          proposed.salePercentage = Math.round(
            ((proposed.originalPrice - proposed.price) / proposed.originalPrice) *
            100
          );
        } else {
          proposed.salePercentage = 0;
        }


        console.log(proposed);

        // If admin: apply changes directly to the product list
        if (currentUser && (currentUser.role === "admin")) {
          const original = PRODUCTS_ARRAY[idx];
          const updated = Object.assign({}, original, proposed);
          updated.id = original.id;
          updated.updatedAt = new Date().toISOString();
          updated.adminReview = {
            status: "approved",
            reviewedBy: currentUser.email,
            reviewedAt: new Date().toISOString(),
            notes: original.adminReview ? original.adminReview.notes || "" : "",
            approvalDate: new Date().toISOString(),
          };
          PRODUCTS_ARRAY[idx] = updated;
          saveProducts();
          if (productModal) productModal.hide();
          renderProductsTable();
          renderAdminPendingButton();
          showNotification("Product updated successfully.");
        } else {
          // Seller: create a pending edit for admin approval
          const pendings = getPendingEdits();
          const pendingItem = {
            pendingId: generateId(),
            productId: currentProductId,
            sellerId: currentUser ? currentUser.id : null,
            proposedProduct: Object.assign({}, PRODUCTS_ARRAY[idx], proposed, {
              // keep adminReview untouched on the real product; mark pending here only
              adminReview: Object.assign({}, PRODUCTS_ARRAY[idx].adminReview || {}, { status: "pending" })
            }),
            createdAt: new Date().toISOString(),
          };
          pendings.push(pendingItem);
          savePendingEdits(pendings);
          if (modalAdminReview) modalAdminReview.innerHTML = "Pending review";
          if (productModal) productModal.hide();
          renderProductsTable();
          renderAdminPendingButton();
          showNotification("Your edit has been submitted for admin approval.");
        }
      });
    }

    // ---------- Add Product Modal logic ----------
    if (openAddModalBtn) {
      openAddModalBtn.addEventListener("click", () => {
        if (!addProductForm) return;
        addProductForm.reset();
        if (addImageUrls) addImageUrls.value = "";
        addImageDataUrls = [];
        if (addImageFiles) addImageFiles.value = "";
        if (addSpecsContainer) addSpecsContainer.innerHTML = "";
        if (addImg) addImg.src = PLACEHOLDER;
        if (addSalePercentage) addSalePercentage.value = 0;
        if (addCategory) addCategory.value = "Smartphones";
        if (addNotes) addNotes.value = "";
        // initial spec rows
        if (addSpecsContainer) {
          createSpecRow(addSpecsContainer, "Processor", "");
          createSpecRow(addSpecsContainer, "Display", "");
          createSpecRow(addSpecsContainer, "RAM", "");
          createSpecRow(addSpecsContainer, "Storage", "");
        }
      });
    }

    if (addSpecBtn && addSpecsContainer)
      addSpecBtn.addEventListener("click", () =>
        createSpecRow(addSpecsContainer, "", "")
      );

    // recalc sale % on add modal
    if (addPrice && addOriginalPrice && addSalePercentage) {
      [addPrice, addOriginalPrice].forEach((el) => {
        el.addEventListener("input", () => {
          const price = Number(addPrice.value) || 0;
          const original = Number(addOriginalPrice.value) || 0;
          let sale = 0;
          if (original > 0 && original >= price)
            sale = Math.round(((original - price) / original) * 100);
          addSalePercentage.value = sale;
        });
      });
    }

    // fallback preview if user types URLs (only when no files selected)
    if (addImageUrls && addImg)
      addImageUrls.addEventListener("input", () => {
        if (
          addImageFiles &&
          addImageFiles.files &&
          addImageFiles.files.length > 0
        )
          return;
        const urls = (addImageUrls.value || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        addImg.src = urls[0] || PLACEHOLDER;
      });

    // ---------- Handle create product (Add modal) ----------

    function handleAddModalCreate(closeAfter) {
      const imagesFromUrls = addImageUrls
        ? (addImageUrls.value || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        : [];
      const p = {};
      p.color = addColor ? addColor.value.trim() : "";
      p.os = addOs ? addOs.value.trim() : "";
      p.brand = addBrand ? addBrand.value.trim() : "";
      p.old_price = addOldPrice ? Number(addOldPrice.value) || 0 : 0;
      p.price = addPrice ? Number(addPrice.value) || 0 : 0;
      p.id = null;
      p.slug = addSlug ? addSlug.value.trim() : "";
      p.name = addName ? addName.value.trim() : "";
      p.description = addDescription ? addDescription.value.trim() : "";
      p.originalPrice = addOriginalPrice ? Number(addOriginalPrice.value) || 0 : 0;
      p.salePercentage = 0;
      p.category = addCategory ? addCategory.value.trim() || "Smartphones" : "Smartphones";
      p.stock = addStock ? Number(addStock.value) || 0 : 0;
      p.images =
        Array.isArray(addImageDataUrls) && addImageDataUrls.length > 0
          ? addImageDataUrls.slice()
          : imagesFromUrls.length > 0
            ? imagesFromUrls
            : [PLACEHOLDER];
      p.sellerId = currentUser.role === "admin" ? (addSellerId ? Number(addSellerId.value) || null : null) : currentUser.id;
      p.rating = addRating && addRating.value ? Number(addRating.value) : null;
      p.adminReview =
      {
        status: "pending",
        reviewedBy: currentUser.email,
        reviewedAt: new Date().toISOString(),
        notes: addNotes ? addNotes.value.trim() : "",
        approvalDate: new Date().toISOString(),
      };
      p.userComments = [];
      p.specifications = addSpecsContainer
        ? parseSpecsFromRows(addSpecsContainer)
        : {};
      p.createdAt = new Date().toISOString();
      p.updatedAt = null;
      console.log(currentUser.firstName);

      // validations
      if (!p.name) {
        alert("Name required");
        return;
      }
      if (!(p.price > 0)) {
        alert("Price must be > 0");
        return;
      }

      // sale %
      if (p.originalPrice > 0 && p.originalPrice >= p.price)
        p.salePercentage = Math.round(
          ((p.originalPrice - p.price) / p.originalPrice) * 100
        );
      else p.salePercentage = 0;

      p.id = generateId();


      p.adminReview.status = "pending";

      PRODUCTS_ARRAY.push(p);
      saveProducts();
      renderProductsTable();

      if (closeAfter) {
        const addModalEl = document.getElementById("addProductModal");
        const modalInstance = bootstrap.Modal.getInstance(addModalEl);
        if (modalInstance) modalInstance.hide();
      } else {
        addProductForm.reset();
        if (addImageFiles) addImageFiles.value = "";
        addImageDataUrls = [];
        if (addImageUrls) addImageUrls.value = "";
        if (addSpecsContainer) addSpecsContainer.innerHTML = "";
        if (addImg) addImg.src = PLACEHOLDER;
        if (addSalePercentage) addSalePercentage.value = 0;
      }

      showNotification("Product created and marked as pending admin review.");
      renderAdminPendingButton();
    }

    if (addProductForm)
      addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleAddModalCreate(false);
      });
    if (addCreateAndCloseBtn)
      addCreateAndCloseBtn.addEventListener("click", () =>
        handleAddModalCreate(true)
      );

    // ---------- Public API helpers (optional) ----------
    window.setProducts = function (newArray) {
      if (!Array.isArray(newArray))
        throw new Error("setProducts expects an array");
      PRODUCTS_ARRAY = newArray.map((item) => {
        const copy = Object.assign({}, item);
        if (!copy.id) copy.id = generateId();
        return copy;
      });
      saveProducts();
      renderProductsTable();
    };
    window.getProducts = function () {
      return PRODUCTS_ARRAY.map((p) => JSON.parse(JSON.stringify(p)));
    };

    // ---------- Pending edits admin functions ----------
    function renderPendingEditsList() {
      const tbody = document.getElementById("pendingEditsTbody");
      if (!tbody) return;
      const pendings = getPendingEdits();
      tbody.innerHTML = "";
      pendings.forEach((p, idx) => {
        const seller = users.find((u) => u.id === p.sellerId) || {
          firstName: "Unknown",
          lastName: "",
        };
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${p.productId || "-"}</td>
        <td>${escapeHtml(p.proposedProduct.name || "-")}</td>
        <td>${escapeHtml(seller.firstName + " " + seller.lastName)}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="viewPendingDetail(${p.pendingId
          })">View</button>
          <button class="btn btn-sm btn-success me-1" onclick="approvePending(${p.pendingId
          })">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="rejectPending(${p.pendingId
          })">Reject</button>
        </td>
      `;
        tbody.appendChild(tr);
      });
    }

    // open plain window with JSON for quick review

    window.viewPendingDetail = function (pendingId) {
      const p = getPendingEdits().find(
        (x) => Number(x.pendingId) === Number(pendingId)
      );
      if (!p) {
        alert("Not found");
        return;
      }
      const pretty = JSON.stringify(p.proposedProduct, null, 2);
      const win = window.open("", "_blank", "width=700,height=600,scrollbars=1");
      win.document.write("<pre>" + escapeHtml(pretty) + "</pre>");
    };

    window.approvePending = function (pendingId) {
      if (!confirm("Approve this edit?")) return;
      const pendings = getPendingEdits();
      const idx = pendings.findIndex(
        (p) => Number(p.pendingId) === Number(pendingId)
      );
      if (idx === -1) {
        alert("Not found");
        return;
      }

      const products = PRODUCTS_ARRAY.slice();
      const pending = pendings[idx];
      const prodIndex = products.findIndex(
        (pr) => String(pr.id) === String(pending.productId)
      );
      if (prodIndex !== -1) {
        const original = products[prodIndex];
        const updated = Object.assign({}, original, pending.proposedProduct);
        updated.id = original.id;
        updated.updatedAt = new Date().toISOString();
        updated.adminReview = {
          status: "approved",
          reviewedBy: currentUser ? currentUser.email : "admin",
          reviewedAt: new Date().toISOString(),
          notes: original.adminReview ? original.adminReview.notes || "" : "",
          approvalDate: new Date().toISOString(),
        };
        products[prodIndex] = updated;
      } else {
        const newProd = Object.assign({}, pending.proposedProduct);
        newProd.id = pending.productId || generateId();
        newProd.createdAt = newProd.createdAt || new Date().toISOString();
        newProd.updatedAt = new Date().toISOString();
        newProd.adminReview = {
          status: "approved",
          reviewedBy: currentUser ? currentUser.email : "admin",
          reviewedAt: new Date().toISOString(),
          notes: "",
          approvalDate: new Date().toISOString(),
        };
        products.push(newProd);
      }

      PRODUCTS_ARRAY = products;
      saveProducts();

      // remove pending

      pendings.splice(idx, 1);
      savePendingEdits(pendings);

      renderProductsTable();
      renderPendingEditsList();
      renderAdminPendingButton();
      showNotification("Edit approved and product updated.");
    };

    window.rejectPending = function (pendingId) {
      if (!confirm("Reject this edit?")) return;
      const pendings = getPendingEdits();
      const idx = pendings.findIndex(
        (p) => Number(p.pendingId) === Number(pendingId)
      );

      if (idx === -1) {
        alert("Not found");
        return;
      }

      pendings.splice(idx, 1);
      savePendingEdits(pendings);
      renderPendingEditsList();
      renderAdminPendingButton();
      alert("Edit rejected and removed.");
    };

    function renderAdminPendingButton() {
      if (!adminPendingContainer) return;
      adminPendingContainer.innerHTML = "";
      if (currentUser && currentUser.role === "admin") {
        const count = getPendingEdits().length;
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-warning btn-sm";
        btn.type = "button";
        btn.setAttribute("data-bs-toggle", "modal");
        btn.setAttribute("data-bs-target", "#pendingEditsModal");
        btn.textContent = `Pending Edits (${count})`;
        adminPendingContainer.appendChild(btn);

        const pendModalEl = document.getElementById("pendingEditsModal");
        if (pendModalEl)
          pendModalEl.addEventListener("show.bs.modal", renderPendingEditsList, {
            once: false,
          });
      } else {
        const pendings = getPendingEdits().filter(
          (p) => currentUser && p.sellerId === currentUser.id
        );
        if (pendings.length > 0) {
          const span = document.createElement("span");
          span.className = "small text-muted";
          span.textContent = `Your pending edits: ${pendings.length}`;
          adminPendingContainer.appendChild(span);
        }
      }
    }

    // ---------- Init ----------
    loadProducts();
    renderProductsTable();
    renderAdminPendingButton();

    // dblclick open product
    if (productsTbody) {
      productsTbody.addEventListener("dblclick", (e) => {
        const row = e.target.closest("tr");
        if (!row) return;
        const idx = Array.from(productsTbody.querySelectorAll("tr")).indexOf(row);
        if (idx >= 0 && PRODUCTS_ARRAY[idx])
          openProductModal(PRODUCTS_ARRAY[idx].id);
      });
    }
  })(); // Close the IIFE

} // Close the initializeDashboard function
