import { CommuneDto } from "./commune.dto";

export enum ProcessType {
    DATA_DOWNLOAD = "DATA_DOWNLOAD",
    DATA_PROCESSING = "DATA_PROCESSING",
    POTENTIEL_CALCULATION = "POTENTIEL_CALCULATION",
    ENVELOPPE_GENERATION = "ENVELOPPE_GENERATION"
}

export interface CommuneProcess {
    code_insee: string
    nom: string
}

export interface EnveloppeProcess {
    minSurfBati: number
    bufferBati: number
    dilatation: number
    erosion: number
    minPartInBuffer: number
    maxSurfTrou: number
    minSurfEnv: number
    maxSurfResidus: number
}

export interface PotentielProcess {
    minSurfParNue: number
    minSurfParBatie: number
    maxCes: number
    minSurfDivision: number
    distBufferTest: number
    distBufferBati: number
}

export interface ProcessSchemaDto {
    type: ProcessType,
    parameters: CommuneDto | EnveloppeProcess | PotentielProcess

}