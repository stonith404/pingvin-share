import { ActionIcon } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { TbChevronDown, TbChevronUp, TbSelector } from "react-icons/tb";

export type TableSort = {
  property?: string;
  direction: "asc" | "desc";
};

const TableSortIcon = ({
  sort,
  setSort,
  property,
}: {
  sort: TableSort;
  setSort: Dispatch<SetStateAction<TableSort>>;
  property: string;
}) => {
  if (sort.property === property) {
    return (
      <ActionIcon
        onClick={() =>
          setSort({
            property,
            direction: sort.direction === "asc" ? "desc" : "asc",
          })
        }
      >
        {sort.direction === "asc" ? <TbChevronDown /> : <TbChevronUp />}
      </ActionIcon>
    );
  } else {
    return (
      <ActionIcon onClick={() => setSort({ property, direction: "asc" })}>
        <TbSelector />
      </ActionIcon>
    );
  }
};

export default TableSortIcon;
