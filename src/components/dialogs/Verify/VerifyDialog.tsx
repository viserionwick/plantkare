"use client"

// Components
import Dialog, { DialogProps } from "@/components/ui/Dialog/Dialog";
import Button from "@/components/ui/Button/Button";

export type PROPS = {
    open: DialogProps["open"];
    onOpenChange: DialogProps["onOpenChange"];
    onApprove: (data: PROPS["data"]) => void;
    onCancel?: () => void;
    approveButton?: string;
    cancelButton?: string;
    preventCloseOnApprove?: boolean;
    loading?: boolean;
    content: React.ReactNode;
    data: any;
}

const VerifyDialog: React.FC<PROPS> = ({
    open,
    onOpenChange,
    onApprove,
    onCancel,
    approveButton,
    cancelButton,
    preventCloseOnApprove = true,
    loading,
    content,
    data
}) => {
    return (
        <Dialog
            title="Are You Sure?"
            className="d-VerifyDialog"
            open={open}
            onOpenChange={onOpenChange}
            buttons={[
                <Button
                    key="approve"
                    onClick={() => onApprove(data)}
                    loading={loading}
                    disabled={loading}
                    keepSizeOnLoading
                >
                    {approveButton || "Yes"}
                </Button>,
                <Button
                    key="cancel"
                    onClick={onCancel}
                    inverted
                >
                    {cancelButton || "Cancel"}
                </Button>
            ]}
            preventCloseOnButtons={preventCloseOnApprove ? [0] : []}
            buttonsStyle="columns"
        >
            {content}
        </Dialog>
    );
};

export default VerifyDialog;