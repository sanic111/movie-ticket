import React, {useState, forwardRef, useImperativeHandle} from "react";
import Icon from "@/assets/icons/Icon";

export interface DropdownSectionHandle {
    open(): void;
    close(): void;
    toggle(): void;
}

export interface DropdownSectionProps {
    title?: string; // Cho phép optional nếu dùng customHeader
    defaultOpen?: boolean;
    children?: React.ReactNode;
    /**
     * Nếu false: luôn mở, không thể collapse
     * Mặc định true
     */
    collapsible?: boolean;
    /**
     * Nếu true: ẩn icon dropdown
     */
    hideIcon?: boolean;
    /**
     * Nếu true: không hiển thị dropdown, chỉ là tiêu đề tĩnh
     */
    isStaticTitle?: boolean;
    /**
     * Cho phép custom header (ví dụ để bỏ class title)
     */
    customHeader?: React.ReactNode;
}

const DropdownSection = forwardRef<DropdownSectionHandle, DropdownSectionProps>(
    (
        {
            title,
            defaultOpen = false,
            children,
            collapsible = true,
            hideIcon = false,
            isStaticTitle = false,
            customHeader,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);

        useImperativeHandle(
            ref,
            () => ({
                open: () => setIsOpen(true),
                close: () => setIsOpen(false),
                toggle: () => setIsOpen((o) => !o),
            }),
            []
        );

        // Nếu là static title -> render đúng 1 title cứng, không có dropdown
        if (isStaticTitle) {
            return <div className="section-title">{title}</div>;
        }

        const canToggle = collapsible;

        return (
            <div className={`dropdown-section ${isOpen ? "expanded" : "collapsed"}`}>
                <button className="dropdown-button" onClick={() => canToggle && setIsOpen((o) => !o)}>
                    {customHeader ? customHeader : <span className="title">{title}</span>}

                    {!hideIcon && <Icon name={isOpen ? "dropdownUp" : "dropdownDown"} className="icon" />}
                </button>

                <div className={`content ${isOpen || !canToggle ? "expanded" : "collapsed"}`}>{children}</div>
            </div>
        );
    }
);

export default DropdownSection;
