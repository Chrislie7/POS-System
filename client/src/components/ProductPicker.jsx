function ProductPicker({ products, onAddProduct, onSelectCustom }) {
  return (
    <section className="product-picker">
      <div className="section-head compact-head">
        <h3>??</h3>
        <span>Menu</span>
      </div>

      <div className="product-grid visual-grid">
        {products.map((product) => (
          <button key={product.id} className="product-card" type="button" onClick={() => onAddProduct(product)}>
            <div className="product-art">{product.icon || "?"}</div>
            <strong>{product.nama_barang}</strong>
            <span>Rp {formatCurrency(product.harga)}</span>
          </button>
        ))}

        <button className="product-card custom-card" type="button" onClick={onSelectCustom}>
          <div className="product-art">?</div>
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
