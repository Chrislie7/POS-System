import AppIcon from "./AppIcon";

function ProductPicker({ products, onAddProduct, onSelectCustom }) {
  return (
    <section className="product-picker">
      <div className="section-head compact-head">
        <div className="tiny-icon-surface cool-surface">
          <AppIcon name="order" size={16} />
        </div>
        <span>Menu</span>
      </div>

      <div className="product-grid visual-grid">
        {products.map((product) => (
          <button key={product.id} className="product-card" type="button" onClick={() => onAddProduct(product)}>
            <div className="product-art icon-surface warm-surface">
              <AppIcon name={product.icon} size={24} />
            </div>
            <strong>{product.nama_barang}</strong>
            <span>Rp {formatCurrency(product.harga)}</span>
          </button>
        ))}

        <button className="product-card custom-card" type="button" onClick={onSelectCustom}>
          <div className="product-art icon-surface cool-surface">
            <AppIcon name="sparkles" size={24} />
          </div>
          <strong>Custom</strong>
          <span>Tambah manual</span>
        </button>
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default ProductPicker;
