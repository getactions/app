import { useState, type PropsWithChildren } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";

type Props = PropsWithChildren &
  Readonly<{
    title: React.ReactNode;
    description?: React.ReactNode;
    trigger: React.ReactNode;
  }>;

export function ResponsiveDialog(props: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { title, description, trigger, children } = props;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="p-8 max-w-[1200px]">
          <DialogTitle asChild>{title}</DialogTitle>
          {description ? (
            <DialogDescription asChild>{description}</DialogDescription>
          ) : null}

          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:py-1">{title}</DrawerHeader>

        <div className="py-2 px-4">{children}</div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
