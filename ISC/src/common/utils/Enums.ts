export enum SortingType {
    ID = 'ID',
    NAME = 'NAME',
    DATE = 'DATE',
    LINE = 'LINE',
    MANUFACTURER = 'MANUFACTURER'
}

export enum ShiftType {
    PRIMEIRO_TURNO = '1° Turno',
    SEGUNDO_TURNO = '2° Turno',
    TERCEIRO_TURNO = '3° Turno',
    TURNO_ESPECIAL = 'Turno Especial'
}

export enum ValidType {
    IS_NUMERIC = 'IS_NUMERIC',
    IS_ALPHANUMERIC = 'IS_ALPHANUMERIC',
    IS_ALPHABETIC = 'IS_ALPHABETIC',
    ALL_CARACTERS = 'ALL_CARACTERS'
}

export enum VerifyCredentials {
    verifyUsername = 'login',
    verifyPassword = 'password'
}