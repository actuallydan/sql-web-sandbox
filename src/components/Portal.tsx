import type { ReactNode } from 'react';
import { createPortal } from 'react-dom'

const Portal = ({ children }: { children?: ReactNode }) => {
    return typeof document === 'object'
        ? createPortal(children, document.body)
        : null;
};

export default Portal;