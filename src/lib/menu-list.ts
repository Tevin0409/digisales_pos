import {
  Settings,
  SquarePen,
  LayoutGrid,
  ScrollText,
  ArrowLeftRight,
  UserCheck,
  // ShoppingBag,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  isBranchManager: boolean | undefined,
  isAdmin: boolean | undefined,
): Group[] {
  if (isBranchManager) {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: LayoutGrid,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: "Items & Inventory",
        menus: [
          {
            href: "/inventory",
            label: "Inventory",
            active: pathname.includes("/products"),
            icon: SquarePen,
            submenus: [
              {
                href: "/inventory",
                label: "Branch Inventory",
                active: pathname === "/inventory",
              },
              // {
              //   href: "/inventory/stocktake",
              //   label: "Stock Take",
              //   active: pathname === "/inventory/stocktake",
              // },
            ],
          },
          // {
          //   href: "/categories",
          //   label: "Categories",
          //   active: pathname.includes("/categories"),
          //   icon: Bookmark,
          //   submenus: [],
          // },
        ],
      },
      {
        groupLabel: "Sales",
        menus: [
          {
            href: "/reports",
            label: "Sales Reports",
            active: pathname.includes("/products"),
            icon: ScrollText,
            submenus: [
              {
                href: "/reports/itemized",
                label: "Itemized Sales Report",
                active: pathname === "/itemized",
              },
              {
                href: "/reports/zReport",
                label: "Z Report",
                active: pathname === "/zReport",
              },
              {
                href: "/reports/general",
                label: "Daily Sales Report",
                active: pathname === "/general",
              },
              // {
              //   href: "/posts/new",
              //   label: "New Post",
              //   active: pathname === "/posts/new",
              // },
            ],
          },
          {
            href: "/transactions",
            label: "Transactions",
            active: pathname.includes("/categories"),
            icon: ArrowLeftRight,
            submenus: [],
          },
          // {
          //   href: "/clearance",
          //   label: "Cashier Clearance",
          //   active: pathname.includes("/clearance"),
          //   icon: UserCheck,
          //   submenus: [],
          // },
          // {
          //   href: "/reservations",
          //   label: "Reservations",
          //   active: pathname.includes("/reservations"),
          //   icon: ShoppingBag,
          //   submenus: [],
          // },
        ],
      },
      {
        groupLabel: "Settings",
        menus: [
          // {
          //   href: "/users",
          //   label: "Users",
          //   active: pathname.includes("/users"),
          //   icon: Users,
          //   submenus: [],
          // },
          {
            href: "/account",
            label: "Account",
            active: pathname.includes("/account"),
            icon: Settings,
            submenus: [],
          },
        ],
      },
    ];
  } else if (isAdmin) {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: LayoutGrid,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: "Items & Inventory",
        menus: [
          {
            href: "/inventory",
            label: "Inventory",
            active: pathname.includes("/products"),
            icon: SquarePen,
            submenus: [
              {
                href: "/inventory",
                label: "Branch Inventory",
                active: pathname === "/inventory",
              },
              // {
              //   href: "/inventory/stocktake",
              //   label: "Stock Take",
              //   active: pathname === "/inventory/stocktake",
              // },
            ],
          },
          // {
          //   href: "/categories",
          //   label: "Categories",
          //   active: pathname.includes("/categories"),
          //   icon: Bookmark,
          //   submenus: [],
          // },
        ],
      },
      {
        groupLabel: "Sales",
        menus: [
          {
            href: "/reports",
            label: "Sales Reports",
            active: pathname.includes("/products"),
            icon: ScrollText,
            submenus: [
              {
                href: "/reports/itemized",
                label: "Itemized Sales Report",
                active: pathname === "/itemized",
              },
              {
                href: "/reports/zReport",
                label: "Z Report",
                active: pathname === "/zReport",
              },
              {
                href: "/reports/general",
                label: "Daily Sales Report",
                active: pathname === "/general",
              },
              // {
              //   href: "/posts/new",
              //   label: "New Post",
              //   active: pathname === "/posts/new",
              // },
            ],
          },
          {
            href: "/transactions",
            label: "Transactions",
            active: pathname.includes("/categories"),
            icon: ArrowLeftRight,
            submenus: [],
          },
          {
            href: "/clearance",
            label: "Cashier Clearance",
            active: pathname.includes("/clearance"),
            icon: UserCheck,
            submenus: [],
          },
          // {
          //   href: "/reservations",
          //   label: "Reservations",
          //   active: pathname.includes("/reservations"),
          //   icon: ShoppingBag,
          //   submenus: [],
          // },
        ],
      },
      {
        groupLabel: "Settings",
        menus: [
          // {
          //   href: "/users",
          //   label: "Users",
          //   active: pathname.includes("/users"),
          //   icon: Users,
          //   submenus: [],
          // },
          {
            href: "/account",
            label: "Account",
            active: pathname.includes("/account"),
            icon: Settings,
            submenus: [],
          },
        ],
      },
    ];
  } else {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: LayoutGrid,
            submenus: [],
          },
        ],
      },

      {
        groupLabel: "Sales",
        menus: [
          {
            href: "/transactions",
            label: "Transactions",
            active: pathname.includes("/categories"),
            icon: ArrowLeftRight,
            submenus: [],
          },
          // {
          //   href: "/reservations",
          //   label: "Reservations",
          //   active: pathname.includes("/reservations"),
          //   icon: ShoppingBag,
          //   submenus: [],
          // },
        ],
      },
      {
        groupLabel: "Settings",
        menus: [
          // {
          //   href: "/users",
          //   label: "Users",
          //   active: pathname.includes("/users"),
          //   icon: Users,
          //   submenus: [],
          // },
          {
            href: "/account",
            label: "Account",
            active: pathname.includes("/account"),
            icon: Settings,
            submenus: [],
          },
        ],
      },
    ];
  }
}
