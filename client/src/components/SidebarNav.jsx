import AppIcon from "./AppIcon";

const navItems = [
  { id: "home", icon: "receipt", active: true },
  { id: "orders", icon: "order" },
  { id: "items", icon: "package" },
  { id: "sheet", icon: "sheet" },
  { id: "settings", icon: "lock" }
];

function SidebarNav() {
  return (
    <aside className="sidebar-rail">
      <div className="sidebar-brand icon-surface warm-surface">
        <AppIcon name="receipt" size={22} />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button key={item.id} className={`sidebar-button ${item.active ? "is-active" : ""}`} type="button">
            <AppIcon name={item.icon} size={18} />
          </button>
        ))}
      </nav>

      <button className="sidebar-button sidebar-power" type="button">
        <AppIcon name="logout" size={18} />
      </button>
    </aside>
  );
}

export default SidebarNav;
