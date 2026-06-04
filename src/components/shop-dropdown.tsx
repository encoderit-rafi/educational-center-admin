import { MapPin, Check, ChevronsUpDown, Settings } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ShopDropdown() {
  const { shops, selectedShop, setSelectedShop } = useShop();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!shops.length) return null;

  const isAllSelected = !selectedShop;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between gap-2 border-dashed"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="size-4 shrink-0 text-primary dark:text-white" />
            <span className="truncate">
              {selectedShop?.name ?? t("topbar.allShops")}
            </span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-1" align="center">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={async () => {
              await setSelectedShop(null);
              setOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
              isAllSelected
                ? "bg-primary/10 text-primary dark:text-white dark:bg-primary font-medium"
                : "hover:bg-muted"
            )}
          >
            <MapPin className="size-3.5 shrink-0" />
            <span className="flex-1 truncate">{t("topbar.allShops")}</span>
            {isAllSelected && <Check className="size-4 shrink-0" />}
          </button>
          {shops.map((shop) => {
            const isSelected = selectedShop?.id === shop.id;
            return (
              <button
                key={shop.id}
                onClick={async () => {
                  await setSelectedShop(shop);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left",
                  isSelected
                    ? "bg-primary/10 text-primary dark:text-white dark:bg-primary font-medium"
                    : "hover:bg-muted",
                  !shop.is_active && "opacity-50"
                )}
              >
                <MapPin className="size-3.5 shrink-0" />
                <span className="flex-1 truncate">{shop.name}</span>
                {isSelected && <Check className="size-4 shrink-0" />}
              </button>
            );
          })}
          <div className="mt-1 pt-1 border-t">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/shops" as never });
                }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left w-full hover:bg-muted"
            >
              <Settings className="size-3.5 shrink-0" />
              <span className="flex-1 truncate">{t("topbar.manageShops")}</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
