import { ChevronDown } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../store/useFilterStore";

import { Button } from "@heroui/react";

function DropDownMenu({ title, onClick }) {
  const navigate = useNavigate();
  const setMultipleFilters = useFilterStore(
    (state) => state.setMultipleFilters
  );
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const categories = ["Casual", "Running", "Sneakers", "Basketball"];

  const genderValue = title === "Hombres" ? "men" : "women";

  const handleFilterClick = (category) => {
    resetFilters();
    setMultipleFilters({
      gender: [genderValue],
      category: [category],
    });
    navigate("/products");
    if (onClick) onClick();
  };

  return (
    <Dropdown>
      <DropdownTrigger className="flex items-center justify-center gap-1 font-semibold text-black cursor-pointer">
        <Button>
          {title}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-white border border-gray-200 rounded-md shadow-lg px-5">
        <DropdownSection
          title={`Categorías ${title}`}
          className="font-semibold text-gray-700 text-center"
        >
          {categories.map((category) => (
            <DropdownItem
              key={category}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded"
              onClick={() => handleFilterClick(category)}
            >
              {category}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDownMenu;
