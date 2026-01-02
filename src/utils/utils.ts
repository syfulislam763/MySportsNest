import { ReactNode } from "react";

export const renderNode = (node?: ReactNode | (() => ReactNode)) =>
    typeof node === 'function' ? node() : node;