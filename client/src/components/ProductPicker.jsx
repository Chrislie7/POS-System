import { useMemo, useState } from "react";
import AppIcon from "./AppIcon";

function ProductPicker({ products, onAddProduct, onAddCustom }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const categories = useMemo(() => ["All", ...new Set(products.map((item) => item.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = activeCategory === "All" || product.category === activeCategory;
      const matchSearch = product.nama_barang.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  function handleAddCustom() {
    if (!customName.trim() || Number(customPrice) <= 0) {
      return;
    }

    onAddCustom({
      nama_barang: customName.trim(),
      harga: Number(customPrice),
      icon: "sparkles",
      category: "Custom"
    });

    setCustomName("");
    setCustomPrice("");
    setCustomOpen(false);
  }

  return (
    <section className="catalog-panel panel">
      <div className="catalog-header">
        <div>
          <p className="section-label">Items</p>
          <h2>{activeCategory === "All" ? "All Drinks" : activeCategory}</h2>
        </div>

        <div className="catalog-search-row">
          <label className="search-box">
            <AppIcon name="search" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </label>
          <button className="filter-button" type="button">
            <AppIcon name="filter" size={18} />
          </button>
        </div>
      </div>

      <div className="category-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-pill ${category === activeCategory ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        {filteredProducts.map((product) => (
          <button key={product.id} className="catalog-card" type="button" onClick={() => onAddProduct(product)}>
            <div className="catalog-image icon-surface warm-surface">
              <AppIcon name={product.icon} size={34} />
            </div>
            <div className="catalog-meta">
              <strong>{product.nama_barang}</strong>
              <span>Rp {formatCurrency(product.harga)}</span>
            </div>
            <div className="catalog-add">
              <AppIcon name="plus" size={18} />
            </div>
          </button>
        ))}

        <div className="catalog-card custom-catalog-card">
          <div className="catalog-image icon-surface cool-surface">
            <AppIcon name="sparkles" size={34} />
          </div>
          <div className="catalog-meta">
            <strong>Custom</strong>
            <span>Manual item</span>
          </div>
          <button className="catalog-add" type="button" onClick={() => setCustomOpen((value) => !value)}>
            <AppIcon name={customOpen ? "minus" : "plus"} size={18} />
          </button>

          {customOpen ? (
            <div className="custom-inline-form">
              <label className="search-box compact-search">
                <AppIcon name="sparkles" size={16} />
                <input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Nama" />
              </label>
              <label className="search-box compact-search">
                <AppIcon name="wallet" size={16} />
                <input
                  type="number"
                  min="1"
                  value={customPrice}
                  onChange={(event) => setCustomPrice(event.target.value)}
                  placeholder="Harga"
                />
              </label>
              <button className="primary-button inline-action-button" type="button" onClick={handleAddCustom}>
                Tambah
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default ProductPicker;
