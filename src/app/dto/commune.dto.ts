export type CommuneDto = {
    nom: string
    code: string
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