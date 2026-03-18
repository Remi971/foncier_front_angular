export type Commune = {
    nom: string
    code: string
}

export type CommuneDto = Commune & {
    centre: {
        type: string,
        coordinates: number[]
    }
}

export type CommuneResponseDto = CommuneDto & {
    _score: number
}

export type CommuneAppDto = CommuneDto & {
    data: boolean
}