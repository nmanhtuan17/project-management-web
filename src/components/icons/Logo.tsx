import React from "react";
import {useAppSelector} from "@/redux/store.ts";
import {ThemeMode} from "@/enums";

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const {theme} = useAppSelector(state => state.app);
  const stroke = {
    [ThemeMode.LIGHT]: "#0F172A",
    [ThemeMode.DARK]: "#fff"
  };
  return (
    <svg {...props} width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.4507 1.5L20.1174 16.5H2.54927L10.8826 1.5H28.4507Z" stroke={stroke[theme]} strokeWidth="3"/>
      <path d="M11 1.5L20 16.5" stroke={stroke[theme]} strokeWidth="3"/>
    </svg>
  );
}
