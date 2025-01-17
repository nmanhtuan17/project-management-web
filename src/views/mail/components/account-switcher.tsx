import { cn } from "@/lib/utils.ts"

interface AccountSwitcherProps {
  isCollapsed: boolean,
}

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select.tsx'
import { useMailContext } from "@/views/mail";
import { useAppSelector } from "@/redux/store";

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {

  const { user } = useAppSelector(state => state.auth)

  return (
    <Select value={user.internalEmail}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
          "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {user.internalEmail}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {user.internalEmail ?
          (<SelectItem key={user.internalEmail} value={user.internalEmail}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {user.internalEmail}
            </div>
          </SelectItem>
          ) : (
            <SelectItem value="nodata" disabled>
              <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                No active mail
              </div>
            </SelectItem>
          )}
      </SelectContent>
    </Select>
  )
}
