import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { shopService } from "@/services/shops";
import type { Shop } from "@/types/barber-shop";
import type { User } from "@/hooks/useCurrentUser";

interface ShopContextValue {
  shops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => Promise<void>;
  isLoading: boolean;
  refetchShops: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children, user }: { children: ReactNode; user: User | null }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShopState] =
    useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const fetchShops = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopService.getAll();
      const shops = res.data ?? [];
      setShops(shops);

      if (user?.selected_shop_id) {
        const savedShop = shops.find((s) => s.id === user.selected_shop_id);
        if (savedShop) {
          setSelectedShopState(savedShop);
        } else {
          setSelectedShopState(null);
        }
      } else {
        setSelectedShopState(null);
      }
    } catch {
      // Silently fail — the layout will still render
    } finally {
      setIsLoading(false);
    }
  }, [user?.selected_shop_id, isAdmin]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const setSelectedShop = useCallback(async (shop: Shop | null) => {
    setSelectedShopState(shop);
    if (!isAdmin) return;

    if (shop) {
      try {
        await shopService.select(shop.id);
      } catch {
        // Silently fail — local selection persists
      }
    } else {
      try {
        await shopService.selectAll();
      } catch {
        // Silently fail — local selection persists
      }
    }
    window.location.reload();
  }, [isAdmin]);

  return (
    <ShopContext.Provider
      value={{
        shops,
        selectedShop,
        setSelectedShop,
        isLoading,
        refetchShops: fetchShops,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return ctx;
}
