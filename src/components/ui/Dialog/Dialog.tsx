"use client"

// Essentials
import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

// Components
import Icon from "../Icon/Icon";
import { X } from "@phosphor-icons/react";

type DialogProps = {
    children?: React.ReactNode;
    trigger?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    buttons?: React.ReactNode[] | null;
    preventCloseOnButtons?: number[];
    buttonsStyle?: "columns" | "rows";
    className?: string;
    contentClassName?: string;
    title?: string;
    disableCrop?: boolean;
};

const Dialog: React.FC<DialogProps> = ({
    children,
    trigger,
    defaultOpen,
    open,
    onOpenChange,
    buttons,
    preventCloseOnButtons,
    buttonsStyle = "column",
    className,
    contentClassName,
    title,
    disableCrop
}) => {
    return (
        <RadixDialog.Root
            defaultOpen={defaultOpen}
            open={open}
            onOpenChange={onOpenChange}
        >
            {
                trigger &&
                <RadixDialog.Trigger asChild>
                    <span style={{ display: "contents" }}> {/* This wrapper doesn't affect the DOM */}
                        {trigger}
                    </span>
                </RadixDialog.Trigger>
            }
            <RadixDialog.Portal>
                <RadixDialog.Overlay className="c-Dialog--overlay" />
                <RadixDialog.Content
                    aria-describedby={undefined}
                    className={` 
                        c-Dialog
                        ${className ? className : ""}
                        ${disableCrop ? "disableCrop" : ""}
                    `}
                >
                    <div className="c-Dialog--top">
                        {
                            title &&
                            <RadixDialog.Title className="c-Dialog--title">
                                {title}
                            </RadixDialog.Title>
                        }
                        <RadixDialog.Close asChild className="c-Dialog--closeButton">
                            <button>
                                <Icon of={<X weight="bold" />} />
                            </button>
                        </RadixDialog.Close>
                    </div>
                    <div
                        className={`
                            c-Dialog--wrapper
                            ${!title ? "noTitle" : ""}
                        `}
                    >
                        {
                            children &&
                            <div
                                className={` 
                                    c-Dialog--content
                                    ${contentClassName ? contentClassName : ""}
                                `}
                            >
                                {children}
                            </div>
                        }
                        <div
                            className={` 
                                c-Dialog--buttons
                                ${buttonsStyle === "rows" ? "rows" : "columns"}
                            `}

                        >
                            {
                                buttons?.length && buttons.map((button, i) => (
                                    <React.Fragment key={i}>{
                                        preventCloseOnButtons
                                            ? !preventCloseOnButtons.includes(i)
                                                ? <RadixDialog.Close asChild key={i}>
                                                    {button}
                                                </RadixDialog.Close>
                                                : <React.Fragment key={i}>
                                                    {button}
                                                </React.Fragment>
                                            : <RadixDialog.Close asChild key={i}>
                                                {button}
                                            </RadixDialog.Close>
                                    }</React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
};

export default Dialog;