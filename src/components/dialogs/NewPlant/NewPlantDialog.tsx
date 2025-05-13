"use client"

// Essentials
import { useState, useEffect } from "react";

// Models
import { NewPlant, NewPlantErrors } from "@/models/Plant";

// Components
import Dialog, { DialogProps } from "@/components/ui/Dialog/Dialog";
import Button from "@/components/ui/Button/Button";
import Form from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Form/FormField";
import TextField from "@/components/ui/TextField/TextField";

type Props = {
    open: DialogProps["open"];
    onOpenChange: DialogProps["onOpenChange"];
}

const NewPlantDialog: React.FC<Props> = ({
    open,
    onOpenChange
}) => {
    // Reset form.
    useEffect(() => {
        setFormData(formDataDefault);
        setFormDataErrors(formDataErrorsDefault);
    }, [open]);

    const formDataDefault = {
        name: "",
        type: "",
        weeklyWaterNeed: 0,
        expectedHumidity: 0
    }
    const [formData, setFormData] = useState<NewPlant>(formDataDefault);

    const formDataErrorsDefault = {
        name: "",
        type: "",
        weeklyWaterNeed: "",
        expectedHumidity: ""
    }
    const [formDataErrors, setFormDataErrors] = useState<NewPlantErrors>(formDataErrorsDefault);

    const handleFormChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData({
            ...formData,
            [name]: value
        });

        switch (name) {
            case "name":
                setFormDataErrors({
                    ...formDataErrors,
                    name: "",
                });
                break;
            case "type":
                setFormDataErrors({
                    ...formDataErrors,
                    type: "",
                });
                break;
            case "weeklyWaterNeed":
                setFormDataErrors({
                    ...formDataErrors,
                    weeklyWaterNeed: "",
                });
                break;
            case "expectedHumidity":
                setFormDataErrors({
                    ...formDataErrors,
                    expectedHumidity: "",
                });
                break;
            default:
                setFormDataErrors(formDataErrorsDefault);
                break;
        }
    }

    const onSavePlant = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!formData.name && !formData.type && formData.expectedHumidity === undefined && formData.weeklyWaterNeed === undefined) { // Check all inputs.
                setFormDataErrors({
                    name: "missing",
                    type: "missing",
                    weeklyWaterNeed: "missing",
                    expectedHumidity: "missing"
                });
            } else if (!formData.name) { // Check plant name.
                setFormDataErrors({
                    ...formDataErrors,
                    name: "missing"
                });
            } else if (!formData.type) { // Check plant type.
                setFormDataErrors({
                    ...formDataErrors,
                    type: "missing"
                });
            } else if (formData.weeklyWaterNeed === undefined) { // Check weekly water need.
                setFormDataErrors({
                    ...formDataErrors,
                    weeklyWaterNeed: "missing"
                });
            } else if (formData.expectedHumidity === undefined) {  // Check expected humidity.
                setFormDataErrors({
                    ...formDataErrors,
                    expectedHumidity: "missing"
                });
            } else if (formData.weeklyWaterNeed <= 0) {  // Check weekly water need range.
                setFormDataErrors({
                    ...formDataErrors,
                    weeklyWaterNeed: "tooLow"
                });
            } else if (formData.expectedHumidity <= 0 || formData.expectedHumidity > 100) {  // Check expected humidity range.
                setFormDataErrors({
                    ...formDataErrors,
                    expectedHumidity: "outOfRange"
                });
            } else { // Valid form.                

            }
        } catch (error: any) {
            /* if (error.headers?.key === "wrong") {
                setLoginFormErrors({
                    ...loginFormErrors,
                    email: "wrong",
                    password: "wrong",
                    captchaToken: "needsRerender"
                })
            } else if (error.headers?.key === "checkCaptchaToken") {
                setLoginFormErrors({
                    ...loginFormErrors,
                    captchaToken: "failed"
                })
            } */
        }
    }

    return (
        <Dialog
            title="Add New Plant"
            className="d-NewPlant"
            open={open}
            onOpenChange={onOpenChange}
            buttons={[
                <Button
                    key="approve"
                    onClick={onSavePlant}
                >
                    Save
                </Button>
            ]}
            preventCloseOnButtons={[0]}
            buttonsStyle="rows"
        >
            <Form className="p-AuthLogin--form" onSubmit={onSavePlant}>
                <FormField
                    name="name"
                    headline="Plant Name"
                    errors={[
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.name === "missing",
                            message: "Please enter a name."
                        }
                    ]}
                >
                    <TextField
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        className={
                            formDataErrors.name
                                ? "error"
                                : ""
                        }
                    />
                </FormField>
                <FormField
                    name="type"
                    headline="Plant Type"
                    errors={[
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.type === "missing",
                            message: "Please enter a type."
                        }
                    ]}
                >
                    <TextField
                        name="type"
                        type="text"
                        required
                        value={formData.type}
                        onChange={handleFormChange}
                        className={
                            formDataErrors.type
                                ? "error"
                                : ""
                        }
                    />
                </FormField>
                <FormField
                    name="type"
                    headline="Weekly Water Need (ml)"
                    errors={[
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.weeklyWaterNeed === "missing",
                            message: "Please enter a number."
                        },
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.weeklyWaterNeed === "tooLow",
                            message: "Water need must be at least 1 ml."
                        }
                    ]}
                >
                    <TextField
                        name="weeklyWaterNeed"
                        type="number"
                        required
                        value={formData.weeklyWaterNeed as any}
                        onChange={handleFormChange}
                        className={
                            formDataErrors.weeklyWaterNeed
                                ? "error"
                                : ""
                        }
                    />
                </FormField>
                <FormField
                    name="type"
                    headline="Expected Relative Humidity (%)"
                    errors={[
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.expectedHumidity === "missing",
                            message: "Please enter a number."
                        },
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.expectedHumidity === "outOfRange",
                            message: "Percentage must be between 1 and 100."
                        }
                    ]}
                >
                    <TextField
                        name="expectedHumidity"
                        type="number"
                        required
                        value={formData.expectedHumidity as any}
                        onChange={handleFormChange}
                        className={
                            formDataErrors.expectedHumidity
                                ? "error"
                                : ""
                        }
                    />
                </FormField>
            </Form>
        </Dialog>
    );
};

export default NewPlantDialog;