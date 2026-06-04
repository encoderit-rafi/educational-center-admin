import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog, RowActions, ListPagination } from "@/components/shared";
import AppTable from "@/components/app-table";
import { userService, type UserFormData } from "@/services/users";
import { shopService } from "@/services/shops";
import { useDebounce } from "@/hooks/search-hooks";
import { extractApiError } from "@/utils/error";
import type { ColumnDef } from "@tanstack/react-table";
import { useCurrentUser, type User } from "@/hooks/useCurrentUser";
import { usePermission } from "@/hooks/usePermission";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface UserForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  selected_shop_id: number | null;
}

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  selected_shop_id: null,
};

type FormErrors = Partial<Record<keyof UserForm, string>>;

type Props = {
  role: string;
  titleKey: string;
  onView?: (user: User) => void;
};

export function UserListPage({ role, titleKey, onView }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data } = useQuery({
    queryKey: ["users", role, debouncedSearch, page, pageSize],
    queryFn: () =>
      userService.getByRole(role, {
        search: debouncedSearch || undefined,
        page,
        per_page: pageSize,
      }),
  });

  const { data: currentUser } = useCurrentUser();
  const { can } = usePermission();
  const permPrefix = role === "customer" ? "customers" : "admin";
  const canCreate = can(`${permPrefix}.create`);
  const canEdit = can(`${permPrefix}.edit`);
  const canDelete = can(`${permPrefix}.delete`);

  const { data: adminCountData } = useQuery({
    queryKey: ["admin-count"],
    queryFn: () => userService.getByRole("admin", { page: 1, per_page: 1 }),
    enabled: role === "admin",
    staleTime: 30000,
  });
  const totalAdmins = adminCountData?.meta?.total ?? 0;

  const { data: shopsData } = useQuery({
    queryKey: ["shops-list"],
    queryFn: shopService.getAll,
    enabled: role === "inventory-manager",
  });
  const shops = shopsData?.data ?? [];

  const users = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: (payload: UserFormData) => userService.create(payload),
    onSuccess: () => {
      toast.success(t("common.save"));
      queryClient.invalidateQueries({ queryKey: ["users", role] });
      closeDialog();
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to create user")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) =>
      userService.update(id, data),
    onSuccess: () => {
      toast.success(t("common.save"));
      queryClient.invalidateQueries({ queryKey: ["users", role] });
      closeDialog();
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update user")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      toast.success(t("common.delete"));
      queryClient.invalidateQueries({ queryKey: ["users", role] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to delete user")),
  });

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      password: "",
      password_confirmation: "",
      selected_shop_id: user.selected_shop_id,
    });
    setErrors({});
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingUser(null);
    setErrors({});
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = t("page.users.nameRequired");
    if (!form.email.trim()) next.email = t("page.users.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = t("page.users.emailInvalid");
    if (!editingUser) {
      if (!form.password) next.password = t("page.users.passwordRequired");
      else if (form.password.length < 8) next.password = t("page.users.passwordMin");
      else if (form.password !== form.password_confirmation)
        next.password_confirmation = t("page.users.passwordMismatch");
    }
    if (role === "inventory-manager" && !form.selected_shop_id)
      next.selected_shop_id = t("page.users.shopRequired");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<UserFormData> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
    };

    if (!editingUser) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
      payload.role = role;
    }

    if (role === "inventory-manager") {
      payload.selected_shop_id = form.selected_shop_id;
    }

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload });
    } else {
      createMutation.mutate(payload as UserFormData);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "sl",
        header: () => t("common.sl"),
        cell: ({ row }) => (
          <span className="text-app-text-muted">
            {String((page - 1) * pageSize + row.index + 1).padStart(2, "0")}
          </span>
        ),
      },
      {
        id: "name",
        header: () => t("page.users.name"),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                {initials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-app-text">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: "phone",
        header: () => t("page.users.phone"),
        cell: ({ row }) => (
          <span className="text-app-text-muted">
            {row.original.phone || "—"}
          </span>
        ),
      },
      {
        id: "email",
        header: () => t("page.users.email"),
        cell: ({ row }) => (
          <span className="text-app-text-muted">{row.original.email || "—"}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">{t("common.action")}</span>,
        cell: ({ row }) => {
          const isSelf = currentUser?.id === row.original.id;
          const isLastAdmin = role === "admin" && totalAdmins <= 1;

          return (
            <RowActions
              onView={onView ? () => onView(row.original) : undefined}
              onEdit={canEdit ? () => openEdit(row.original) : undefined}
              onDelete={canDelete && !isSelf && !isLastAdmin ? () => setDeleteTarget(row.original) : undefined}
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, page, pageSize, currentUser?.id, totalAdmins, role]
  );

  const pageTitle = t(titleKey);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-app-text">{pageTitle}</h1>
        <nav className="text-sm text-app-text-muted flex items-center gap-2">
          <span>{t("breadcrumbs.dashboard")}</span>
          <span>›</span>
          <span className="text-app-text-muted/60">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-app-text-muted" />
          <Input
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 bg-background rounded-xl"
          />
        </div>
        {canCreate && (
          <Button onClick={openCreate} className="h-10 px-4 gap-1.5 rounded-xl" variant="primary">
            <Plus className="size-4" />
            {t("common.addNew")}
          </Button>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <AppTable data={users} columns={columns} emptyMessage={t("common.noResults")} />

        {total > 0 && (
          <div className="px-6 py-4 border-t border-border">
            <ListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? t("common.edit") : t("common.addNew")} {pageTitle.toLowerCase()}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>
                {t("page.users.name")}
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                {t("page.users.email")}
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("page.users.phone")}</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label>
                    {t("page.users.password")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("page.users.passwordConfirmation")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => {
                      setForm({ ...form, password_confirmation: e.target.value });
                      if (errors.password_confirmation)
                        setErrors((p) => ({ ...p, password_confirmation: undefined }));
                    }}
                  />
                  {errors.password_confirmation && (
                    <p className="text-xs text-red-500">{errors.password_confirmation}</p>
                  )}
                </div>
              </>
            )}

            {role === "inventory-manager" && (
              <div className="space-y-2">
                <Label>
                  {t("page.users.shop")}
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Select
                  value={form.selected_shop_id ? String(form.selected_shop_id) : ""}
                  onValueChange={(v) => {
                    setForm({ ...form, selected_shop_id: Number(v) });
                    if (errors.selected_shop_id)
                      setErrors((p) => ({ ...p, selected_shop_id: undefined }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("page.users.selectShop")} />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={String(shop.id)}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selected_shop_id && (
                  <p className="text-xs text-red-500">{errors.selected_shop_id}</p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? t("common.loading")
                  : editingUser
                    ? t("common.save")
                    : t("common.addNew")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title={t("common.delete")}
        description={`${t("common.delete")} "${deleteTarget?.name}"?`}
        confirmLabel={t("common.delete")}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
