"use client"

// Essentials
import { useState, useEffect } from "react";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Models
import { NewPlant, NewPlantErrors, Plant, UpdatePlant } from "@/models/Plant";

// Components
import Dialog, { DialogProps } from "@/components/ui/Dialog/Dialog";
import Button from "@/components/ui/Button/Button";
import Form from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Form/FormField";
import TextField from "@/components/ui/TextField/TextField";
import axios from "axios";

export type PROPS = {
    open: DialogProps["open"];
    onOpenChange: DialogProps["onOpenChange"];
    plantToUpdate?: UpdatePlant;
    onSave: (plant?: Plant) => void;
}

const PlantDialog: React.FC<PROPS> = ({
    open,
    onOpenChange,
    plantToUpdate,
    onSave,
}) => {
    const { getIdToken } = useAuthContext();

    // Reset form.
    useEffect(() => {
        setFormData(plantToUpdate || formDataDefault);
        setFormDataErrors(formDataErrorsDefault);
    }, [open]);

    const formDataDefault = {
        name: "",
        type: "",
        weeklyWaterNeed: 0,
        expectedHumidity: 0,
        locationQuery: ""
    }
    const formDataErrorsDefault = {
        name: "",
        type: "",
        weeklyWaterNeed: "",
        expectedHumidity: "",
        locationQuery: ""
    }

    const [formData, setFormData] = useState<NewPlant>(plantToUpdate || formDataDefault);
    const [formDataErrors, setFormDataErrors] = useState<NewPlantErrors>(formDataErrorsDefault);
    const [saving, setSaving] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
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
            case "locationQuery":
                setFormDataErrors({
                    ...formDataErrors,
                    locationQuery: "",
                });
                break;
            default:
                setFormDataErrors(formDataErrorsDefault);
                break;
        }
    }

    const handleSavePlant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!formData.name && !formData.type && formData.expectedHumidity === undefined && formData.weeklyWaterNeed === undefined) { // Check all inputs.
                setFormDataErrors({
                    name: "missing",
                    type: "missing",
                    weeklyWaterNeed: "missing",
                    expectedHumidity: "missing",
                    locationQuery: "missing"
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
            } else if (!formData.locationQuery) { // Check location query.
                setFormDataErrors({
                    ...formDataErrors,
                    locationQuery: "missing"
                });
            } else { // Valid form.
                setSaving(true);
                const response = await axios.post(
                    plantToUpdate
                        ? "/api/plants/update"
                        : "/api/plants/new",
                    {
                        idToken: await getIdToken(),
                        formData,
                        plantID: plantToUpdate?.plantID
                    });
                if (response.status === 200) {
                    setSaving(false);
                    onOpenChange!(false);
                    onSave();
                }
            }
        } catch (error: any) {
            setSaving(false);
            console.log("ERROR: ", error);
        }
    }

    return (
        <Dialog
            title={
                plantToUpdate
                    ? "Update Plant"
                    : "Add New Plant"
            }
            className="d-NewPlant"
            open={open}
            onOpenChange={onOpenChange}
            buttons={[
                <Button
                    key="approve"
                    onClick={handleSavePlant}
                    loading={saving}
                    disabled={saving}
                    keepSizeOnLoading
                >
                    {
                        !plantToUpdate
                            ? "Add"
                            : "Update"
                    }
                </Button>
            ]}
            preventCloseOnButtons={[0]}
            buttonsStyle="rows"
        >
            <Form className="p-AuthLogin--form" onSubmit={handleSavePlant}>
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
                    name="weeklyWaterNeed"
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
                    name="expectedHumidity"
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
                <FormField
                    name="locationQuery"
                    headline="Location Address (350 5th Ave, New York, NY 10118)"
                    errors={[
                        {
                            match: "valueMissing",
                            forceMatch: formDataErrors.locationQuery === "missing",
                            message: "Please enter a location."
                        }
                    ]}
                >
                    <TextField
                        name="locationQuery"
                        type="text"
                        required
                        value={formData.locationQuery}
                        onChange={handleFormChange}
                        className={
                            formDataErrors.locationQuery
                                ? "error"
                                : ""
                        }
                    />
                </FormField>
            </Form>
        </Dialog>
    );
};

export default PlantDialog;