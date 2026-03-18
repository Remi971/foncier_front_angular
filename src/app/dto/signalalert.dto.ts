import { ProcessStatus } from "./process.dto"

export type SignalAlertDto = {
    type: ProcessStatus,
    message: string,
    duration?: number
}