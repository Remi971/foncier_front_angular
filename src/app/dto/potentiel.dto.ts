import { CommuneDto } from "./commune.dto";

export type PotentielDto = CommuneDto & {
    minSurfParNue: number 
    minSurfParBatie: number 
    maxCes: number
    minSurfDivision: number
    distBufferTest: number 
    distBufferBati: number
}