function ProductPicker({ products, selectedProductId, onSelect }) {
  return (
    <div className="product-picker">
      <div className="product-picker-head">
        <span>Pilih produk cepat</span>
        <small>Klik produk preset, atau gunakan custom order di paling akhir.</small>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const isActive = selectedProductId === product.id;
          return (
            <button
              key={product.id}
              className={`product-chip ${isActive ? "is-active" : ""}`}
              type="button"
              onClick={() => onSelect(product.id)}
            >
              <strong>{product.nama_barang}</strong>
              <span>Rp {formatCurrency(product.harga)}</span>
            </button>
          );
        })}

        <button
          className={`product-chip custom-chip ${selectedProductId === "custom" ? "is-active" : ""}`}
          type="button"
          onClick={() => onSelect("custom")}
        >
          <strong>Custom Order</strong>
          <span>Input nama dan harga manual</span>
        </button>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default ProductPicker;
