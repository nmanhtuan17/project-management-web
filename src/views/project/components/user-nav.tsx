import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useAppDispatch, useAppSelector} from "@/redux/store.ts";
import {setAuth} from "@/redux/slices/auth.slice.ts";
import {useNavigate} from "react-router-dom";
// import {useDialogs} from "@/components/providers/alert-dialog-provider.tsx";
import {useState} from "react";
import useCurrentSpace from "@/lib/hooks/useCurrentProject";

export function UserNav() {
  const dispatch = useAppDispatch();
  const currentSpace = useCurrentSpace();
  const {user} = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  // const dialogs = useDialogs();
  if (!user) return;
  const [hide, setHide] = useState(true);

  // const handleLogout = () => {
  //   dialogs.confirm({
  //     title: "Do you want to log out?",
  //     actionButton: "Logout"
  //   }).then(async (confirmed) => {
  //     if (confirmed) {
  //       dispatch(setAuth({
  //         loggedIn: false,
  //         tokens: {},
  //         user: undefined,
  //       }));
  //       navigate("/auth/login");
  //     }
  //   })
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.fullName}/>
            <AvatarFallback>{user?.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            navigate(`/settings/base-information`)
          }}>
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          {currentSpace._id ? (
            <DropdownMenuItem onClick={() => {
              navigate(`/spaces/${currentSpace.slug}/settings/profile`)
            }}>
              Preferences
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => {
              navigate(`/boarding`)
            }}>
              Switch Space
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => {}}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
