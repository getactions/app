import { cn } from "~/utils/cn";

type Props = Readonly<{
  className?: string;
  gradient: "picture" | "pink-neon" | "emerald" | "hyper";
  fine?: boolean;
}>;

export const Separator = (props: Props) => (
  <hr
    className={cn(
      "border-none bg-gradient-to-r h-2",
      props.gradient === "picture" &&
        "from-fuchsia-500 via-red-600 to-orange-400",
      props.gradient === "pink-neon" && "from-fuchsia-600 to-pink-600",
      props.gradient === "emerald" && "from-emerald-500 to-lime-600",
      props.gradient === "hyper" && "from-pink-500 via-red-500 to-yellow-500",
      props.fine && "h-[1px]",
      props.className,
    )}
  />
);
