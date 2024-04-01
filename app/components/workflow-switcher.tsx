import { useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Category = Readonly<{
  id: string;
  name: string;
}>;

type Props = Readonly<{
  categories: ReadonlyArray<Category>;
}>;

export function WorkflowSwitcher({ categories }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(
    categories.find((category) =>
      location.pathname.startsWith(`/${category.id}`),
    ),
  );

  function handleNavigation(categoryId: string) {
    navigate(`/${categoryId}`);
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 text-xl bg-white shadow-xl border-[1px] lg:rounded-full py-6 px-14">
      <p>I need a </p>

      <Select onValueChange={handleNavigation}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={selectedCategory?.name} />
        </SelectTrigger>
        <SelectContent className="text-2xl">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p>Workflow.</p>
    </div>
  );
}
