import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Clock } from "lucide-react";
import { format, startOfToday } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { appointmentService } from "@/services/appointments";
import { barberService } from "@/services/barbers";
import { serviceService } from "@/services/services";
import { customerService } from "@/services/customers";
import { settingsService } from "@/services/settings";
import { useShop } from "@/context/ShopContext";
import { extractApiError } from "@/utils/error";
import type { Appointment } from "@/types/barber-shop";

function CreateField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="block text-sm font-medium text-app-text">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  defaultTime?: string;
  editAppointment?: Appointment | null;
};

const blankForm = (defaultDate = "", defaultTime = "") => ({
  shop_id: 0,
  user_id: 0,
  service_id: 0,
  barber_id: 0,
  date: defaultDate,
  time: defaultTime,
  notes: "",
});

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  defaultDate,
  defaultTime,
  editAppointment,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { selectedShop, shops } = useShop();

  const isEditing = !!editAppointment;

  const [form, setForm] = useState(blankForm(defaultDate, defaultTime));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editAppointment) {
      const hasAlternativeDate = !!editAppointment.alternative_starts_at;
      const barberId = editAppointment.alternative_barber?.id ?? editAppointment.barber.id;
      const targetDate = hasAlternativeDate ? editAppointment.alternative_starts_at! : editAppointment.starts_at;
      const parsed = new Date(targetDate);

      setForm({
        shop_id: editAppointment.shop.id,
        user_id: editAppointment.user.id,
        service_id: editAppointment.service.id,
        barber_id: barberId,
        date: format(parsed, "yyyy-MM-dd"),
        time: format(parsed, "HH:mm"),
        notes: editAppointment.notes ?? "",
      });
    }
  }, [editAppointment]);

  // Resolved shop ID: from global selection or from user's dropdown choice
  const shopId = selectedShop?.id ?? (form.shop_id || undefined);

  function resetForm() {
    setForm(blankForm(defaultDate, defaultTime));
    setErrors({});
  }

  // ── Customers ────────────────────────────────────────────────────────────
  const { data: customersData } = useQuery({
    queryKey: ["customers-list"],
    queryFn: () => customerService.getAll({ per_page: 200 }),
    enabled: open,
  });

  // ── Services (filtered by shop) ──────────────────────────────────────────
  const { data: servicesData } = useQuery({
    queryKey: ["services-list", shopId],
    queryFn: () => serviceService.getAll({ shop_id: shopId, per_page: 200 }),
    enabled: open && !!shopId,
  });

  // ── Barbers (filtered by shop, then client-side by service) ──────────────
  const { data: barbersData } = useQuery({
    queryKey: ["barbers-list-shop", shopId],
    queryFn: () => barberService.getAll({ shop_id: shopId, per_page: 200 }),
    enabled: open && !!shopId,
  });

  // ── Shop working hours (to disable closed weekdays) ───────────────────────
  const { data: shopHoursData } = useQuery({
    queryKey: ["shop-hours-dialog", shopId],
    queryFn: () => settingsService.getShopHours(shopId!),
    enabled: open && !!shopId,
    staleTime: 5 * 60_000,
  });

  // ── Shop vacations (to disable vacation date ranges) ─────────────────────
  const { data: shopVacationsData } = useQuery({
    queryKey: ["shop-vacations-dialog"],
    queryFn: () => settingsService.getVacations(),
    enabled: open && !!shopId,
    staleTime: 5 * 60_000,
  });

  // ── Public holidays (to disable holiday date ranges) ─────────────────────
  const { data: holidaysData } = useQuery({
    queryKey: ["holidays-dialog"],
    queryFn: () => settingsService.getHolidays(),
    enabled: open && !!shopId,
    staleTime: 5 * 60_000,
  });

  // ── Barber vacations (fetched when a barber is selected) ─────────────────
  const { data: barberVacationsData } = useQuery({
    queryKey: ["barber-vacations-dialog", form.barber_id],
    queryFn: () => barberService.getVacations(form.barber_id),
    enabled: open && !!form.barber_id,
    staleTime: 5 * 60_000,
  });

  // ── Available slots (barber + service + date all required) ───────────────
  const slotsEnabled =
    open && !!shopId && !!form.barber_id && !!form.service_id && !!form.date;

  const { data: slotsData, isFetching: isLoadingSlots } = useQuery({
    queryKey: [
      "available-slots",
      form.barber_id,
      form.service_id,
      form.date,
      shopId,
    ],
    queryFn: () =>
      appointmentService.getAvailableSlots({
        barber_id: form.barber_id,
        service_id: form.service_id,
        date: form.date,
        shop_id: shopId,
      }),
    enabled: slotsEnabled,
    staleTime: 30_000,
  });

  // ── Derived option lists ─────────────────────────────────────────────────
  const customerOptions = (customersData?.data ?? []).map((c) => ({
    value: c.id,
    label: `${c.name} (${c.email})`,
  }));

  const shopOptions = shops.map((s) => ({
    value: s.id,
    label: s.name + (s.address ? ` — ${s.address}` : ""),
  }));

  const serviceOptions = (servicesData?.data ?? [])
    .filter((s) => s.is_active)
    .map((s) => ({
      value: s.id,
      label: `${s.name} (${s.duration_minutes} min)`,
    }));

  const allShopBarbers = (barbersData?.data ?? []).filter((b) => b.is_active);

  // Only show barbers who offer the selected service
  const barberOptions = (
    form.service_id
      ? allShopBarbers.filter((b) =>
          (b.services ?? []).some((s) => s.id === form.service_id)
        )
      : allShopBarbers
  ).map((b) => ({ value: b.id, label: b.name }));

  const shopHours = shopHoursData?.data ?? [];

  // Filter shop vacations to the active shop only
  const shopVacations = (shopVacationsData?.data ?? []).filter(
    (v) => v.vacationable_id == null || v.vacationable_id === shopId
  );

  // Filter holidays that apply to this shop
  const holidays = (holidaysData?.data ?? []).filter(
    (h) => h.shop_ids.length === 0 || h.shop_ids.includes(shopId!)
  );

  const barberVacations = barberVacationsData?.data ?? [];

  const selectedBarber = useMemo(
    () => allShopBarbers.find((b) => b.id === form.barber_id),
    [allShopBarbers, form.barber_id]
  );

  const allSlots = slotsData?.slots ?? [];

  // ── Disabled-date predicate for the calendar ──────────────────────────────
  function isDateDisabled(date: Date): boolean {
    if (date < startOfToday()) return true;

    const dayOfWeek = date.getDay(); // 0 = Sunday … 6 = Saturday

    // Shop's closed weekdays
    if (shopHours.length > 0) {
      const shopHour = shopHours.find((h) => h.day_of_week === dayOfWeek);
      if (!shopHour || !shopHour.is_open) return true;
    }

    // Barber's non-working weekdays (hours array only contains working days)
    const barberHours = selectedBarber?.hours ?? [];
    if (barberHours.length > 0) {
      const barberHour = barberHours.find((h) => h.day_of_week === dayOfWeek);
      if (!barberHour) return true;
    }

    const dateMD = format(date, "MM-dd");
    const dateStr = format(date, "yyyy-MM-dd");

    // Shop vacation ranges
    for (const vac of shopVacations) {
      if (dateStr >= vac.start_date && dateStr <= vac.end_date) return true;
    }

    // Public holidays (recurring = match month/day regardless of year)
    for (const holiday of holidays) {
      if (holiday.recurs_yearly) {
        const startMD = holiday.start_date.slice(5);
        const endMD = holiday.end_date.slice(5);
        const wraps = endMD < startMD; // holiday spans new year boundary
        if (!wraps && dateMD >= startMD && dateMD <= endMD) return true;
        if (wraps && (dateMD >= startMD || dateMD <= endMD)) return true;
      } else {
        if (dateStr >= holiday.start_date && dateStr <= holiday.end_date)
          return true;
      }
    }

    // Barber vacation ranges
    for (const vac of barberVacations) {
      if (dateStr >= vac.start_date && dateStr <= vac.end_date) return true;
    }

    return false;
  }

  // ── Update mutation (edit mode) ───────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: () =>
      appointmentService.update(editAppointment!.id, {
        service_id: form.service_id,
        barber_id: form.barber_id,
        shop_id: form.shop_id || undefined,
        date: form.date,
        time: form.time,
        notes: form.notes || undefined,
      }),
    onSuccess: () => {
      toast.success(t("page.schedule.appointmentUpdated"));
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onOpenChange(false);
    },
    onError: (error) =>
      toast.error(extractApiError(error, "Failed to update appointment")),
  });

  // ── Create mutation ───────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: () =>
      appointmentService.create({
        user_id: form.user_id,
        barber_id: form.barber_id,
        service_id: form.service_id,
        shop_id: shopId,
        date: form.date,
        time: form.time,
        notes: form.notes || undefined,
      }),
    onSuccess: () => {
      toast.success(t("page.schedule.bookAppointment"));
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) =>
      toast.error(extractApiError(error, "Failed to create appointment")),
  });

  function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!selectedShop && !form.shop_id)
      errs.shop_id = t("page.schedule.locationRequired");
    if (!form.user_id) errs.user_id = t("page.schedule.customerRequired");
    if (!form.service_id) errs.service_id = t("page.schedule.serviceRequired");
    if (!form.barber_id) errs.barber_id = t("page.schedule.barberRequired");
    if (!form.date) errs.date = t("page.schedule.dateRequired");
    if (!form.time) errs.time = t("page.schedule.timeRequired");
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (isEditing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onOpenChange(false);
          resetForm();
        }
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("page.schedule.editAppointment") : t("page.schedule.newAppointment")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("page.schedule.editDetails") : t("page.schedule.fillDetailsToBook")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Location — only when no shop is globally selected */}
          {!selectedShop && (
            <CreateField
              label={t("page.schedule.location")}
              required
              error={errors.shop_id}
            >
              <SearchableSelect
                options={shopOptions}
                value={form.shop_id || undefined}
                onChange={(v) => {
                  setForm((f) => ({
                    ...blankForm(defaultDate, defaultTime),
                    user_id: f.user_id,
                    shop_id: Number(v),
                  }));
                  setErrors((e) => ({ ...e, shop_id: "" }));
                }}
                placeholder={t("page.schedule.selectLocation")}
              />
            </CreateField>
          )}

          {/* Customer */}
          <CreateField
            label={t("page.schedule.customer")}
            required
            error={errors.user_id}
          >
            <SearchableSelect
              options={customerOptions}
              value={form.user_id || undefined}
              onChange={(v) => {
                setForm((f) => ({ ...f, user_id: Number(v) }));
                setErrors((e) => ({ ...e, user_id: "" }));
              }}
              placeholder={t("page.schedule.selectCustomer")}
              disabled={isEditing}
            />
          </CreateField>

          {/* Service — depends on shop */}
          <CreateField
            label={t("page.schedule.service")}
            required
            error={errors.service_id}
          >
            <SearchableSelect
              options={serviceOptions}
              value={form.service_id || undefined}
              onChange={(v) => {
                setForm((f) => ({
                  ...f,
                  service_id: Number(v),
                  barber_id: 0,
                  date: defaultDate ?? "",
                  time: "",
                }));
                setErrors((e) => ({ ...e, service_id: "" }));
              }}
              placeholder={
                shopId
                  ? t("page.schedule.selectService")
                  : t("page.schedule.selectLocation")
              }
              disabled={!shopId}
            />
          </CreateField>

          {/* Barber — depends on service (filtered client-side) */}
          <CreateField
            label={t("page.schedule.barber")}
            required
            error={errors.barber_id}
          >
            <SearchableSelect
              options={barberOptions}
              value={form.barber_id || undefined}
              onChange={(v) => {
                setForm((f) => ({
                  ...f,
                  barber_id: Number(v),
                  date: defaultDate ?? "",
                  time: "",
                }));
                setErrors((e) => ({ ...e, barber_id: "" }));
              }}
              placeholder={
                form.service_id
                  ? t("page.schedule.selectBarber")
                  : t("page.schedule.selectServiceFirst")
              }
              disabled={!form.service_id}
            />
          </CreateField>

          {/* Date — disabled dates computed from shop + barber data */}
          <CreateField
            label={t("page.schedule.date")}
            required
            error={errors.date}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                  disabled={!form.barber_id}
                >
                  <CalendarIcon className="mr-2 size-4 shrink-0" />
                  <span className={form.date ? "" : "text-muted-foreground"}>
                    {form.date
                      ? format(new Date(form.date), "d MMM yyyy")
                      : t("page.schedule.pickDate")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setForm((f) => ({
                        ...f,
                        date: format(d, "yyyy-MM-dd"),
                        time: "",
                      }));
                      setErrors((e) => ({ ...e, date: "" }));
                    }
                  }}
                  disabled={isDateDisabled}
                />
              </PopoverContent>
            </Popover>
          </CreateField>

          {/* Time slots — button grid from availability API */}
          <CreateField
            label={t("page.schedule.time")}
            required
            error={errors.time}
          >
            {!form.date ? (
              <p className="text-xs text-muted-foreground py-2">
                {t("page.schedule.selectDateFirst")}
              </p>
            ) : isLoadingSlots ? (
              <p className="text-xs text-muted-foreground py-2">
                {t("page.schedule.loadingSlots")}
              </p>
            ) : allSlots.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                {t("page.schedule.noSlotsAvailable")}
              </p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {allSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => {
                      setForm((f) => ({ ...f, time: slot.time }));
                      setErrors((e) => ({ ...e, time: "" }));
                    }}
                    className={cn(
                      "h-10 rounded-md border text-xs flex items-center justify-center gap-1 transition",
                      !slot.available
                        ? "bg-muted/50 border-dashed border-muted-foreground/30 text-muted-foreground/50 cursor-not-allowed line-through"
                        : form.time === slot.time
                          ? "bg-app-text text-black border-app-text"
                          : "bg-background hover:bg-muted/40 border-input text-app-text"
                    )}
                  >
                    {slot.time}
                    <Clock className="size-3 opacity-70" />
                  </button>
                ))}
              </div>
            )}
          </CreateField>

          {/* Notes */}
          <CreateField label={t("page.schedule.notes")}>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder={t("page.schedule.notesPlaceholder")}
              rows={3}
            />
          </CreateField>
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending
              ? t("page.schedule.saving")
              : isEditing
                ? t("page.schedule.saveChanges")
                : t("page.schedule.bookAppointment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
