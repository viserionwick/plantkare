// Models
import { Timestamp as TimestampFirestore } from "firebase/firestore";
import { Timestamp as TimestampAdmin } from "firebase-admin/firestore";

export type Timestamp = TimestampFirestore | TimestampAdmin;