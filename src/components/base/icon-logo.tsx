import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  withWordmark?: boolean;
  monochrome?: string;
};

export default function IconLogo({
  className,
  withWordmark = true,
  monochrome: _monochrome,
}: Props) {
  return (
    <div className={
      cn("inline-flex items-center gap-2 dark:bg-white rounded-md", className,
        withWordmark ? "rounded-md p-1" : "rounded-0"
      )
    }>
      {withWordmark ? (
        <img
          src="/tepth-logo.png"
          alt="logo"
          className="h-8 w-auto object-cover rounded"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <img
          src="/tepth-logo.png"
          alt="logo"
          className="h-6 w-auto object-cover rounded"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
