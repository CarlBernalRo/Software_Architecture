export class Paciente {
    constructor(
        public readonly id: number,
        public nombre: string,
        public documento: string,
        public correo: string
    ) { }
}
