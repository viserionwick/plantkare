"use client"

// Essentials
import React, { useState } from "react";

// Components
import ReactDatePicker from "react-datepicker";

// Styles
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = {
    onDateChange: (dates: {
        startDate: Date;
        endDate: Date;
    }) => void;
    startDate: Date;
    endDate: Date;
};

const DatePicker: React.FC<DatePickerProps> = ({
    onDateChange,
    startDate,
    endDate
}) => {
    const CustomDateButton = React.forwardRef<any>(({ value, onClick }: any, ref) => (
        <button
            ref={ref}
            onClick={onClick}
            className={`
                c-DatePicker
            `}
        >
            {value || "Select Date"}
        </button>
    ));
    CustomDateButton.displayName = "CustomDateButton";

    const [newStartDate, setNewStartDate] = useState(startDate);
    const [newEndDate, setNewEndDate] = useState(endDate);
    const onChange = (dates: any) => {
        const [start, end] = dates;
        setNewStartDate(start);
        setNewEndDate(end);
        if (end) {
            onDateChange({
                startDate: start,
                endDate: end
            })
        }
    };

    return (
        <div className="c-DatePicker--wrapper">
            <ReactDatePicker
                selected={startDate}
                onChange={onChange}
                startDate={newStartDate}
                endDate={newEndDate}
                dateFormat="yyyy-MM-dd"
                customInput={<CustomDateButton />}
                popperClassName="c-DatePicker--popup"
                selectsRange
                maxDate={new Date()}
            />
        </div>
    );
};

export default DatePicker;