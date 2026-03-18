import { Commune } from "./commune.dto"

export interface EnveloppeDto {
    info: EnveloppeInfoDto
    data: GeoJSON.FeatureCollection
}

export type EnveloppeInfoDto = Commune &  {
    bufferBati: number
    dilatation: number
    erosion: number
    maxSurfResidus: number
    maxSurfTrou: number
    minPartInBuffer: number
    minSurfBati: number
    minSurfEnv: number
}