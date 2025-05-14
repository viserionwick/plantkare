// Essentials
import { Timestamp } from "firebase/firestore";
import { Timestamp as TimestampType } from "@/types/timestamp";
import moment from "moment-timezone";

type FormatTimestamp = (
    rawTimestamp: TimestampType,
    format: string
) => string;

const formatTimestamp: FormatTimestamp = (rawTimestamp, format) => {
    const timestamp = new Timestamp((rawTimestamp as any)._seconds, (rawTimestamp as any)._nanoseconds);
    return moment(timestamp.toDate()).format(format);
}

export default formatTimestamp;