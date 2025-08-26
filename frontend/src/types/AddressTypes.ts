export interface Address {
    bairro: string,
    cep: string,
    cidade: string,
    createdBy: string,
    complemento: string,
    rua: string,
    _id: string
}

export interface AddressFull {
    bairro: string,
    cep: string,
    cidade: string,
    createdBy: string,
    complemento: string,
    rua: string,
    _id: string,
    filter: ()=> void;
    map: ()=> void
}

