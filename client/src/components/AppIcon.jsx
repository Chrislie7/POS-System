import {
  CalendarDays,
  Clock3,
  Coffee,
  Cookie,
  CupSoda,
  FileSpreadsheet,
  Filter,
  Flame,
  GlassWater,
  Leaf,
  Lock,
  LogOut,
  Milk,
  Minus,
  Package,
  Plus,
  Printer,
  Receipt,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  Wallet
} from "lucide-react";

const iconMap = {
  coffee: Coffee,
  cup: CupSoda,
  milk: Milk,
  leaf: Leaf,
  water: GlassWater,
  cookie: Cookie,
  sparkles: Sparkles,
  wallet: Wallet,
  order: ShoppingBag,
  package: Package,
  flame: Flame,
  calendar: CalendarDays,
  clock: Clock3,
  sheet: FileSpreadsheet,
  logout: LogOut,
  printer: Printer,
  trash: Trash2,
  plus: Plus,
  minus: Minus,
  user: User,
  lock: Lock,
  receipt: Receipt,
  search: Search,
  filter: Filter
};

function AppIcon({ name, size = 22, strokeWidth = 2, className = "" }) {
  const Icon = iconMap[name] || Coffee;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}

export default AppIcon;
